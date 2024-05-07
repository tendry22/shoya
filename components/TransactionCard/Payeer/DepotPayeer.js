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

const DepotPayeer = () => {
  const [address, setAddress] = useState("");
  const [montant, setMontant] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [libelle, setLibelle] = useState("");
  const [valeurEnAriary, setValeurEnAriary] = useState("");
  const [modalContactVisible, setModalContactVisible] = useState(false);
  const [modalCreateVisible, setModalCreateVisible] = useState(false);

  const [cours, setCours] = useState();

  const adresseShoya = process.env.EXPO_PUBLIC_SHOYA_ADRESS_PAYEER;

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/cours`);
        const liste = response.data;
        for(let i=0; i<liste.length; i++){
          if(response.data[i].actif == 'payeer'){
            setCours(response.data[i].depot);
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchCours();
  }, []);

  const handleSelectAddress = (value) => {
    setAddress(value);
    setModalContactVisible(false);
  };

  const handleMinPress = () => {
    setMontant("10");
    setValeurEnAriary(10 * cours + '');
  };

  const handleLibelleChange = (text) => {
    setLibelle(text);
  };
  const handleNewAddressChange = (text) => {
    setNewAddress(text);
  };

  const navigation = useNavigation();

  const handleAddressChange = (text) => {
    setAddress(text);
  };

  const handleMontantChange = (text) => {
    if (text === "" || (parseInt(text) >= 1 && parseInt(text) <= 1000)) {
      setMontant(text);
      const valeur = text !== "" ? parseInt(text) * 4600 : "";
      setValeurEnAriary(valeur);
    }
  };

  const handleSubmit = () => {
    if (address === "" || montant === "" || montant < 10) {
      ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
    } else {
      navigation.navigate("ConfirmDepotPayeer", {
        montant,
        address,
      });
    }
  };

  const handleEnregistrer = () => {
    if (newAddress === "" || libelle === "") {
      ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Opération Réussie", ToastAndroid.SHORT);
      setModalCreateVisible(false);
      setNewAddress("");
      setLibelle("");
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
        </View>
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
          <Text style={styles.staticText}>USD</Text>
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
            <Text style={styles.minMaxValueText}>10 USD</Text>
            <Text style={styles.minMaxValueText}>1000 USD</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Envoyer</Text>

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
              <TouchableOpacity
                onPress={() =>
                  handleSelectAddress("191518570rTZYEUAG191518570")
                }
              >
                <View style={styles.optionCard1}>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.optionButton1}>UNEX</Text>
                  </View>
                  <Text style={styles.optionButton2}>
                    191518570rTZYEUAG191518570
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    width: "90%",
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
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textTsotra: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 11,
    paddingBottom: 5,
  },
  inputContainer4: {
    position: "relative",
    marginBottom: 10,
    marginTop: 10,
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
  staticText1: {
    color: "#B6EA5C",
    fontFamily: "OnestBold",
    fontSize: 14,
    marginLeft: 5,
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
  cardHeader1: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "#B6EA5C",
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
  modalContainer1: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  vw: {
    flexDirection: "row",
    position: "absolute",
    top: 12,
    right: 12,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 10,
  },
  input4: {
    width: "90%",
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: "OnestBold",
    color: "white",
  },
  staticText: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 14,
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
    marginBottom: 16,
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
  modalContainer: {
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
  cardHeader: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "white",
  },
  optionCard: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    marginBottom: 10,
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

export default DepotPayeer;
