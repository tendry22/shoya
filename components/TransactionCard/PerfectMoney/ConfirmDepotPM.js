import React from "react";
import {
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Image,
  ToastAndroid
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from 'axios';
import { BASE_URL } from '../../../config';
import { useState, useEffect } from "react";

const ConfirmDepotPM = ({ route }) => {
  const { montant, address } = route.params;
  const navigation = useNavigation();

  const [cours, setCours] = useState();

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/cours`);
        const liste = response.data;
        for(let i=0; i<liste.length; i++){
          if(response.data[i].actif == 'pm'){
            setCours(response.data[i].depot);
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchCours();
  }, []);

  const handleSubmit = async () => {
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      if (jwt_token) {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
        console.log('adresse='+address);
        console.log('montant='+montant);
        console.log('iduser='+user.data.id);
        const apiUrl = `${BASE_URL}/perfectmoney/depot`;
        const response = await Axios.post(apiUrl, { iduser: user.data.id,receveur: address, montant: +montant });
        console.log(response.data.messageresult);
        if(response.data.messageresult == 'Transaction effectuee'){
          navigation.navigate("Reussi");
        }
        else{
          ToastAndroid.show(
            response.data.messageresult,
            ToastAndroid.SHORT
          );
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error("JWT introuvable dans l'Async Storage");
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  };

  // const handleSubmit = () => {
  //   console.log("Adresse:", address);
  //   console.log("Montant:", montant, "USDT");
  //   console.log("Montant total en Ar:", montant * 4600 + 4502, "Ar");
  //   navigation.navigate("Reussi");
  // };

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
          <Text style={styles.montant}>{montant} USD</Text>
        </View>
        <View style={styles.minMaxContainer}>
          <View>
            <Text style={styles.minMaxLabelText}>Adresse</Text>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxLabelText}>Actif</Text>
              <Text style={styles.minMaxLabelText}>Montant</Text>
              <Text style={styles.minMaxLabelText}>Cours</Text>
              <Text style={styles.minMaxLabelText}>
                Montant Total en Ariary
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.minMaxValueText}>{address}</Text>
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxValueText}>USD</Text>
              <Text style={styles.minMaxValueText}>{montant} USD</Text>
              <Text style={styles.minMaxValueText}>{cours} Ar</Text>
              <Text style={styles.minMaxValueText}>
                {(montant * cours).toLocaleString()} Ariary
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
            Vérifier que l'adresse est correcte. Les transactions ne peuvent pas
            être annulées
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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

export default ConfirmDepotPM;
