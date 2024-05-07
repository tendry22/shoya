import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import IconOcti from "react-native-vector-icons/Octicons";

import CompteAdminNavs from "../navs/CompteAdminNavs";
import UtilisateursVerifie from "./UtilisateursVerifie";
import UtilisateursNonVerifie from "./UtilisateursNonVerifie";
import RetourNavs from "../navs/RetourNavs";

const Utilisateurs = () => {
  const [boutonActif, setBoutonActif] = useState("Bouton 1");

  const handleBoutonPress = (bouton) => {
    setBoutonActif(bouton);
  };

  const boutonStyle = {
    backgroundColor: "#16DAAC",
    width: "38%",
  };
  const boutonStyleDroite = {
    backgroundColor: "#FFA8A8",
    width: "38%",
  };

  const boutonActifStyle = {
    ...boutonStyle,
    borderColor: "white",
    borderWidth: 1,
  };
  const boutonActifStyleDroite = {
    ...boutonStyleDroite,
    borderColor: "white",
    borderWidth: 1,
  };

  const renderFormCard = () => {
    if (boutonActif === "Bouton 1") {
      return (
        <View style={styles.contenu}>
          <UtilisateursVerifie />
        </View>
      );
    } else if (boutonActif === "Bouton 2") {
      return (
        <View style={styles.contenu}>
          <UtilisateursNonVerifie />
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
      <CompteAdminNavs />
      <RetourNavs />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Utilisateurs</Text>
      </View>
      <View style={styles.boutonsContainer}>
        <TouchableOpacity
          style={[
            boutonStyle,
            boutonActif === "Bouton 1" ? boutonActifStyle : null,
          ]}
          onPress={() => handleBoutonPress("Bouton 1")}
        >
          <View style={styles.boutonInterne}>
            <IconFeather name="check-circle" size={16} color={"#056A51"} />
            <Text style={styles.boutonTexte}>Vérifié</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            boutonStyleDroite,
            boutonActif === "Bouton 2" ? boutonActifStyleDroite : null,
          ]}
          onPress={() => handleBoutonPress("Bouton 2")}
        >
          <View style={styles.boutonInterne}>
            <IconOcti name="unverified" size={16} color={"#FF2D2D"} />
            <Text style={styles.boutonTexteDroite}>Non Vérifié</Text>
          </View>
        </TouchableOpacity>
      </View>
      {renderFormCard()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: "30%",
    width: "90%",
    alignSelf: "center",
  },
  boutonInterne: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: "4%",
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
  boutonsContainer: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    height: "5%",
  },
  boutonTexte: {
    color: "#056A51",
    fontSize: 16,
    fontFamily: "OnestBold",
    paddingLeft: "5%",
  },
  boutonTexteDroite: {
    color: "#FF2D2D",
    fontSize: 16,
    fontFamily: "OnestBold",
    paddingLeft: "5%",
  },
  contenu: {
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    width: "90%",
    alignSelf: "center",
    marginTop: "8%",
    flex: 1,
    marginBottom: "7%",
    borderRadius: 8,
  },
});

export default Utilisateurs;
