import React, { useEffect, useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import Axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '../../../config';
import global from "../../../assets/css/global";
import bgImage from "../../../assets/images/bgImage.jpg";
import BackNavs from "../../Navs/BackNavs";

const Numero = () => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumbersList, setPhoneNumbersList] = useState([]);

  const verificationStatus = "non-verifie"; // 'verifie', 'non-verifie', 'en-cours'

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "OnestBold1602-hint": require("../../../assets/fonts/OnestBold1602-hint.ttf"),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const jwt_token = await AsyncStorage.getItem("jwt_token");
        if (jwt_token) {
          const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
          const response = await Axios.get(`${BASE_URL}/phone`, {
            headers: {
              Authorization: `Bearer ${jwt_token}`
            }
          });
          const userPhoneNumbers = response.data.filter(phone => phone.iduser === user.data.id);
          setPhoneNumbersList(userPhoneNumbers);
        }
        else{
          navigation.navigate("ConnectWallet");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des numéros de téléphone :', error);
      }
    };
    fetchPhoneNumbers();
  }, []);

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
  };

  const handleAddPhoneNumber = () => {
    setShowForm(true);
  };

  const Sendnumero = async (phoneNumber) => {
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      if (jwt_token) {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
        const apiUrl = `${BASE_URL}/phone`;
        const response = await Axios.post(apiUrl, { iduser: user.data.id, numero: phoneNumber, statut: 'non verifie' }, {
          headers: {
            Authorization: `Bearer ${jwt_token}`
          }
        });
        if (response.data.success === 1) {
          setPhoneNumber("");
          navigation.navigate("Reussi");
        } else if (response.data.success === 0) {
          console.error("Erreur survenue");
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error("JWT introuvable dans l'Async Storage");
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  };

  const handleSavePhoneNumber = () => {
    if (phoneNumber) {
      const newPhoneNumber = { number: phoneNumber, verificationStatus };
      setPhoneNumbersList([...phoneNumbersList, newPhoneNumber]);
      setPhoneNumber("");
      Sendnumero(phoneNumber);
      setShowForm(false);
    }
  };

  const getVerificationStyles = (status) => {
    let textStyles = styles.verifie;
    let icon = "check";
    let textColor = "#06664E"; // Couleur du texte pour l'état "vérifié"
    let backgroundColor = "#04F8BB"; // Couleur de fond pour l'état "vérifié"

    if (status === "non-verifie") {
      textStyles = styles.nonVerifie;
      icon = "times";
      textColor = "#FF2D2D"; // Couleur du texte pour l'état "non vérifié"
      backgroundColor = "#FFA8A8"; // Couleur de fond pour l'état "non vérifié"
    } else if (status === "en-cours") {
      textStyles = styles.enCours;
      icon = "ellipsis-h";
      textColor = "#181526"; // Couleur du texte pour l'état "en cours"
      backgroundColor = "#EAE55C"; // Couleur de fond pour l'état "en cours"
    }

    return { textStyles, icon, textColor, backgroundColor };
  };

  if (!fontLoaded) {
    return null;
  }

  return (
    <ImageBackground source={bgImage} style={styles.pageContainer}>
      <View style={styles.navContainer}>
        <BackNavs />
      </View>
      <View style={styles.logoContainer}>
        <Text style={global.grandTextJaune}>Téléphone</Text>
      </View>
      <View style={styles.phoneNumbersContainer}>
        {phoneNumbersList.map((phone, index) => (
          <View key={index} style={styles.phoneNumberItem}>
            <Text style={[styles.phoneNumberText]}>{phone.numero}</Text>
            <View
              style={[
                styles.verificationStatus,
                {
                  backgroundColor:
                    getVerificationStyles(phone.statut).backgroundColor,
                },
              ]}
            >
              <Icon
                name={getVerificationStyles(phone.statut).icon}
                size={16}
                color={getVerificationStyles(phone.statut).textColor}
              />
            </View>
          </View>
        ))}
      </View>
      {showForm ? (
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputExample}
              placeholder="+261"
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="32/34"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={9}
            />
          </View>
          <Pressable style={styles.saveButton} onPress={handleSavePhoneNumber}>
            <LinearGradient
              colors={["#16daac", "#b6ea5c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Pressable style={styles.Buttoncreate} onPress={handleAddPhoneNumber}>
            <LinearGradient
              colors={["#16daac", "#b6ea5c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientplus}
            >
              <Icon name="plus-circle" size={28} color="black" />
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </ImageBackground>
  );
};

export default Numero;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  navContainer: {
    alignSelf: "flex-start",
  },
  Buttoncreate: {
    width: 300,
    height: 50,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 30,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginLeft: "8%",
    borderRadius: 30,
  },
  gradientplus: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  formContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: 400,
    height: 58,
  },
  input: {
    width: "75%",
    height: 45,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    textDecorationStyle: "dashed",
    alignItems: "center",
    fontFamily: "OnestBold1602-hint",
  },
  inputExample: {
    width: 65,
    height: 45,
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 10,
    textDecorationStyle: "dashed",
    alignItems: "center",
    fontFamily: "OnestBold1602-hint",
    marginLeft: "3%",
  },
  saveButton: {
    height: 45,
    borderRadius: 30,
    width: "95%",
  },
  buttonContainer: {},
  saveButtonText: {
    fontSize: 16,
    fontFamily: "OnestBold1602-hint",
    textAlign: "center",
    lineHeight: 48,
    color: "white",
  },
  phoneNumbersContainer: {
    marginTop: "2%",
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
    width: "80%",
  },
  phoneNumberItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phoneNumberText: {
    fontSize: 16,
    fontFamily: "OnestBold1602-hint",
  },
  verificationStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  verifie: {
    color: "#06664E",
  },
  nonVerifie: {
    color: "#FF2D2D",
  },
  enCours: {
    color: "#181526",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "16%",
    marginBottom: "5%",
  },
});