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
} from "react-native";
import CompteAdminNavs from "../navs/CompteAdminNavs";
import { RefreshControl } from "react-native-gesture-handler";
import Axios from "axios";
import { BASE_URL } from "../../../config";
import { ActivityIndicator } from "react-native";

const AdminSolde = () => {
  const [soldeMVola, setSoldeMVola] = useState(0);
  const [soldeOrangeMoney, setSoldeOrangeMoney] = useState(0);

  useEffect(() => {
    const fetchSoldeMga = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/soldemga/1`);
        setSoldeMVola(response.data.mvola);
        setSoldeOrangeMoney(response.data.orangemoney);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchSoldeMga();
  }, []);

  const [refresh, setRefresh] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500); //Changer la durée
  });

  const [soldeShoya, setSoldeShoya] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleSoldeTelmaOrange = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const getSoldeShoya = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/soldeshoya`);
        setSoldeShoya(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setInterval(() => {
      getSoldeShoya();
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const [soldeUser, setSoldeUser] = useState([]);

  useEffect(() => {
    const getSoldeUser = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/soldeuser/total`);
        setSoldeUser(response.data.total);
      } catch (error) {
        console.log(error);
      }
    };

    // Appel initial de la fonction pour récupérer les données de solde utilisateur
    getSoldeUser();

    // Définition de l'intervalle pour rafraîchir les données de solde utilisateur toutes les 2 secondes
    const timer = setInterval(() => {
      getSoldeUser();
    }, 2000);

    // Nettoyage de l'intervalle lorsque le composant est démonté ou lorsque l'effet est nettoyé
    return () => clearInterval(timer);

    // Les dépendances sont vides car cet effet ne dépend d'aucune valeur externe et est exécuté une seule fois après le montage
  }, []);

  function formatNumber(number) {
    let thing = parseFloat(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    return thing.replace(/,/g, " ");
  }

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <CompteAdminNavs />
      <View style={styles.Operateurcontainer}>
        <View style={styles.mvola}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "14%",
            }}
          >
            <Text style={styles.txtOp}>SOLDE USER MGA</Text>
          </View>
          <Text style={styles.txt}>
            {soldeUser !== null ? ( // Vérifiez si le solde est différent de null
              `${soldeUser.toLocaleString()} Ar`
            ) : (
              // Si le solde est null, affichez l'indicateur d'activité
              <ActivityIndicator size="small" />
            )}
          </Text>
        </View>
        <View style={styles.orangeMoney}>
          <TouchableOpacity onPress={handleSoldeTelmaOrange}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "14%",
              }}
            >
              <Text style={styles.txtOp}>SOLDE SHOYA MGA</Text>
            </View>
            <Text style={styles.txt}>
              {soldeShoya.mga !== undefined ? ( // Vérifiez si soldeShoya.mga est défini
                `${formatNumber(soldeShoya.mga).replace('.00','')} Ar`
              ) : (
                // Si soldeShoya.mga n'est pas défini, affichez l'indicateur d'activité
                <ActivityIndicator size="large" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>SOLDE</Text>
              <Text>
                Orange Money:{" "}
                {soldeOrangeMoney !== undefined ? (
                  `${formatNumber(soldeOrangeMoney)} Ar`
                ) : (
                  <ActivityIndicator size="small" />
                )}
              </Text>

              <Text>
                MVola:{" "}
                {soldeMVola !== undefined ? (
                  `${formatNumber(soldeMVola)} Ar`
                ) : (
                  <ActivityIndicator size="small" />
                )}
              </Text>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.deviseContainer}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Image
              source={require("../../../assets/tether-seeklogo.com.png")}
              style={{ height: 16, width: 16, marginLeft: 15 }}
            />
            <Text style={styles.cardText}>USDT</Text>
            <Image
              source={require("../../../assets/tether-seeklogo.com.png")}
              style={{ height: 16, width: 16 }}
            />
          </View>
          <View style={styles.cardContentDroite}>
            <Text style={styles.cardTextDroite}>
              {soldeShoya.usdt !== undefined ? (
                `${formatNumber(soldeShoya.usdt)} USDT`
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Text>
          </View>
        </View>
        <View style={styles.cardPM}>
          <View style={styles.cardContent}>
            <Image
              source={require("../../../assets/surface1.png")}
              style={{ height: 16, width: 16, marginLeft: 15 }}
            />
            <Text style={styles.cardText}>PERFECT MONEY</Text>
            <Image
              source={require("../../../assets/surface1.png")}
              style={{ height: 16, width: 16 }}
            />
          </View>
          <View style={styles.cardContentDroite}>
            <Text style={styles.cardTextDroite}>
              {soldeShoya.pm !== undefined ? (
                `${formatNumber(soldeShoya.pm)} USD`
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Text>
          </View>
        </View>
        <View style={styles.cardPayeer}>
          <View style={styles.cardContent}>
            <Image
              source={require("../../../assets/pp.png")}
              style={{ height: 16, width: 16, marginLeft: 15 }}
            />
            <Text style={styles.cardText}>PAYEER</Text>
            <Image
              source={require("../../../assets/pp.png")}
              style={{ height: 16, width: 16 }}
            />
          </View>
          <View style={styles.cardContentDroite}>
            <Text style={styles.cardTextDroite}>
              {soldeShoya.payeer !== undefined ? (
                `${formatNumber(soldeShoya.payeer)} USD`
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Text>
          </View>
        </View>
        <View style={styles.cardSkrill}>
          <View style={styles.cardContent}>
            <Image
              source={require("../../../assets/skrill.png")}
              style={{ height: 16, width: 16, marginLeft: 15 }}
            />
            <Text style={styles.cardText}>SKRILL</Text>
            <Image
              source={require("../../../assets/skrill.png")}
              style={{ height: 16, width: 16 }}
            />
          </View>
          <View style={styles.cardContentDroite}>
            <Text style={styles.cardTextDroite}>
              {soldeShoya.skrill !== undefined ? (
                `${formatNumber(soldeShoya.skrill)} USD`
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Text>
          </View>
        </View>
        <View style={styles.cardAirtm}>
          <View style={styles.cardContent}>
            <Image
              source={require("../../../assets/airtm.png")}
              style={{ height: 16, width: 16, marginLeft: 15 }}
            />
            <Text style={styles.cardText}>AIRTM</Text>
            <Image
              source={require("../../../assets/airtm.png")}
              style={{ height: 16, width: 16 }}
            />
          </View>
          <View style={styles.cardContentDroite}>
            <Text style={styles.cardTextDroite}>
              {soldeShoya.airtm !== undefined ? (
                `${formatNumber(soldeShoya.airtm)} USD`
              ) : (
                <ActivityIndicator size="small" />
              )}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  Operateurcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "30%",
    width: "90%",
    height: "12%",
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#85FFDE",
  },
  cardPM: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#FF8585",
  },
  cardPayeer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#8589FF",
  },
  cardSkrill: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#C685FF",
  },
  cardAirtm: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#EAEAEE",
  },
  cardContent: {
    flexDirection: "row",
  },
  cardContentDroite: {
    flexDirection: "row",
  },
  cardText: {
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: "OnestRegular",
    fontSize: 14,
  },
  cardTextDroite: {
    marginRight: "8%",
    fontFamily: "OnestBold",
    fontSize: 15,
  },
  mvola: {
    flexDirection: "column",
    borderWidth: 0.2,
    borderColor: "#ccc",
    width: "45%",
    backgroundColor: "#BAFF85",
    borderRadius: 5,
    alignItems: "center",
  },
  orangeMoney: {
    flexDirection: "column",
    borderWidth: 0.2,
    borderColor: "#ccc",
    width: "45%",
    borderRadius: 5,
    backgroundColor: "#FCCC83",
    alignItems: "center",
  },
  txtOp: {
    fontFamily: "OnestRegular",
    textAlign: "center",
    paddingRight: 3,
    paddingLeft: 3,
    fontSize: 13,
  },
  txt: {
    fontFamily: "OnestBold",
    textAlign: "center",
    padding: 2,
    fontSize: 13,
  },
  deviseContainer: {
    width: "90%",
    flex: 1,
    marginBottom: "7%",
    alignSelf: "center",
  },
});

export default AdminSolde;
