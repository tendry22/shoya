import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Clipboard from "expo-clipboard";
import { ToastAndroid } from "react-native";

import ProfileNav from "../../Navs/ProfileNav";
import { BASE_URL } from "../../../config";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Earn = () => {
  const navigation = useNavigation();
  const [refference, setRefference] = useState([]);

  console.log('MIDITRA ATO AM AFFILIATION');

  const copyIDToClipboard = async () => {
    await Clipboard.setStringAsync(refference.toString());
    ToastAndroid.show("ID de parrainage copié !", ToastAndroid.SHORT);
  };

  const copyLinkToClipboard = async () => {
    await Clipboard.setStringAsync("https://accounts=191518570");
    ToastAndroid.show("Lien de parrainage copié !", ToastAndroid.SHORT);
  };

  const fetchRefference = async () => {
    console.log('MAKATO AM FETCH REFERENCE');
    try {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      console.log('==================');
      console.log(jwt_token);
      console.log('==================');
      if (jwt_token) {
        console.log('MAKATO AM IF TOKEN');
        const response = await Axios.post(`${BASE_URL}/users/validate-token`, {
          token: jwt_token,
        });
  
        console.log(response.data);
  
        const iduser = response.data.id;
  
        console.log('id user='+iduser);
  
        const apiUrl = `${BASE_URL}/refference`;
        const refferenceResponse = await Axios.get(apiUrl, { iduser: iduser });
        
        const refferenceData = refferenceResponse.data;
  
        if (refferenceData && refferenceData.length > 0) {
          const userRefference = refferenceData.find(item => item.iduser === iduser);
          if (userRefference) {
            setRefference(userRefference.codeparrinage);
          } else {
            console.error("Aucun code de parrainage trouvé pour cet utilisateur.");
            ToastAndroid.show("Aucun code de parrainage trouvé.", ToastAndroid.LONG);
          }
        } else {
          console.error("Aucune référence trouvée pour cet utilisateur.");
          ToastAndroid.show("Aucun code de parrainage trouvé.", ToastAndroid.LONG);
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error("JWT introuvable dans l'Async Storage");
        ToastAndroid.show("Erreur lors de la récupération du code de parrainage dans le jwt", ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      ToastAndroid.show("Erreur lors de la récupération du code de parrainage", ToastAndroid.LONG);
    }
  }; 
    
  useEffect(() => {
    fetchRefference();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.viewCover}>
        <ProfileNav />
        <View>
          <Text style={styles.title}>Affiliation</Text>
          <Text style={styles.content}>Parainage par défaut</Text>
        </View>
        <View style={styles.cadre}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(22, 218, 172, 0.5)", "rgba(182, 234, 92, 0.5)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rectangle}
            >
              <View style={styles.textContainerTop}>
                <Text style={styles.textTop}>Vous recevez</Text>
                <Text style={styles.textTopPercentage}>Vos amis reçoivent</Text>
              </View>
              <View style={styles.textContainerBottom}>
                <Text style={styles.textBottom}>1 Jetons</Text>
                <Text style={styles.textBottomPercentage}>1 Jetons</Text>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={["rgba(22, 218, 172, 0.5)", "rgba(182, 234, 92, 0.5)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.rectangle2}
            >
              <Text style={styles.textLeft}>ID de parainage</Text>
              <View style={styles.textRightContainer}>
                <Text style={styles.textRight}>{refference}</Text>
                <TouchableOpacity onPress={copyIDToClipboard}>
                  <Icon name="copy" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={copyIDToClipboard} style={styles.button}>
            <Text style={styles.buttonText}>Copier l'ID de parainage</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="qrcode"
              size={40}
              color="#FFEE00"
              style={styles.iconQr}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  viewCover: {
    height: "90%",
  },
  title: {
    fontFamily: "OnestBold",
    color: "#B6EA5C",
    width: "95%",
    alignSelf: "center",
    fontSize: 20,
    textAlign: "center",
    marginTop: "6%",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Vous pouvez également utiliser "space-between" si vous souhaitez un espacement entre le bouton et l'icône
    paddingHorizontal: 20,
    marginTop: 5,
  },
  iconQr: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFEE00",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    width: "80%", // Réduire la largeur du bouton ici
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontFamily: "OnestBold",
  },
  content: {
    fontFamily: "OnestBold",
    color: "#B6EA5C",
    marginTop: "10%",
    textAlign: "center",
    fontSize: 12,
  },
  rectangle: {
    width: "90%",
    height: 70,
    borderWidth: 0.2,
    borderColor: "white",
    alignSelf: "center", // Centrer horizontalement le rectangley
    marginTop: "5%",
    borderRadius: 5,
  },
  rectangle2: {
    width: "90%",
    height: 70,
    borderWidth: 0.2,
    borderColor: "white",
    alignSelf: "center", // Centrer horizontalement le rectangley
    marginTop: "5%",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rectangle3: {
    width: "90%",
    height: 70,
    borderWidth: 0.2,
    borderColor: "white",
    alignSelf: "center", // Centrer horizontalement le rectangley
    marginTop: "5%",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    flex: 1,
    marginTop: 10,
  },
  textContainerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  textTop: {
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 12,
  },
  textTopPercentage: {
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 12,
  },
  textBottom: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 16,
    marginLeft: 18,
  },

  textBottomPercentage: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 16,
    marginRight: 35,
  },
  textLeft: {
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 12,
    marginLeft: 10, // Ajustement de la marge à gauche
    marginTop: 28,
  },
  textRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10, // Ajustement de la marge à droite
  },
  textRight: {
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 12,
    marginRight: 5, // Ajustement de la marge entre le texte et l'icône
  },
});

export default Earn;
