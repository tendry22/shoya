import React from "react";
import {
  ImageBackground,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import WebView from 'react-native-webview';
import { BASE_URL } from "../../../config";
import Axios from 'axios';

const ConfirmRetraitPM = ({ route }) => {
  const { montant } = route.params;
  const { iduser } = route.params;
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const [cours, setCours] = useState();

  const adresseShoya = process.env.EXPO_PUBLIC_SHOYA_ADRESS_PM;

  useEffect(() => {
    console.log("ADRESSE SHOYA="+adresseShoya);
    const fetchCours = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/cours`);
        const liste = response.data;
        for(let i=0; i<liste.length; i++){
          if(response.data[i].actif == 'pm'){
            setCours(response.data[i].retrait);
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchCours();
  }, []);

  const htmlForm = `
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
  <form action="https://perfectmoney.com/api/step1.asp" method="POST" style="margin-top: 20px;">
      <input type="hidden" name="PAYEE_ACCOUNT" value="${adresseShoya}">
      <input type="hidden" name="PAYEE_NAME" value="Shoya Exchange">
      <input type="hidden" name="PAYMENT_AMOUNT" value="${montant}">
      <input type="hidden" name="PAYMENT_UNITS" value="USD">
      <input type="hidden" name="PAYMENT_URL" value="http://192.168.1.104:3000/perfectmoney/retrait/${iduser}/${montant}">
      <input type="hidden" name="NOPAYMENT_URL" value="https://www.instagram.com/">
      <input type="submit" name="PAYMENT_METHOD" value="AVANCER" style="width: 400px; height: 60px; background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px;">
    </form>
</div>
  `;

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    navigation.replace("TabBarRoute");
    // setShowModal(false);
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
        <Text style={styles.texte1}>Retrait de: </Text>
        <View style={styles.amountContainer}>
          <Text style={styles.montant}>{montant} USD</Text>
        </View>
        <View style={styles.minMaxContainer}>
          <View>
            <Text style={styles.minMaxLabelText}>Adresse</Text>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxLabelText}>Actif</Text>
              <Text style={styles.minMaxLabelText}>Montant</Text>
              <Text style={styles.minMaxLabelText}>
                Montant Total en Ariary
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.minMaxValueText}>U35215711</Text>
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxValueText}>USD</Text>
              <Text style={styles.minMaxValueText}>{montant} USD</Text>
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
            Vérifier que tout est correcte. Les transactions ne peuvent pas être
            annulées
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 30, borderRadius: 10, width: '90%', height: '80%' }}>
            <WebView
              source={{ html: htmlForm }}
              style={{ width: 300, height: 500 }}
            />
            <TouchableOpacity onPress={handleCloseModal}>
              <Text>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: "80%",
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontFamily: "OnestBold",
  },
});

export default ConfirmRetraitPM;