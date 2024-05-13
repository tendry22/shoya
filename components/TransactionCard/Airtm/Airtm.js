import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  ScrollView
} from "react-native";
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ToastAndroid } from "react-native";
import BackNavs from "../../Navs/BackNavs";
import { BASE_URL } from '../../../config';
import Axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Airtm = () => {
  const adresseShoya = process.env.EXPO_PUBLIC_SHOYA_ADRESS_AIRTM;
  const [montant, setMontant] = useState("");
  const navigation = useNavigation();
  const [valeurEnAriary, setValeurEnAriary] = useState("");
  const [cours, setCours] = useState();

  const [maxMga, setMaxMga] = useState(0);

  const [userRef, setUserRef] = useState("");

  const [nbrAirtm, setNbrAirtm] = useState(0);

  useEffect(() => {
    const fetchRef = async () => {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      if (jwt_token) {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
        setUserRef(user.data.user_reference);

        const airtm = await Axios.post(`${BASE_URL}/airtm/findTodayByUser`, { iduser: user.data.id });
        setNbrAirtm(airtm.data.length);
      }
      else{
        navigation.navigate("ConnectWallet");
      }
    };
    fetchRef();
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

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/cours`);
        const liste = response.data;
        for(let i=0; i<liste.length; i++){
          if(response.data[i].actif == 'airtm'){
            setCours(response.data[i].retrait);
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchCours();
  }, []);


  const handleMontantChange = (text) => {
    if (text === "" || (parseInt(text) >= 1 && parseInt(text) <= 1000)) {
      setMontant(text);
      const valeur = text !== "" ? parseInt(text) * cours : "";
      setValeurEnAriary(valeur);
    }
  };

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync("Ambinintsoak@gmail.com");
    ToastAndroid.show(
      "Adresse copiée dans le presse-papier !",
      ToastAndroid.SHORT
    );
  };
  const copyReferenceToClipboard = async () => {
    await Clipboard.setStringAsync(adresseShoya +'');
    ToastAndroid.show(
      "Référence copiée dans le presse-papier !",
      ToastAndroid.SHORT
    );
  };

  const handleMinPress = () => {
    setMontant("10");
    setValeurEnAriary(10 * cours + '');
  };

  const handleSubmit = () => {
    if(nbrAirtm >= 3){
      ToastAndroid.show("Vous avez atteint la limite d'annulation aujourd'hui, revenez demain"
      , ToastAndroid.SHORT);
    }
    else{
      if (montant === "" || montant < 10 || montant > (maxMga / cours)) {
        ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
      } else {
        navigation.navigate("ConfirmRetraitAirtm", {
          montant,
        });
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ alignSelf: "flex-start", marginTop: 13, marginLeft: 7 }}>
          <BackNavs />
        </View>
        <View style={styles.formCard}>
          <Text style={styles.texte}>Retrait Airtm</Text>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.txtMail}>Adresse mail du portefeuille</Text>
              <View style={styles.copyContainer}>
                <Text style={styles.txtMailTxt}>Ambinintsoak@gmail.com</Text>
                <TouchableOpacity onPress={() => copyAddressToClipboard()}>
                  <Icon name="copy" size={14} color="white" />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 15 }}></View>
              <Text style={styles.txtMail}>Votre référence de paiement</Text>
              <View style={styles.copyContainer}>
                <Text style={styles.txtMailTxt}>
                  {userRef}
                </Text>
                <TouchableOpacity onPress={() => copyReferenceToClipboard()}>
                  <Icon name="copy" size={14} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.warningContainer}>
                <FontAwesome
                  name="warning"
                  size={14}
                  color="yellow"
                  style={{ marginLeft: 8 }}
                />
                <Text style={styles.warningLabelText}>
                  Code de référence obligatoire pour cette transaction.
                </Text>
              </View>
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
                    <Text style={styles.minMaxValueText}>10 USD</Text>
                    <Text style={styles.minMaxValueText}>{(maxMga / cours).toFixed(2)} USD</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Airtm Envoyé</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scroll: {
    flexGrow: 1,
  },
  vw: {
    flexDirection: "row",
    position: "absolute",
    top: 157,
    right: 12,
  },
  copyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  texte: {
    fontSize: 28,
    marginBottom: 15,
    fontFamily: "OnestBold",
    color: "white",
    textAlign: "center",
  },
  txtMail: {
    fontSize: 12,
    fontFamily: "OnestRegular",
    color: "#ccc",
    marginLeft: 2,
  },
  txtMailTxt: {
    fontSize: 11,
    fontFamily: "OnestBold",
    color: "white",
    marginLeft: 2,
    marginRight: 10,
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
    marginTop: 16,
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
  formCard: {
    width: "100%",
    height: 300,
    padding: 20,
    borderRadius: 10,
    marginTop: "30%",
  },
  warningContainer: {
    marginTop: 15,
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 238, 00, 0.4)",
  },
  warningLabelText: {
    fontFamily: "OnestBold",
    color: "#FFEE00",
    fontSize: 10,
    marginLeft: 12,
    marginRight: 12,
  },
});

export default Airtm;
