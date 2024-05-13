import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text as RNText, Dimensions, Animated, TouchableOpacity, Modal, Image, ImageBackground } from 'react-native';
import Svg, { Path, G, Text, TSpan, Defs, LinearGradient, Stop } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
import Axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../config";
import { Audio } from 'expo-av';


const { width } = Dimensions.get('screen');
const numberOfSegments = 10;
const wheelSize = width * 0.95;
const fontSize = 12;
const fontFamily= "PoppinsSemi";
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({ hue: 'purple' });
const logo = require('./image/logo.png');
let dernier = 0;

const a = 500;
const b = 1000;
const c = 2000;
const d = 5000;
const Platinum = "Platinum";
const Gold = "Gold";
const Silver = "Silver";
const Elite1 = "Elite";
const Elite3 = "Elite";
const Diamond = "Diamond";

const prizes = [
  { value: Diamond+ " 1", chance: 0.02 },
  { value: Elite1 + " 1", chance: 0.01 },
  { value: Elite3 + " 3", chance: 0.005 },
  { value: d + " Ar", chance: 0.7 },
  { value: Silver+ " 1", chance: 0.6 },
  { value: c + " Ar", chance: 0.8 },
  { value: Gold + " 1", chance: 0.5 },
  { value: Platinum + " 1", chance: 0.1 },
  { value: b + " Ar", chance: 0.9 },
  { value: a + " Ar", chance: 1.0 }
];

const cumulativeChances = prizes
  .sort((a, b) => b.chance - a.chance)
  .reduce((acc, prize, index) => {
    const cumulativeChance = (index === 0) ? prize.chance : acc[index - 1] + prize.chance;
    return [...acc, cumulativeChance];
  }, []);

const getRandomPrize = () => {
  const randomValue = Math.random();
  const index = cumulativeChances.findIndex(chance => randomValue < chance);
  return prizes[index].value;
};

const makeWheel = () => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);
  
  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

    const startColor = color({ luminosity: 'dark' });
    const endColor = color({ luminosity: 'dark' });

    return {
      path: instance(arc),
      gradient: [startColor, endColor],
      value: App.getValueForIndex(index),
      centroid: instance.centroid(arc)
    };
  });
};

export default class App extends React.Component {
  static getValueForIndex(index) {
    return prizes[index].value;
  }

  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
      finished: false,
      winner: null,
      modalVisible: false,
      modalScale: new Animated.Value(0),
      spinning: false,
      jetonshoya: 0,
    };
  }

  _wheelPaths = makeWheel();
  _angle = new Animated.Value(0);
  angle = 0;

  componentDidMount() {
    this.getJetonshoya();
    this._angle.addListener(event => {
      if (this.state.enabled) {
        this.setState({
          enabled: false,
          finished: false
        });
      }

      this.angle = event.value;
    });
  }

  getJetonshoya = async () => {
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      const user = await Axios.post(`${BASE_URL}/users/validate-token`, {token: jwt_token});
      const response = await Axios.get(`${BASE_URL}/jetonshoya`, { iduser: user.data.id });
      const filteredData = response.data.filter(item => item.iduser === user.data.id);
      const jetonshoya = filteredData[0].jetonshoya;
      this.setState({ jetonshoya });
    } catch (error) {
      console.error('Erreur lors de la récupération des jetons :', error);
    }
  };

  deductJetonshoya = async () => {
    const newJetonshoya = this.state.jetonshoya - 1;
    this.setState({ jetonshoya: newJetonshoya });

    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      const user = await Axios.post(`${BASE_URL}/users/validate-token`, {token: jwt_token});
      await Axios.put(`${BASE_URL}/jetonshoya/${user.data.id}`, { jetonshoya: newJetonshoya });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des jetons :', error);
    }
  };

  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % oneTurn));
    if (this.angle < 0) {
      return Math.floor(deg / angleBySegment);
    }
    return (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments;
  };

  _startAnimation = () => {
    if (this.state.spinning || this.state.jetonshoya === 0) return;
  
    // Filtrer les prix avec des chances entre 0.5 et 1.0
    const highChancePrizes = prizes.filter(prize => prize.chance > 0.5 && prize.chance <= 1.0);

    // Générer des vitesses de rotation aléatoires basées sur les chances filtrées
    const randomChances = highChancePrizes.map(() => 0.5 + Math.random() * 0.5); // Génère des nombres aléatoires entre 0.5 et 1.0
    const maxChance = Math.max(...randomChances);
    const velocity = (maxChance / 0.5) * 360 * 5;
  
    // Déclencher l'animation de rotation
    this.setState({ spinning: true });
  
    Animated.decay(this._angle, {
      velocity: velocity / 1000,
      deceleration: 0.999,
      useNativeDriver: true
    }).start(() => {
      this._angle.setValue(this.angle % oneTurn);
      const snapTo = snap(oneTurn / numberOfSegments);
      Animated.timing(this._angle, {
        toValue: snapTo(this.angle),
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        const winnerIndex = this._getWinnerIndex();
        const updatedWheelPaths = this._wheelPaths.map((arc, index) => ({
          ...arc,
          selected: index === winnerIndex
        }));
        this.setState({
          enabled: true,
          finished: true,
          winner: this._wheelPaths[winnerIndex].value,
          spinning: false
        }, () => {
          this._wheelPaths = updatedWheelPaths;
          this.openModal();
        });
      });
    });
  };
  
  _resetSelectedSegments = () => {
    const updatedWheelPaths = this._wheelPaths.map(arc => ({
      ...arc,
      selected: false
    }));
    this._wheelPaths = updatedWheelPaths;
  };

  playSound = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require('./image/wheel.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Impossible de charger le fichier audio', error);
    }
  };
  
  playModalSound = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require('./image/applause.wav'));
      await soundObject.playAsync();
    } catch (error) {
      console.error('Impossible de charger le fichier audio du modal', error);
    }
  };  
  
  _spinRandomly = () => {
    if (this.state.spinning || this.state.jetonshoya === 0) return;
    this._resetSelectedSegments();
    this.deductJetonshoya();

    const randomSpinSpeed = Math.random() * 0.5 + 0.5;
    const velocity = randomSpinSpeed * 360;
  
    this._startAnimation(velocity);
    this.playSound();
  };
  
  openModal = async () => {
    // Afficher la modal
    this.setState({ modalVisible: true }, async () => {
      Animated.spring(this.state.modalScale, {
        toValue: 1,
        tension: 20,
        friction: 4,
        useNativeDriver: true,
      }).start(async () => {
        this.playModalSound();
      });
    });
  
    // Vérifier le type de prix tiré
    const prizeCategory = this.state.winner;
  
    if ([a, b, c, d].includes(parseInt(prizeCategory))) {
      this.setState({ showClaimButton: true });
    } else if ([Platinum, Gold, Silver, Elite1, Elite3, Diamond].includes(prizeCategory.split(" ")[0])) {
      this.setState({ showActivateButton: true });
    }

    const jwt_token = await AsyncStorage.getItem("jwt_token");
    const user = await Axios.post(`${BASE_URL}/users/validate-token`, {token: jwt_token});
    const historique = await Axios.post(`${BASE_URL}/historiquejeton/`, { iduser: user.data, tiree: this.state.winner });
    const soldeuserResponse = await Axios.get(`${BASE_URL}/historiquejeton`);
    const filteredSoldeuser = soldeuserResponse.data.filter(item => item.iduser === user.data.id);
    dernier = historique.data.id;
  };
  

  activateNow = async () => {
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      const user = await Axios.post(`${BASE_URL}/users/validate-token`, {token: jwt_token});

      const response = await Axios.post(`${BASE_URL}/historiquejeton/validation`, { 
        id: dernier, 
      });
      // Fermer le modal après l'activation
      this.closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'activation du tirage :', error);
      alert("Une erreur s'est produite lors de l'activation du tirage. Veuillez réessayer plus tard.");
    }
  };

  claimNow = async () => {
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
      const userId = user.data.id; // Obtenir l'identifiant de l'utilisateur
      const soldeuserResponse = await Axios.post(`${BASE_URL}/soldeuser/byuser`, { iduser: userId });
      const soldeuser = soldeuserResponse.data;
      console.log("----------------");
      console.log(soldeuser);
      console.log("----------------");
      console.log(this.state.winner);  

      const updatedSolde = parseFloat(soldeuser.solde) + parseFloat(this.state.winner);
      const response = await Axios.put(`${BASE_URL}/soldeuser/${soldeuser.id}`, { solde: updatedSolde });
      
      console.log("----------------");
      console.log("tonga ato tsara le solde");
      console.log("----------------");

      this.closeModal();
    } catch (error) {
      console.error('Erreur lors de la réclamation du prix :', error);
      alert("Une erreur s'est produite lors de la réclamation du prix. Veuillez réessayer plus tard.");
    }
};
  
  closeModal = async() => {
    Animated.timing(this.state.modalScale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      this.setState({ modalVisible: false });
    });
  };

  _renderKnob = () => {
    const knobSize = 30;
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(this._angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment)
      ),
      1
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
              })
            }
          ]
        }}
      >
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{ transform: [{ translateY: 8 }] }}
        >
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderSvgWheel = () => {
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
            <Image source={logo} style={styles.logo} />
            <RNText style={styles.tokenText}>Jetons : {this.state.jetonshoya}</RNText>
          </View>
        {this._renderKnob()}
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                })
              }
            ]
          }}
        >
          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
          >
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;

                return (
                  <G key={`arc-${i}`}>
                    <Path 
                      d={arc.path} 
                      fill={`url(#gradient-${i})`}
                      stroke={arc.selected ? 'gold' : 'transparent'}
                      strokeWidth={arc.selected ? 3 : 0}
                    />
                    <Defs>
                      <LinearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={arc.gradient[0]} />
                        <Stop offset="100%" stopColor={arc.gradient[1]} />
                      </LinearGradient>
                    </Defs>
                    <G
                      rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                      origin={`${x}, ${y}`}
                    >
                      <Text
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                        fontSize={fontSize}
                        fontFamily={fontFamily}
                      >
                        {Array.from({ length: arc.value.length }).map((_, j) => {
                          return (
                            <TSpan
                              x={x}
                              dy={fontSize}
                              key={`arc-${i}-slice-${j}`}
                            >
                              {arc.value.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
          <TouchableOpacity onPress={this._spinRandomly} style={[styles.buttonContainer]} disabled={this.state.spinning || this.state.jetonshoya === 0}>
            <AntDesign name="right" size={24} color="yellow" />
          </TouchableOpacity>
          
        </Animated.View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        
        {this._renderSvgWheel()}
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={this.closeModal}
          >
            <Animated.View style={[styles.modalContainer, { transform: [{ scale: this.state.modalScale }] }]}>
              <View style={styles.modalContent}>
                <Image source={require('./image/logo.png')} style={styles.logo1} />
                <RNText style={styles.modalText}>Félicitations 🎉🎉!</RNText>
                <RNText style={styles.modalText}>Vous avez gagné : {this.state.winner} de Crédit</RNText>
                <View style={styles.buttonGroup}>
                  {/* Affichage conditionnel des boutons */}
                  {this.state.showActivateButton && (
                    <TouchableOpacity onPress={this.activateNow} style={[styles.closeButton, styles.actionButton]}>
                      <RNText style={styles.closeButtonText}>Activer maintenant</RNText>
                    </TouchableOpacity>
                  )}
                  {this.state.showClaimButton && (
                    <TouchableOpacity onPress={this.claimNow} style={[styles.closeButton, styles.actionButton]}>
                      <RNText style={styles.closeButtonText}>Réclamer maintenant</RNText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={this.closeModal} style={[styles.closeButton, styles.actionButton]}>
                    <RNText style={styles.closeButtonText}>Plus tard</RNText>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '50%',
    left: '50%',
    marginLeft: -48,
    marginBottom: -37,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#4C0099',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontFamily: "PoppinsSemi",
    fontSize: 20,
    marginBottom: 10,
    color: "white"
  },
  closeButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "PoppinsSemi",
  },
  logo1: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: "40%",
    // backgroundColor : 'white',
    borderRadius : 15
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  tokenText: {
    fontFamily: "PoppinsSemi",
    fontSize: 18,
    color: 'white'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});