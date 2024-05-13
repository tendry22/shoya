import WebView from "react-native-webview";
import {
  Button,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { BASE_URL } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RetraitPM = () => {
  const navigation = useNavigation();
  const [montant, setMontant] = useState("");
  const [valeurEnAriary, setValeurEnAriary] = useState("");

  const [maxMga, setMaxMga] = useState(0);
  const [cours, setCours] = useState();

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/cours`);
        const liste = response.data;
        for (let i = 0; i < liste.length; i++) {
          if (response.data[i].actif == "pm") {
            setCours(response.data[i].retrait);
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchCours();
  }, []);

  useEffect(() => {
    const fetchmaxMga = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/soldeshoya`);
        console.log(response.data[0].mga);
        const mga = response.data[0].mga;
        setMaxMga(mga);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchmaxMga();
  }, []);

  const handleMontantChange = (text) => {
    if (text === "" || (parseInt(text) >= 1 && parseInt(text) <= 1000)) {
      setMontant(text);
      const valeur = text !== "" ? parseInt(text) * cours : "";
      setValeurEnAriary(valeur);
    }
  };

  const handleMinPress = () => {
    setMontant("10");
    setValeurEnAriary(10 * cours);
  };

  const handleSubmitOriginal = async () => {
    const jwt_token = await AsyncStorage.getItem("jwt_token");

    if (jwt_token) {
      try {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, {
          token: jwt_token,
        });
        const iduser = user.data.id;
        if (montant === "" || montant < 1 || (maxMga / cours).toFixed(2) < 1) {
          ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
        }        
        if (montant > maxMga / cours) {
          ToastAndroid.show(
            "Vous depassez la valeur Maximum",
            ToastAndroid.SHORT
          );
        } else {
          navigation.navigate("ConfirmRetraitPM", {
            montant,
            iduser,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
      }
    } else {
      navigation.navigate("ConnectWallet");
      console.error("JWT introuvable dans l'Async Storage");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Montant"
          keyboardType="numeric"
          placeholderTextColor="#999"
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
        <View style={styles.inputContainer}>
          <View style={styles.minMaxContainer}>
            <View>
              <Text style={styles.minMaxLabelText}>Minimum</Text>
              <Text style={styles.minMaxLabelText}>Maximum</Text>
            </View>
            <View>
              {(maxMga / cours).toFixed(2) < 10 ? (
                <Text style={styles.minMaxValueText}>Solde insuffisant</Text>
              ) : (
                <>
                  <Text style={styles.minMaxValueText}>10 USD</Text>
                  <Text style={styles.minMaxValueText}>
                    {(maxMga / cours).toFixed(2)} USDT
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmitOriginal}>
          <Text style={styles.buttonText}>PM Envoyé</Text>
        </TouchableOpacity>
        <Text style={styles.minMaxValueText}></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 10,
  },
  staticText: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 14,
  },
  staticText1: {
    color: "#B6EA5C",
    fontFamily: "OnestBold",
    fontSize: 14,
    marginLeft: 5,
  },
  vw: {
    flexDirection: "row",
    position: "absolute",
    top: 12,
    right: 12,
  },
  staticTextAddress: {
    color: "white",
    fontFamily: "OnestRegular",
    fontSize: 10,
    padding: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "white",
    borderWidth: 0.5,
    marginBottom: 16,
    paddingHorizontal: 8,
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
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 16,
    marginTop: 15,
    borderBottomColor: "gray",
    paddingHorizontal: 8,
    borderColor: "#ccc",
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
    margin: 20,
    marginBottom: 0,
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

export default RetraitPM;