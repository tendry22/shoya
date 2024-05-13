import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

import global from "../../assets/css/global";

import bgImage from "../../assets/Images/bgImage.jpg";
import identity from "../../assets/icons/identity.png";
import numero from "../../assets/icons/numero.png";
import aide from "../../assets/icons/aide.png";
import logout from "../../assets/icons/logout.png";

import NavComptes from "../navs/NavComptes";

import NavComptes from "../navs/NavComptes";
import Axios from "axios";
import { BASE_URL } from "../../../config";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Comptes = () => {
  const navigation = useNavigation();

  // Exemple de variable d'état pour l'état de vérification
  const [verificationStatus, setVerificationStatus] = useState("non-verifie"); // 'verifie', 'non - verifie', 'en - cours'

  useEffect(() => {
    const getUserVerified = async () => {
      const jwt_token = await AsyncStorage.getItem("jwt_token");

      if (jwt_token) {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, {
          token: jwt_token,
        });
        const listekyc = await Axios.get(`${BASE_URL}/kyc`);
        let kyc;
        let mananaKYC = false;
        for (let i = 0; i < listekyc.data.length; i++) {
          if (listekyc.data[i].iduser === user.data.id) {
            kyc = listekyc.data[i].validation;
            mananaKYC = true;
          }
        }
        try {
          if (!mananaKYC) {
            setVerificationStatus("non-verifie");
          } else if (mananaKYC && !kyc) {
            setVerificationStatus("en-cours");
          } else if (mananaKYC && kyc) {
            setVerificationStatus("verifie");
          }
        } catch (error) {
          console.error("Erreur lors de la requête Axios :", error);
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error("JWT introuvable dans l'Async Storage");
      }
    };

    // Appel initial de la fonction pour récupérer l'état de vérification utilisateur
    getUserVerified();

    // Définition de l'intervalle pour rafraîchir l'état de vérification utilisateur toutes les 2 secondes
    const timer = setInterval(() => {
      getUserVerified();
    }, 2000);

    // Nettoyage de l'intervalle lorsque le composant est démonté ou lorsque l'effet est nettoyé
    return () => clearInterval(timer);

    // Les dépendances sont vides car cet effet ne dépend d'aucune valeur externe et est exécuté une seule fois après le montage
  }, []);

  // Fonction pour obtenir les styles en fonction de l'état de vérification
  const getVerificationStyles = () => {
    let textStyles = styles.verifie;
    let icon = "check";
    let textColor = "#06664E"; // Couleur du texte pour l'état "vérifié"
    let backgroundColor = "#04F8BB"; // Couleur de fond pour l'état "vérifié"

    if (verificationStatus === "non-verifie") {
      textStyles = styles.nonVerifie;
      icon = "times";
      textColor = "#FF2D2D"; // Couleur du texte pour l'état "non vérifié"
      backgroundColor = "#FFA8A8"; // Couleur de fond pour l'état "non vérifié"
    } else if (verificationStatus === "en-cours") {
      textStyles = styles.enCours;
      icon = "ellipsis-h";
      textColor = "#181526"; // Couleur du texte pour l'état "en cours"
      backgroundColor = "#EAE55C"; // Couleur de fond pour l'état "en cours"
    }

    useEffect(() => {
      getUserVerified();
    }, []);

    return { textStyles, icon, textColor, backgroundColor };
  };

  // Récupérer les styles en fonction de l'état de vérification
  const { textStyles, icon, textColor, backgroundColor } =
    getVerificationStyles();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwt_token");
    navigation.navigate("Home");
  };

  // Logout
  const confirmLogout = () => {
    Alert.alert(
      "Confirmation",
      "Souhaitez-vous vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          onPress: handleLogout, // Remplacez `handleLogout` par votre fonction de déconnexion
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.pageContainer}
      resizeMode="cover"
    >
      <View style={styles.navContainer}>
        <NavComptes />
      </View>

      <View style={styles.logoContainer}>
        <Text style={global.grandTextJaune}>Information Personnelle</Text>
      </View>
      <View style={styles.container}>
        <Pressable
          style={styles.compteContainer}
          onPress={() => navigation.navigate("Identity")}
        >
          <LinearGradient
            colors={["#16daac", "#b6ea5c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, { backgroundColor }]}
          >
            <Image source={identity} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.textIdent}>Identité</Text>
              <View style={[styles.verifView, { backgroundColor }]}>
                <Icon name={icon} style={[styles.icon, { color: textColor }]} />
                <Text style={[styles.verificationText, textStyles]}>
                  {verificationStatus === "verifie"
                    ? "Vérifié"
                    : verificationStatus === "non-verifie"
                    ? "Non vérifié"
                    : "En cours"}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" style={styles.icone} />
          </LinearGradient>
        </Pressable>
        <Pressable
          style={styles.compteContainer}
          onPress={() => navigation.navigate("Numero")}
        >
          <LinearGradient
            colors={["#16daac", "#b6ea5c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Image source={numero} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Numéro enregistré</Text>
            </View>
            <Icon name="chevron-right" style={styles.icone} />
          </LinearGradient>
        </Pressable>
        <Pressable
          style={styles.compteContainer}
          onPress={() => navigation.navigate("AideAssistance")}
        >
          <LinearGradient
            colors={["#16daac", "#b6ea5c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Image source={aide} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Aide et Assistance</Text>
            </View>
            <Icon name="chevron-right" style={styles.icone} />
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.compteContainer} onPress={confirmLogout}>
          <LinearGradient
            colors={["#16daac", "#b6ea5c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Image source={logout} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Déconnexion</Text>
            </View>
            <Icon name="chevron-right" style={styles.icone} />
          </LinearGradient>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default Comptes;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    resizeMode: "cover",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "30%",
    marginBottom: "1%",
  },
  navContainer: {
    alignSelf: "flex-start",
  },
  container: {
    alignItems: "center",
    marginTop: "2%",
  },
  compteContainer: {
    width: "88%",
    height: "14%",
    borderRadius: 20,
    marginBottom: 20,
  },
  gradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
  },
  image: {
    width: 27,
    height: 27,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  textIdent: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
    marginRight: 75,
    textAlign: "left",
    marginLeft: 11,
  },
  text: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
    textAlign: "left",
    marginLeft: 9,
  },
  verifie: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  icone: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  verifie: {
    color: "#06664E",
    padding: 5,
  },
  nonVerifie: {
    color: "#FF2D2D",
    padding: 5,
  },
  enCours: {
    color: "#181526",
    padding: 5,
  },
  icon: {
    marginLeft: 5,
  },
  verifView: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'flex-end',
    flex: 2,
    marginRight: "10%",
  },
  verificationText: {
    fontSize: 12,
    // fontWeight: 'bold',
  },
});
