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
import { useNavigation } from "@react-navigation/native";
import IconFeather from "react-native-vector-icons/Feather";
import IconOcti from "react-native-vector-icons/MaterialIcons";
import AchatUsdt from "./AchatUsdt";
import VenteUsdt from "./VenteUsdt";
import AchatPm from "./AchatPm";
import VentePm from "./VentePm";
import AchatPayeer from "./AchatPayeer";
import VentePayeer from "./VentePayeer";
import AchatSkrill from "./AchatSkrill";
import AchatAirtm from "./AchatAirtm";

const Transaction = () => {
  const [boutonActif, setBoutonActif] = useState("Bouton 1");
  const [boutonInterieurActif, setBoutonInterieurActif] = useState("Bouton 1");

  const navigation = useNavigation();

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
  const handleBoutonInterieurPress = (bouton) => {
    setBoutonInterieurActif(bouton);
  };

  const renderFormCard = () => {
    if (boutonActif === "Bouton 1") {
      return (
        <View style={styles.contenu}>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonInterieurActif === "Bouton 1" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 1")}
            >
              <View style={styles.boutonInterne}>
                <IconFeather name="shopping-bag" size={16} color={"#056A51"} />
                <Text style={styles.boutonTexte}>Achat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                boutonStyleDroite,
                boutonInterieurActif === "Bouton 2"
                  ? boutonActifStyleDroite
                  : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 2")}
            >
              <View style={styles.boutonInterne}>
                <IconOcti name="point-of-sale" size={16} color={"#FF2D2D"} />
                <Text style={styles.boutonTexteDroite}>Vente</Text>
              </View>
            </TouchableOpacity>
          </View>
          {renderCardUsdt()}
        </View>
      );
    } else if (boutonActif === "Bouton 2") {
      return (
        <View style={styles.contenu}>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonInterieurActif === "Bouton 1" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 1")}
            >
              <View style={styles.boutonInterne}>
                <IconFeather name="shopping-bag" size={16} color={"#056A51"} />
                <Text style={styles.boutonTexte}>Achat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                boutonStyleDroite,
                boutonInterieurActif === "Bouton 2"
                  ? boutonActifStyleDroite
                  : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 2")}
            >
              <View style={styles.boutonInterne}>
                <IconOcti name="point-of-sale" size={16} color={"#FF2D2D"} />
                <Text style={styles.boutonTexteDroite}>Vente</Text>
              </View>
            </TouchableOpacity>
          </View>
          {renderCardPm()}
        </View>
      );
    } else if (boutonActif === "Bouton 3") {
      return (
        <View style={styles.contenu}>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonInterieurActif === "Bouton 1" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 1")}
            >
              <View style={styles.boutonInterne}>
                <IconFeather name="shopping-bag" size={16} color={"#056A51"} />
                <Text style={styles.boutonTexte}>Achat</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                boutonStyleDroite,
                boutonInterieurActif === "Bouton 2"
                  ? boutonActifStyleDroite
                  : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 2")}
            >
              <View style={styles.boutonInterne}>
                <IconOcti name="point-of-sale" size={16} color={"#FF2D2D"} />
                <Text style={styles.boutonTexteDroite}>Vente</Text>
              </View>
            </TouchableOpacity>
          </View>
          {renderCardPayeer()}
        </View>
      );
    } else if (boutonActif === "Bouton 4") {
      return (
        <View style={styles.contenu}>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonInterieurActif === "Bouton 1" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 1")}
            >
              <View style={styles.boutonInterne}>
                <IconFeather name="shopping-bag" size={16} color={"#056A51"} />
                <Text style={styles.boutonTexte}>Achat</Text>
              </View>
            </TouchableOpacity>
          </View>
          {renderCardSkrill()}
        </View>
      );
    } else if (boutonActif === "Bouton 5") {
      return (
        <View style={styles.contenu}>
          <View style={styles.boutonsContainer}>
            <TouchableOpacity
              style={[
                boutonStyle,
                boutonInterieurActif === "Bouton 1" ? boutonActifStyle : null,
              ]}
              onPress={() => handleBoutonInterieurPress("Bouton 1")}
            >
              <View style={styles.boutonInterne}>
                <IconFeather name="shopping-bag" size={16} color={"#056A51"} />
                <Text style={styles.boutonTexte}>Achat</Text>
              </View>
            </TouchableOpacity>
          </View>
          {renderCardAirtm()}
        </View>
      );
    }
    return null;
  };

  const renderCardUsdt = () => {
    if (boutonInterieurActif === "Bouton 1") {
      return (
        <View style={styles.renderCard}>
          <AchatUsdt />
        </View>
      );
    } else if (boutonInterieurActif === "Bouton 2") {
      return (
        <View style={styles.renderCard}>
          <VenteUsdt />
        </View>
      );
    }
    return null;
  };
  const renderCardPm = () => {
    if (boutonInterieurActif === "Bouton 1") {
      return (
        <View style={styles.renderCard}>
          <AchatPm />
        </View>
      );
    } else if (boutonInterieurActif === "Bouton 2") {
      return (
        <View style={styles.renderCard}>
          <VentePm />
        </View>
      );
    }
    return null;
  };

  const renderCardPayeer = () => {
    if (boutonInterieurActif === "Bouton 1") {
      return (
        <View style={styles.renderCard}>
          <AchatPayeer />
        </View>
      );
    } else if (boutonInterieurActif === "Bouton 2") {
      return (
        <View style={styles.renderCard}>
          <VentePayeer />
        </View>
      );
    }
    return null;
  };

  const renderCardSkrill = () => {
    if (boutonInterieurActif === "Bouton 1") {
      return (
        <View style={styles.renderCard}>
          <AchatSkrill />
        </View>
      );
    }
    return null;
  };

  const renderCardAirtm = () => {
    if (boutonInterieurActif === "Bouton 1") {
      return (
        <View style={styles.renderCard}>
          <AchatAirtm />
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
        <Text style={styles.title}>Historique des transactions</Text>
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
  renderCard: {
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    marginTop: "5%",
    flex: 1,
    borderRadius: 10,
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
  boutonInterne: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: "4%",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
    width: "90%",
    alignSelf: "center",
    height: "6%",
  },
  txtCard: {
    fontFamily: "OnestBold",
    fontSize: 14,
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
    width: "90%",
    alignSelf: "center",
    marginTop: "2%",
    flex: 1,
    marginBottom: "7%",
    borderRadius: 8,
  },
  boutonsContainer: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    height: "5%",
  },
});

export default Transaction;
