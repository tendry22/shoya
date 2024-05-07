import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import bgImage from "../../assets/images/bgImage.jpg";
import logo from "../../assets/images/logo.png";
import Welcome from "../../assets/images/Welcome.png";
import LottieView from "lottie-react-native";
import { BackHandler } from "react-native";
import { useEffect } from "react";

const Connexion = ({ navigation }) => {
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.textImage}>
        <Image source={Welcome} style={styles.trace} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.Buttoncreate}
          onPress={() => navigation.navigate("CreateWallet")}
        >
          <LinearGradient
            colors={["#16daac", "#b6ea5c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.textCreate}>Créer un portefeuille</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Buttonconnect}
          onPress={() => navigation.navigate("ConnectWallet")}
        >
          <Text style={styles.textConnect}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Connexion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "30%",
    marginBottom: "12%",
  },
  logo: {
    width: 350,
    height: 150,
  },
  textImage: {
    alignItems: "center",
    marginBottom: "12%",
  },
  trace: {
    width: 230,
    height: 60,
  },
  buttonContainer: {
    marginTop: "8%",
    alignItems: "center",
  },
  Buttoncreate: {
    width: "90%",
    height: "20%",
    borderRadius: 30,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreate: {
    fontSize: 16,
    fontFamily: "OnestBold",
    textAlign: "center",
    lineHeight: 48,
  },
  Buttonconnect: {
    width: "90%",
    height: "20%",
    top: 20,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textConnect: {
    color: "white",
    fontSize: 16,
    fontFamily: "OnestBold",
  },
});
