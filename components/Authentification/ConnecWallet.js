import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import bgImage from "../../assets/images/bgImage.jpg";
import logo from "../../assets/images/logo.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native";
import Axios from 'axios';
import { BASE_URL } from '../../config';

const ConnectWallet = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [admins, setAdmins] = useState();

useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const response = await Axios.get(`${BASE_URL}/admin`);
      const liste = response.data;
      setAdmins(liste);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  fetchAdmins();
}, []);

  // const verifyEmail = async (getEmail) => {
  //   let toreturn = false;
  //   const email = getEmail;
  //   try {
  //     const response = await Axios.post(`${BASE_URL}/otp/verifyEmail`, {email: email});
  //     if(response.data.id){
  //       toreturn = true;
  //     }
  //     return toreturn;
  //   } catch (error) {
  //     console.error('Erreur lors de la requête Axios :', error);
  //   }
  // }

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  // const handleEmailSubmit = async () => {
  //   // Email Validation and submit
  //   if (isValidEmail(email) && await verifyEmail(email)) {
  //     // Show modal for 3 seconds before navigation
  //     setShowModal(true);
  //     setTimeout(() => {
  //       setShowModal(false);
  //       console.log("Email Envoyer:", email);
  //       navigation.navigate("PinConnection", { email });
  //     }, 3000);
  //   } else {
  //     ToastAndroid.show(
  //       "Veuillez entrer une adresse e-mail valide",
  //       ToastAndroid.LONG
  //     );
  //   }
  // };

  const isSpecialEmail = email.includes("@admin.com");

  const verifyEmail = async (getEmail) => {
  
    const email = getEmail;

    try {
      const response = await Axios.post(`${BASE_URL}/otp/verifyEmail`, {email: email});
      if(response.data.emailNotFound) {
        ToastAndroid.show(
          "Cette email n'existe pas",
          ToastAndroid.SHORT
        );
      }else if (!response.data.emailNotFound) {
        navigation.navigate("PinConnection", {
          email,
        });
      }

    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }

  }

  const handleEmailSubmit = () => {
    // Email Validation and submit
    if (isValidEmail(email) && !isSpecialEmail) {
      // Le code pour les e-mails valides autres que "quelquechose@admin.com"
      console.log("Email Envoyer:", email);
      verifyEmail(email);
    } else if (isSpecialEmail) {
      // Le code pour les e-mails contenant "quelquechose@admin.com"
      let is = false;
      console.log("Email spécial détecté");
      for(let i=0; i<admins.length; i++){
        if(admins[i].email == email){
          is = true;
        }
      }
      if(is){
        // Redirection vers une autre route
        navigation.navigate("HomeAdminConnexion", {email});
      }
      else{
        ToastAndroid.show(
          "Vous n'etes pas administrateur",
          ToastAndroid.LONG
        );
      }
    } else {
      console.log("Email Invalide");
      ToastAndroid.show(
        "Veuillez entrer une adresse e-mail valide",
        ToastAndroid.LONG
      );
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={100} // Ajustez ceci selon vos besoins pour un meilleur espacement
        enableOnAndroid={true} // Assure que cela fonctionne également sur Android
      >
        <TouchableOpacity
          style={styles.retourButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <Text style={styles.label}>Email:</Text>

        <View style={styles.email}>
          <TextInput
            style={styles.input}
            placeholder=""
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.ButtonContainer}>
          <TouchableOpacity
            style={styles.Buttoncreate}
            onPress={handleEmailSubmit}
          >
            <LinearGradient
              colors={["#16daac", "#b6ea5c"]}
              // locations={[0, 0.5, 0.6]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.textCreate}>Se Connecter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.textCondition}></View>

        <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(24, 21, 38, 0.8)",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <ActivityIndicator size="large" />
              <Text
                style={{
                  marginTop: "2%",
                  fontFamily: "OnestBold",
                  color: "#fff",
                }}
              >
                Vérification en cours
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default ConnectWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  retourButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: "2%",
    marginTop: "30%",
  },
  ButtonContainer: {
    alignItems: "center",
    marginBottom: "3%",
    marginTop: "0%",
  },
  logo: {
    width: 350,
    height: 150,
  },
  email: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: "OnestBold",
    color: "#B6EA5C",
    marginLeft: "6%",
    marginTop: "17%",
    borderColor: "white",
    paddingBottom: "2%",
    width: "88%",
  },
  input: {
    width: "89%",
    height: 45,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: "2%",
    paddingHorizontal: 10,
    textDecorationStyle: "dashed",
    alignItems: "center",
    fontFamily: "OnestBold",
  },
  Buttoncreate: {
    width: "90%",
    height: 45,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: "8%",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreate: {
    fontSize: 16,
    fontFamily: "OnestBold",
  },
  textCondition: {
    borderColor: "#B6EA5C",
    width: "80%",
    alignSelf: "center",
    marginTop: "5%",
  },
  condition: {
    fontFamily: "OnestRegular",
    color: "white",
    textAlign: "center",
    marginTop: "2%",
    fontSize: 14,
    marginLeft: "3%",
  },
  linkText: {
    color: "#B6EA5C",
    textDecorationLine: "underline",
    fontFamily: "OnestRegular",
    textAlign: "justify",
  },
});
