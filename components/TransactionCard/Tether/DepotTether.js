import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Image,
  ToastAndroid,
} from "react-native";
import * as Font from "expo-font";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Axios from 'axios';
import { BASE_URL } from '../../../config';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const DepotTether = () => {
  
const [cours, setCours] = useState();

useEffect(() => {
  const fetchCours = async () => {
    try {
      const response = await Axios.get(`${BASE_URL}/cours`);
      const liste = response.data;
      for(let i=0; i<liste.length; i++){
        if(response.data[0].actif == 'usdt'){
          setCours(response.data[0].depot);
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  fetchCours();
}, []);
  const [address, setAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [libelle, setLibelle] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [montant, setMontant] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContactVisible, setModalContactVisible] = useState(false);
  const [modalReseauVisible, setModalReseauVisible] = useState(false);

  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueReseau, setSelectedValueReseau] = useState("");

  const [valeurEnAriary, setValeurEnAriary] = useState("");

  const [adresseUSDT, setAdresseUSDT] = useState([]);

  const [networkList, setNetworkList] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");

  const [maxUsdt, setMaxUsdt] = useState(0);
     
  useEffect(() => {
    const fetchmaxUsdt = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/soldeshoya`);
        console.log(response.data[0].usdt);
        setMaxUsdt(response.data[0].usdt);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchmaxUsdt();
  }, []);

  // useEffect(() => {
  //   const fetchNetworkList = async () => {
  //     try {
  //       const response = await Axios.get(`${BASE_URL}/binance/network-list`, {coin: 'USDT'});
  //       console.log(response.data[0].network);
  //       setNetworkList(response.data);
  //     } catch (error) {
  //       console.log(error.response.data);
  //     }
  //   };
  //   fetchNetworkList();
  // }, []);

  useEffect(() => {
    const fetchNetworkList = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/adressenetwork`);
        console.log("LISTE=");
        console.log(response.data);
        console.log("END OF THE LIST");
        setNetworkList(response.data); // Mettre à jour la liste des réseaux avec les données de la réponse
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchNetworkList();
  }, []);

  useEffect(() => {
    const getAdresseUSDT = async () => {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      if (jwt_token) {
        try {
          const user = await Axios.post(`${BASE_URL}/users/validate-token`, {
            token: jwt_token,
          });
          const userId = user.data.id;
          const apiUrl = `${BASE_URL}/adresseusdt`;
          const config = {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
          };
          const response = await Axios.get(apiUrl, config);
          const adresses = response.data;
          if (Array.isArray(adresses) && adresses.length > 0) {
            // Filtrer les adresses en fonction de l'iduser
            const filteredAdresses = adresses.filter(adresse => adresse.iduser === userId);
            setAdresseUSDT(filteredAdresses);
          } else {
            // console.error("Réponse de l'API vide ou non conforme :", response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la requête :", error);
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error("JWT introuvable dans l'Async Storage");
      }
    };

    getAdresseUSDT();
  }, []);

  const insertAdresseUSDT = async (newAdresseUSDT, newLibelleUSDT, newReseauUSDT) => {
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
  
      if (jwt_token) {
        const userResponse = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
        const userId = userResponse.data.id;
  
        const apiUrl = `${BASE_URL}/adresseusdt`;
  
        const response = await Axios.post(apiUrl, { iduser: userId, adresse: newAdresseUSDT, libelle: newLibelleUSDT, reseau: newReseauUSDT });
  
        if (response.data.id) {
          navigation.navigate("Reussi");
        } else {
          ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error('JWT introuvable dans l\'Async Storage');
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
    }
  };  
  console.log(adresseUSDT);
  const elements = adresseUSDT.map((item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleSelectAddress(item.adresse, item.reseau)}
    >
      <View style={styles.optionCard1}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.optionButton1}>{item.reseau}</Text>
          <Text style={styles.optionButton1}> - </Text>
          <Text style={styles.optionButton1}>{item.libelle}</Text>
        </View>
        <Text style={styles.optionButton2}>{item.adresse}</Text>
      </View>
    </TouchableOpacity>
  ));

  const navigation = useNavigation();

  const handleMinPress = () => {
    setMontant("10");
    setValeurEnAriary((10*cours)+"");
  };

  const handleSelect = async (value) => {
    setSelectedValue(value);
    setModalVisible(false);
    
    const adresse = await Axios.post(`${BASE_URL}/binance/network-adress`, { network : value });
    setWalletAddress(adresse.data.address);
    
    // Mise à jour de l'adresse du portefeuille en fonction du réseau sélectionné
    // if (value === "BNB Smart Chain (BEP20)") {
    //   setWalletAddress("9ca8ac571c2f818d6850c0054ca16a7a");
    // } else if (value === "Ethereum (ERC20)") {
    //   setWalletAddress("caca574a7eb8bc77003174c5d87");
    // } else if (value === "Polygon") {
    //   setWalletAddress("535da9c78e0c59d4bdc3bcfb809c240a36");
    // } else if (value === "Solana") {
    //   setWalletAddress("19873159bf588f054e5");
    // } else if (value === "Tron (TRC20)") {
    //   setWalletAddress("TMHS6obBX2uWSkcxiVek1KVUZbypsUwttc");
    // }
  };
  const handleSelectAddress = (value, selectedNetwork) => {
    setAddress(value);
    setSelectedValue(selectedNetwork);
    setSelectedNetwork(selectedNetwork);
    setSelectedValueReseau(selectedNetwork);
    setModalContactVisible(false);
  };
  
  const handleSelectNewReseau = (value) => {
    setSelectedValueReseau(value);
    setModalReseauVisible(false);
  };
  

  const handleAddressChange = (text) => {
    setAddress(text);
  };
  const handleLibelleChange = (text) => {
    setLibelle(text);
  };
  const handleNewAddressChange = (text) => {
    setNewAddress(text);
  };

  const handleMontantChange = (text) => {
    if (text === "" || (parseInt(text) >= 1 && parseInt(text) <= 1000)) {
      setMontant(text);
      const valeur = text !== "" ? parseInt(text) * cours : "";
      setValeurEnAriary(valeur);
    }
  };

  const handleEnregistrer = () => {
    if (
      newAddress === "" ||
      libelle === "" ||
      selectedValueReseau === "" ||
      (selectedValueReseau !== selectedValueReseau)
    ) {
      ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
    } else {
      //Créez un nouvel objet adresse avec les informations saisies
      const nouvelleAdresse = {
        adresse: newAddress,
        libelle: libelle,
        reseau: selectedValueReseau,
      };
  
      // Ajoutez le nouvel objet adresse à la liste adresseUSDT
      setAdresseUSDT([...adresseUSDT, nouvelleAdresse]);
      insertAdresseUSDT(newAddress, libelle, selectedValueReseau);
  
      // Masquez la modal et réinitialisez les champs
      setModalCreateVisible(false);
      setNewAddress("");
      setSelectedValueReseau("");
      setLibelle("");
  
      ToastAndroid.show("Adresse ajoutée avec succès", ToastAndroid.SHORT);
    }
  };
    

  const handleSubmit = () => {
    if (
      address === "" ||
      montant === "" ||
      montant < 10 ||
      selectedValue === "" ||
      (selectedValue !== selectedValue &&
        selectedValue !== selectedValue &&
        selectedValue !== selectedValue &&
        selectedValue !== selectedValue &&
        selectedValue !== selectedValue)
    ) {
      ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
    } else {
      navigation.navigate("ConfirmDepot", {
        montant,
        address,
        selectedValue,
        valeurEnAriary,
      });
    }
  };

  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        PopppinsSemi: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
        OnestRegular: require("../../../assets/fonts/OnestRegular1602-hint.ttf"),
        OnestBold: require("../../../assets/fonts/OnestBold1602-hint.ttf"),
        OnestMedium: require("../../../assets/fonts/OnestMedium1602-hint.ttf"),
        MontserratBold: require("../../../assets/fonts/Montserrat-Bold.ttf"),
        MontserratSemi: require("../../../assets/fonts/Montserrat-SemiBold.ttf"),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  if (!fontLoaded) {
    return null; // Afficher un écran de chargement ou une autre indication pendant le chargement de la police
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <TextInput
            style={styles.input4}
            placeholder="Adresse du portefeuille"
            placeholderTextColor="#999"
            value={address}
            onChangeText={handleAddressChange}
          />
        </View>
        <View style={styles.vw}>
          <TouchableOpacity onPress={() => setModalContactVisible(true)}>
            <Icon
              style={{ paddingBottom: 15 }}
              name="address-book"
              size={18}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 10 }}>
            <Icon
              style={{ paddingBottom: 15 }}
              name="qrcode"
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.selectButton}
        >
          {/* <Text style={styles.selectButtonText}>
            {selectedValue !== "" ? selectedValue : "Choisir le réseau"}
          </Text> */}
          <Text style={styles.selectButtonText}>
            {selectedValue !== "" ? selectedValue : "Choisir le réseau"}
          </Text>

          <Image
            source={require("../../../assets/select.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={["#16DAAC", "#B6EA5C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.card}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.cardHeader}>Choisir le réseau</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon
                    style={{ paddingBottom: 15 }}
                    name="close"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView>
              {networkList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(item.network)}
                  style={[
                    styles.optionCard,
                    selectedValue === item.network && styles.selectedOption,
                  ]}
                >
                  <Text style={styles.optionButton}>{item.network}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalContactVisible}
          onRequestClose={() => setModalContactVisible(false)}
        >
          <View style={styles.modalContainer1}>
            <View style={styles.card1}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.cardHeader1}>Sélectionnez l'adresse</Text>
                <TouchableOpacity onPress={() => setModalContactVisible(false)}>
                  <Icon
                    style={{ paddingBottom: 15 }}
                    name="close"
                    size={20}
                    color="#B6EA5C"
                  />
                </TouchableOpacity>
              </View>
              <ScrollView>
              {elements}
              </ScrollView>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: 35,
                    backgroundColor: "lightgray",
                    borderRadius: 8,
                    marginBottom: 10,
                    alignSelf: "center",
                  }}
                  onPress={() => setModalCreateVisible(true)}
                >
                  <Text style={styles.optionButton4}>Nouvelle Adresse</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalCreateVisible}
          onRequestClose={() => setModalCreateVisible(false)}
        >
          <View style={styles.modalContainer1}>
            <View style={styles.card1}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.cardHeader1}>
                  Ajouter une nouvelle adresse
                </Text>
                <TouchableOpacity onPress={() => setModalCreateVisible(false)}>
                  <Icon
                    style={{ paddingBottom: 15 }}
                    name="close"
                    size={20}
                    color="#B6EA5C"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: "5%" }}>
                <View style={styles.inputContainer4}>
                  <Text style={styles.textTsotra}>Adresse</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Entrez l'adresse"
                    placeholderTextColor="#999"
                    value={newAddress}
                    onChangeText={handleNewAddressChange}
                  />
                  <View style={styles.inputContainer4}>
                    <Text style={styles.textTsotra}>
                      Sélectionnez le réseau
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalReseauVisible(true)}
                      style={styles.selectButton}
                    >
                      <Text style={styles.selectButtonText}>
                        {selectedValueReseau !== ""
                          ? selectedValueReseau
                          : "Choisir le réseau"}
                      </Text>
                      <Image
                        source={require("../../../assets/select.png")}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalReseauVisible}
                      onRequestClose={() => setModalReseauVisible(false)}
                    >
                      <View style={styles.modalContainer}>
                        <LinearGradient
                          colors={["#16DAAC", "#B6EA5C"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.card}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text style={styles.cardHeader}>
                              Choisir le réseau
                            </Text>
                            <TouchableOpacity
                              onPress={() => setModalReseauVisible(false)}
                            >
                              <Icon
                                style={{ paddingBottom: 15 }}
                                name="close"
                                size={20}
                                color="white"
                              />
                            </TouchableOpacity>
                          </View>
                          <ScrollView>
                            {networkList.map((item, index) => (
                              <TouchableOpacity
                              key={index}
                              onPress={() => handleSelectNewReseau(item.network)} // Utilisez handleSelectNewReseau ici
                              style={[
                                styles.optionCard,
                                selectedValueReseau === item.network && styles.selectedOption, // Assurez-vous de comparer avec selectedValueReseau
                              ]}
                            >
                              <Text style={styles.optionButton}>{item.network}</Text>
                            </TouchableOpacity>
                            
                            ))}
                          </ScrollView>
                        </LinearGradient>
                      </View>
                    </Modal>
                    <Text style={styles.textTsotra}>
                      Libellé du portefeuille (facultatif)
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Libellé du portefeuille"
                      placeholderTextColor="#999"
                      value={libelle}
                      onChangeText={handleLibelleChange}
                    />
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    backgroundColor: "lightgray",
                    borderRadius: 8,
                    marginBottom: 10,
                    alignSelf: "center",
                  }}
                  onPress={handleEnregistrer}
                >
                  <Text style={styles.optionButton4}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Montant"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={montant}
          onChangeText={handleMontantChange}
        />
        <View style={styles.vw}>
          <Text style={styles.staticText}>USDT</Text>
          <TouchableOpacity onPress={handleMinPress}>
            <Text style={styles.staticText1}>Min</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>
          Valeur en Ariary:{" "}
          {valeurEnAriary !== ""
            ? `${parseInt(valeurEnAriary).toLocaleString()} Ariary`
            : ".... Ariary"}
        </Text>
        <View style={styles.minMaxContainer}>
          <View>
            <Text style={styles.minMaxLabelText}>Minimum</Text>
            <Text style={styles.minMaxLabelText}>Maximum</Text>
          </View>
          <View>
            <Text style={styles.minMaxValueText}>10 USDT</Text>
            <Text style={styles.minMaxValueText}>{maxUsdt} USDT</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: "white",
  },
  textTsotra: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 11,
    paddingBottom: 5,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 10,
  },
  inputContainer4: {
    position: "relative",
    marginBottom: 10,
    marginTop: 10,
  },
  staticText: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 12,
  },
  staticText1: {
    color: "#B6EA5C",
    fontFamily: "OnestBold",
    fontSize: 12,
    marginLeft: 5,
  },
  vw: {
    flexDirection: "row",
    position: "absolute",
    top: 12,
    right: 12,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "white",
    borderWidth: 0.5,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: "OnestBold",
    color: "white",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
  },
  input4: {
    width: "80%",
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: "OnestBold",
    color: "white",
  },
  inputAddress: {
    width: "100%",
    height: 40,
    borderColor: "white",
    borderWidth: 0.5,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: "OnestBold",
    color: "white",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
    fontSize: 8,
  },
  text: {
    color: "white",
    fontFamily: "OnestRegular",
    fontSize: 11,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#FFEE00",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    width: "50%", // Réduire la largeur du bouton ici
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontFamily: "OnestBold",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 0.5,
    height: 40,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 8,
    borderColor: "white",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
  },
  selectButtonText: {
    flex: 1,
    color: "#ccc",
    fontFamily: "OnestBold",
    fontSize: 14,
  },
  icon: {
    width: 12,
    height: 12,
    marginLeft: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: "#16DAAC",
    fontFamily: "OnestBold",
    fontSize: 14,
    color: "white",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 0.5,
  },
  optionButton: {
    padding: 10,
    backgroundColor: "#16DAAC",
    fontFamily: "OnestBold",
    fontSize: 14,
    color: "white",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 0.5,
  },
  optionButton4: {
    padding: 10,
    backgroundColor: "#16DAAC",
    fontFamily: "OnestBold",
    fontSize: 14,
    color: "white",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 0.2,
    textAlign: "center",
  },
  optionButton1: {
    padding: 5,
    fontFamily: "OnestBold",
    fontSize: 14,
    color: "white",
  },
  optionButton2: {
    padding: 5,
    fontFamily: "OnestRegular",
    fontSize: 11,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer1: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    borderRadius: 0,
    padding: 20,
    width: "100%",
    flex: 1,
    maxHeight: 300,
  },
  card1: {
    borderRadius: 0,
    padding: 20,
    width: "100%",
    flex: 1,
    maxHeight: "80%",
    backgroundColor: "#181526",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardHeader: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "white",
  },
  cardHeader1: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "#B6EA5C",
  },
  optionCard: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    marginBottom: 10,
  },
  optionCard1: {
    marginBottom: "5%",
    backgroundColor: "#2F2C3B",
    marginTop: "5%",
    padding: "2%",
    borderRadius: 10,
    borderColor: "#2F2C3B",
    borderWidth: 0.2,
  },
  minMaxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
    height: 40,
    marginTop: 10,
    borderColor: "gray",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
  },
  minMaxLabelText: {
    textAlign: "left",
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 10,
  },
  minMaxValueText: {
    textAlign: "right",
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 10,
  },
});

export default DepotTether;