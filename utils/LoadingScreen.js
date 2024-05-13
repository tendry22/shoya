import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Connexion"); // Naviguer vers une autre page
    }, 3000); // 5000 millisecondes = 5 secondes

    return () => clearTimeout(timer); // Nettoyer le timer quand le composant est démonté
  }, []);

  return (
    <View style={styles.container}>
      {/* Votre logo */}
      <Image source={require("../assets/images/logo.png")} />
      <LottieView
        source={require("../assets/chargement.json")}
        loop
        autoPlay
        style={{ width: 125, height: 125 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181526",
  },
  logo: {
    resizeMode: "contain",
    width: 150,
    height: 150,
  },
});

export default LoadingScreen;
