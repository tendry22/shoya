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
import RetourNavs from "../navs/RetourNavs";
import Axios from 'axios';
import { BASE_URL } from '../../../config';

const ValidationHistory = () => {
  const [filter, setFilter] = useState("Tout"); // État local pour suivre le statut du filtre
  const [liste, setListe] = useState();

  function formatDateTime(dateString) {
    const dateObj = new Date(dateString);
  
    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
  
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);
    const seconds = ("0" + dateObj.getSeconds()).slice(-2);
  
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

  useEffect(() => {
    const fetchListe = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/airtm`);
        const liste = response.data;
        setListe(liste);  
      } catch (error) {
        console.log(error.response.data);
      }
    };
  
    // Appel initial de la fonction pour récupérer la liste
    fetchListe();
  
    // Définition de l'intervalle pour rafraîchir la liste toutes les 2 secondes
    const timer = setInterval(() => {
      fetchListe();
    }, 2000);
  
    // Nettoyage de l'intervalle lorsque le composant est démonté ou lorsque l'effet est nettoyé
    return () => clearInterval(timer);
  
    // Les dépendances sont vides car cet effet ne dépend d'aucune valeur externe et est exécuté une seule fois après le montage
  }, []);
  

  let filteredTransactions = liste;

  if (filter === "Terminé") {
    filteredTransactions = liste.filter(item => item.validation === "validated");
  } else if (filter === "Annulé") {
    filteredTransactions = liste.filter(item => item.validation === "cancelled");
  }

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <CompteAdminNavs />
      <RetourNavs />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Historique de validation Airtm</Text>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.tout} onPress={() => setFilter("Tout")}>
          <Text
            style={[
              styles.txtTout,
              filter === "Tout" && styles.selectedButtonText,
            ]}
          >
            Tout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.termine}
          onPress={() => setFilter("Terminé")}
        >
          <Text
            style={[
              styles.txtTermine,
              filter === "Terminé" && styles.selectedButtonText,
            ]}
          >
            Terminé
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.annule}
          onPress={() => setFilter("Annulé")}
        >
          <Text
            style={[
              styles.txtAnnule,
              filter === "Annulé" && styles.selectedButtonText,
            ]}
          >
            Annulé
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
      {liste && (
        <ScrollView>
          {filteredTransactions.map((item) => (
            <View key={item.id}>
              <View style={styles.validationContainer}>
                <View>
                  <Text style={styles.txtContenu}>
                    Référence: {item.userReference}{" "}
                  </Text>
                  <Text style={styles.txtContenu}>
                    Montant: {item.montant}{" "} USD
                  </Text>
                  <Text style={styles.txtContenu}>
                    ID Utilisateur: {item.iduser}
                  </Text>
                </View>
                <View>
                  <Text
                    style={
                      item.validation === "cancelled"
                        ? styles.txtContenuDroiteAnnule
                        : styles.txtContenuDroite
                    }
                  >
                    {item.validation}
                  </Text>

                  <Text style={styles.txtDate}>{formatDateTime(item.date)}</Text>
                </View>
              </View>
              <View>
                <View style={styles.separator} />
              </View>
            </View>
          ))}
        </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  selectedButtonText: {
    color: "#ABDC57",
    borderColor: "#ABDC57",
    borderBottomWidth: 2,
  },
  separator: {
    height: 2,
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
    alignSelf: "center",
    marginTop: "4%",
  },
  txtContenuDroiteAnnule: {
    color: "#F44336",
    textAlign: "right",
    fontFamily: "OnestBold",
    fontSize: 12,
    padding: "1.5%",
  },

  txtContenuDroite: {
    color: "#ABDC57",
    textAlign: "right",
    fontFamily: "OnestBold",
    fontSize: 12,
    padding: "1.5%",
  },
  txtDate: {
    color: "white",
    fontFamily: "OnestRegular",
    fontSize: 10,
  },
  titleContainer: {
    marginTop: "30%",
    width: "90%",
    alignSelf: "center",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    marginBottom: "7%",
    marginTop: "3%",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    borderRadius: 15,
  },
  validationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "4%",
    width: "90%",
    alignSelf: "center",
  },
  txtContenu: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 12,
    padding: "1.5%",
  },
  tout: {
    width: "20%",
    alignItems: "center",
  },
  txtTout: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 14,
  },
  txtTermine: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 14,
  },
  txtAnnule: {
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 14,
  },
  termine: {
    width: "20%",
    alignItems: "center",
  },
  annule: {
    width: "20%",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginTop: "5%",
    justifyContent: "space-around",
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
});

export default ValidationHistory;
