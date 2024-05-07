import React, { useState } from "react";
import {
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import Axios from "axios";
import { BASE_URL } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConfirmRetrait = () => {
  const navigation = useNavigation();
  const [hash, setHash] = useState("");

  const handleHashChange = (text) => {
    setHash(text);
  };

  const retraitUSDT = async (getTXID) => {
    const txid = getTXID;
    console.log(txid);
    const jwt_token = await AsyncStorage.getItem("jwt_token");

    if (jwt_token) {
      const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
      const iduser = user.data.id;
      console.log('iduser='+iduser);
      try {
        const apiUrl = `${BASE_URL}/binance/faireretrait`;

        const response = await Axios.post(apiUrl, { txid: txid, iduser: iduser });

        console.log(response.data.messageresult);

        if (response.data.messageresult == 'Success de la transaction') {
          ToastAndroid.show(
            response.data.messageresult,
            ToastAndroid.SHORT
          );
          navigation.navigate("Reussi");
        } else {
          ToastAndroid.show(
            response.data.messageresult,
            ToastAndroid.SHORT
          );
        }
  
      } catch (error) {
        console.error('Erreur lors de la requête Axios :', error);
      }  

    } else {
      navigation.navigate("ConnectWallet");
      console.error('JWT introuvable dans l\'Async Storage');
    }
  }


  const handleValider = async () => {
    if (hash === "") {
      ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
    } else {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        retraitUSDT(hash);
      }
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
        <Text style={styles.texte}>Retrait USDT</Text>
        <Text style={styles.texte1}>
          Saisissez votre transaction HASH (TXID)
        </Text>

        <View style={styles.elementContainer}>
          <TextInput
            style={styles.input}
            placeholder="TXID"
            placeholderTextColor="#999"
            value={hash}
            onChangeText={handleHashChange}
          />
          <Text style={styles.staticText}>..</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleValider}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "30%",
    flex: 1,
  },
  texte: {
    textAlign: "center",
    fontSize: 28,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "white",
  },
  texte1: {
    fontSize: 12,
    fontFamily: "OnestRegular",
    color: "white",
    padding: 5,
    marginLeft: 35,
    marginTop: 10,
  },

  retourButton: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
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
  input: {
    width: "80%",
    height: 40,
    borderColor: "white",
    borderWidth: 0.5,
    marginTop: 5,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: "OnestBold",
    color: "white",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
  },
  elementContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
});

export default ConfirmRetrait;