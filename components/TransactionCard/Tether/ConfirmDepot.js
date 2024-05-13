import React from "react";
import {
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  ToastAndroid,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../config";
import { useState } from "react";
import { useEffect } from "react";

const ConfirmDepot = ({ route }) => {
  const { montant, address, selectedValue } = route.params;
  const navigation = useNavigation();
  const [frais, setFrais] = useState();
  const [cours, setCours] = useState();
  const [diminutif, setDiminutif] = useState();
  const [validity, setValidity] = useState(true);
  const [message, setMessage] = useState("");

  const smt = selectedValue;

  useEffect(() => {
    const fetchDiminutif = async () => {
      try {
        const response = await Axios.post(
          `${BASE_URL}/adressenetwork/bynetwork`,
          { network: smt }
        );
        console.log(smt);
        console.log(response.data);
        setDiminutif(response.data.diminutif);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchDiminutif();
  });

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/cours`);
        const liste = response.data;
        for (let i = 0; i < liste.length; i++) {
          if (response.data[i].actif == "usdt") {
            setCours(response.data[i].depot);
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchCours();
  }, []);

  useEffect(() => {
    const fetchNetworkList = async () => {
      try {
        // TRX FONA NY ETO MANDRITRA NY PHASE DE TEST
        const response = await Axios.post(`${BASE_URL}/binance/network-list`, {
          coin: "TRX",
        });
        const liste = response.data[0].networkList;
        for (let i = 0; i < liste.length; i++) {
          if (response.data[0].networkList[i].network == diminutif) {
            setFrais(response.data[0].networkList[i].withdrawFee);
            if (response.data[0].networkList[i].withdrawDesc != "") {
              setValidity(false);
            }
            else{
              setMessage(response.data[0].networkList[i].withdrawDesc+'');
            }
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchNetworkList();
  }, []);

  const finalmontant = montant * cours + frais * cours;

  const handleSubmit = async (newMontant, newAddress) => {
    try {
      if (validity) {
        const jwt_token = await AsyncStorage.getItem("jwt_token");
        if (jwt_token) {
          const user = await Axios.post(`${BASE_URL}/users/validate-token`, {
            token: jwt_token,
          });
          const apiUrl = `${BASE_URL}/binance/fairedepot`;
          console.log("===================");
          console.log("adresse = " + selectedValue);
          console.log("===================");
          const response = await Axios.post(apiUrl, {
            iduser: user.data.id,
            montant: montant,
            network: "TRX",
            adress: address,
            frais: frais,
          });
          if (response.data.messageresult == "Transaction effectuee") {
            navigation.navigate("Reussi");
          } else {
            ToastAndroid.show(response.data.messageresult, ToastAndroid.SHORT);
          }
        } else {
          navigation.navigate("ConnectWallet");
          console.error("JWT introuvable dans l'Async Storage");
        }
      }
      else{
        ToastAndroid.show(message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Erreur lors de la requête Axios :", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.retourButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <FontAwesome name="times" size={18} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.texte}>Confirmer l'ordre</Text>
        <Text style={styles.texte1}>Vous recevrez: </Text>
        <View style={styles.amountContainer}>
          <Text style={styles.montant}>{montant} USDT</Text>
        </View>
        <View style={styles.minMaxContainer}>
          <View>
            <Text style={styles.minMaxLabelText}>Adresse</Text>
            <Text style={styles.minMaxLabelText}>Réseau</Text>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxLabelText}>Actif</Text>
              <Text style={styles.minMaxLabelText}>Montant</Text>
              <Text style={styles.minMaxLabelText}>Frais de réseau</Text>
              <Text style={styles.minMaxLabelText}>
                Montant Total en Ariary
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.minMaxValueText}>{address}</Text>
              <Text style={styles.minMaxValueText}>{diminutif}</Text>
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxValueText}>USDT</Text>
              <Text style={styles.minMaxValueText}>{montant} USDT</Text>
              <Text style={styles.minMaxValueText}>{frais} USDT</Text>
              <Text style={styles.minMaxValueText}>
                {finalmontant.toLocaleString()} Ariary
                {/* {(montant * 4600 + 4502).toLocaleString()} Ariary */}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.warningContainer}>
          <FontAwesome
            name="warning"
            size={14}
            color="yellow"
            style={{ marginLeft: 8 }}
          />
          <Text style={styles.warningLabelText}>
            Vérifier que l'adresse est correcte et sur le même réseau. Les
            transactions ne peuvent pas être annulées
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSubmit(montant, address)}
        >
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "30%",
    flex: 1,
    alignItems: "center",
  },
  texte: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "white",
  },
  texte1: {
    fontSize: 14,
    fontFamily: "OnestRegular",
    color: "white",
  },
  montant: {
    fontSize: 40,
    fontFamily: "OnestBold",
    color: "white",
    padding: 10,
  },
  retourButton: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
  },
  amountContainer: {
    flexDirection: "row", // Place les éléments horizontalement
    alignItems: "center", // Aligne les éléments verticalement au centre
  },
  minMaxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "80%",
    height: 180,
    marginTop: 10,
    borderColor: "gray",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
  },
  warningContainer: {
    marginTop: 15,
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 238, 00, 0.4)",
  },
  minMaxLabelText: {
    textAlign: "left",
    fontFamily: "OnestRegular",
    color: "#ccc",
    fontSize: 10,
    padding: 5,
  },
  warningLabelText: {
    fontFamily: "OnestBold",
    color: "#FFEE00",
    fontSize: 10,
    padding: 5,
    marginLeft: 8,
    marginRight: 8,
  },
  minMaxValueText: {
    textAlign: "right",
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 10,
    padding: 5,
  },
  separator: {
    height: 3,
    backgroundColor: "white",
    marginBottom: null,
    marginTop: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#FFEE00",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "80%", // Réduire la largeur du bouton ici
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontFamily: "OnestBold",
  },
});

export default ConfirmDepot;
