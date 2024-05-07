import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Axios from 'axios';
import { BASE_URL } from '../../config';

import bgImage from "../../assets/images/bgImage.jpg";
import logo from "../../assets/images/logo.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateWallet = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedPolitique, setIsCheckedPolitique] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const verifyEmail = async (getEmail) => {
    const email = getEmail;
    try {
      const response = await Axios.post(`${BASE_URL}/otp/verifyEmail`, {email: email});
      console.log(response.data);
      console.log(response.data.emailNotFound);
      if(!response.data.emailNotFound) {
        ToastAndroid.show(
          "Email déjà pris",
          ToastAndroid.SHORT
        );
      }else if (response.data.emailNotFound) {
        Axios.post(`${BASE_URL}/otp/send`, { email: email}).then(() => {
          navigation.navigate("MailValidation", {
            email,
          });
        });        
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  }

  const handleEmailSubmit = () => {
    // Email Validation and submit
    if (
      isValidEmail(email) && // Vérifie si l'email est valide
      isChecked && // Vérifie si la première case est cochée
      isCheckedPolitique // Vérifie si la deuxième case est cochée
    ) {
      console.log("Email Envoyer:", email);
      verifyEmail(email);
    } else if (!isValidEmail(email)) {
      // Le code pour les e-mails invalides
      ToastAndroid.show(
        "Veuillez entrer une adresse e-mail valide",
        ToastAndroid.LONG
      );
    } else if (!isChecked || !isCheckedPolitique) {
      // Le code pour les cases non cochées
      ToastAndroid.show(
        "Veuillez accepter les conditions d'utilisation et la politique de confidentialité",
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
              <Text style={styles.textCreate}>Envoyer le code</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.textCondition}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              disabled={false}
              value={isChecked}
              onValueChange={(newValue) => setIsChecked(newValue)}
            />
            <Text style={styles.condition}>
              Accepter les conditions d'utilisation
            </Text>
          </View>
        </View>
        <View style={styles.textCondition}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              disabled={false}
              value={isCheckedPolitique}
              onValueChange={(newValue) => setIsCheckedPolitique(newValue)}
            />
            <Text style={styles.condition}>
              Accepter la politique de confidentialité
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            borderColor: "white",
            width: "80%",
            alignSelf: "center",
            marginTop: "4%",
          }}
        >
          <Text style={styles.linkText}>
            Lire les conditions d'utilisation et la politique de confidentialité{" "}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default CreateWallet;

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
