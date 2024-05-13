import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import CompteAdminNavs from "../navs/CompteAdminNavs";
import RetourNavs from "../navs/RetourNavs";

import BilanPm from "./BilanPm";
import BilanUsdt from "./BilanUsdt";
import BilanPayeer from "./BilanPayeer";
import BilanAirtm from "./BlianAirtm";
import BilanSkrill from "./BilanSkrill";

const Bilan = () => {
  const [boutonActif, setBoutonActif] = useState("Bouton 1");

  const boutonUsdt = {
    height: "100%",
    width: "18%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#85FFDE",
  };
  const boutonPm = {
    height: "100%",
    width: "18%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#FF8585",
  };
  const boutonPayeer = {
    height: "100%",
    width: "18%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#8589FF",
  };
  const boutonSkrill = {
    height: "100%",
    width: "18%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#C685FF",
  };
  const boutonAirtm = {
    height: "100%",
    width: "18%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#EAEAEE",
  };

  const boutonStyle = {
    backgroundColor: "#16DAAC",
    width: "38%",
    height: 25,
  };
  const boutonStyleDroite = {
    backgroundColor: "#FFA8A8",
    width: "38%",
    height: 25,
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

  const boutonUsdtActif = {
    ...boutonUsdt,
    borderColor: "white",
    borderWidth: 1,
  };
  const boutonPmActif = {
    ...boutonPm,
    borderColor: "white",
    borderWidth: 1,
  };
  const boutonPayeerActif = {
    ...boutonPayeer,
    borderColor: "white",
    borderWidth: 1,
  };
  const boutonSkrillActif = {
    ...boutonSkrill,
    borderColor: "white",
    borderWidth: 1,
  };
  const boutonAirtmActif = {
    ...boutonAirtm,
    borderColor: "white",
    borderWidth: 1,
  };

  const handleBoutonPress = (bouton) => {
    setBoutonActif(bouton);
  };

  const renderFormCard = () => {
    if (boutonActif === "Bouton 1") {
      return (
        <View style={styles.renderCard}>
          <BilanUsdt />
        </View>
      );
    } else if (boutonActif === "Bouton 2") {
      return (
        <View style={styles.renderCard}>
          <BilanPm />
        </View>
      );
    } else if (boutonActif === "Bouton 3") {
      return (
        <View style={styles.renderCard}>
          <BilanPayeer />
        </View>
      );
    } else if (boutonActif === "Bouton 4") {
      return (
        <View style={styles.renderCard}>
          <BilanSkrill />
        </View>
      );
    } else if (boutonActif === "Bouton 5") {
      return (
        <View style={styles.renderCard}>
          <BilanAirtm />
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
        <Text style={styles.title}>Bilan</Text>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            boutonUsdt,
            boutonActif === "Bouton 1" ? boutonUsdtActif : null,
          ]}
          onPress={() => handleBoutonPress("Bouton 1")}
        >
          <Text style={styles.txtCard}>USDT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[boutonPm, boutonActif === "Bouton 2" ? boutonPmActif : null]}
          onPress={() => handleBoutonPress("Bouton 2")}
        >
          <Text style={styles.txtCard}>PM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            boutonPayeer,
            boutonActif === "Bouton 3" ? boutonPayeerActif : null,
          ]}
          onPress={() => handleBoutonPress("Bouton 3")}
        >
          <Text style={styles.txtCard}>Payeer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            boutonSkrill,
            boutonActif === "Bouton 4" ? boutonSkrillActif : null,
          ]}
          onPress={() => handleBoutonPress("Bouton 4")}
        >
          <Text style={styles.txtCard}>Skrill</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            boutonAirtm,
            boutonActif === "Bouton 5" ? boutonAirtmActif : null,
          ]}
          onPress={() => handleBoutonPress("Bouton 5")}
        >
          <Text style={styles.txtCard}>Airtm</Text>
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
  txtCard: {
    fontFamily: "OnestBold",
    fontSize: 14,
  },
  renderCard: {
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    marginTop: "5%",
    flex: 1,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    marginBottom: "7%",
  },
  titleContent: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "OnestBold",
    color: "whitesmoke",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
    width: "90%",
    alignSelf: "center",
    height: "6%",
  },
  container: {
    width: "90%",
    flex: 1,
    alignSelf: "center",
    marginBottom: "7%",
    marginTop: "4%",
  },
  benefice: {
    height: "33%",
    justifyContent: "center",
  },
  vente: {
    height: "33%",
    justifyContent: "center",
  },
  achat: {
    height: "33%",
    justifyContent: "center",
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
  beneficeGauche: {
    flexDirection: "row",
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    borderRadius: 10,
    width: "70%",
    alignSelf: "center",
    justifyContent: "space-between",
    height: "50%",
    alignItems: "center",
    marginTop: "2%",
  },
  txtBenef: {
    color: "white",
    paddingBottom: "2%",
    fontFamily: "OnestBold",
    fontSize: 12,
  },
  txtBenefDroite: {
    color: "white",
    paddingBottom: "2%",
    textAlign: "right",
    fontFamily: "OnestRegular",
    fontSize: 12,
  },
});
export default Bilan;
