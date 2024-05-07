import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { BackHandler } from "react-native";

const Reussi = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      // Empêcher le retour en arrière si vous êtes sur la page CreateWallet
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

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("HomeScreen");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.operationReussie}>
          <View style={styles.decorationView}></View>
          <Text style={styles.transactionText}>Transaction Effectuée !</Text>
          <LottieView
            source={require("../../../assets/celebrate.json")}
            loop={false}
            autoPlay
            style={{ width: "80%", height: "80%", alignSelf: "center" }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    height: "100%",
  },
  operationReussie: {
    borderWidth: 0.5,
    borderColor: "gray",
    width: "85%",
    height: "50%",
    borderRadius: 15,
    backgroundColor: "rgba(24, 21, 38, 0.8)",
  },
  decorationView: {
    width: "85%",
    borderWidth: 2,
    borderColor: "#b6ea5c",
    alignSelf: "center",
    marginTop: "6%",
  },
  transactionText: {
    fontFamily: "OnestBold",
    color: "whitesmoke",
    fontSize: 18,
    marginTop: "5%",
    textAlign: "center",
  },
});
export default Reussi;
