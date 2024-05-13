import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ImageBackground } from "react-native";
import * as Font from "expo-font";
import DepotTether from "./DepotTether";
import RetraitTether from "./RetraitTether";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BackNavs from "../../Navs/BackNavs";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Tether = () => {
  const [boutonActif, setBoutonActif] = useState("Bouton 1");
  const [texteTitre, setTexteTitre] = useState("Dépôt USDT");

  const navigation = useNavigation();

  const handleBoutonPress = (bouton) => {
    setBoutonActif(bouton);
    if (bouton === "Bouton 1") {
      setTexteTitre("Dépôt USDT");
    } else if (bouton === "Bouton 2") {
      setTexteTitre("Retrait USDT");
    }
  };

  const boutonStyle = {
    backgroundColor: "#16DAAC",
    paddingHorizontal: 45,
    paddingVertical: 20,
    borderRadius: 5,
  };

  const boutonActifStyle = {
    ...boutonStyle,
    borderColor: "white",
    borderWidth: 2,
  };

  const renderFormCard = () => {
    if (boutonActif === "Bouton 1") {
      return (
        <View style={styles.formCard}>
          <DepotTether />
        </View>
      );
    } else if (boutonActif === "Bouton 2") {
      return (
        <View style={styles.formCard}>
          <RetraitTether />
        </View>
      );
    }
    return null;
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={100} // Ajustez ceci selon vos besoins pour un meilleur espacement
        enableOnAndroid={true} // Assure que cela fonctionne également sur Android
      >
        <View style={{ alignSelf: "flex-start", marginTop: 13, marginLeft: 7 }}>
          <BackNavs />
        </View>
        <View style={styles.container}>
          <Text style={styles.texte}>{texteTitre}</Text>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonActif === "Bouton 1" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonPress("Bouton 1")}
            >
              <Text style={styles.boutonTexte}>Dépôt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonActif === "Bouton 2" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonPress("Bouton 2")}
            >
              <Text style={styles.boutonTexte}>Retrait</Text>
            </TouchableOpacity>
          </View>
          {renderFormCard()}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "25%",
    flex: 1,
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
  },
  texte: {
    fontSize: 28,
    marginBottom: 25,
    fontFamily: "OnestBold",
    color: "white",
  },
  boutonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  boutonTexte: {
    color: "white",
    fontSize: 16,
    fontFamily: "OnestBold",
  },
  formCard: {
    backgroundColor: "",
    width: "100%",
    height: 300,
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  retourButton: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
  },
});

export default Tether;
