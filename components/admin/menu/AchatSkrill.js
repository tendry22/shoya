import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {useState, useEffect} from "react";
import Axios from 'axios';
import { BASE_URL } from '../../../config';

function formatNumber(number) {
  let thing = parseFloat(number)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  return thing.replace(/,/g, " ");
}

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

const data = [
  {
    id: 1,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 2,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 3,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 4,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 5,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 6,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 7,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 8,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 9,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
  {
    id: 10,
    date: "07/07/23 17:49:22",
    montant: "23,03 USD",
    idUtilisateur: "110110",
    cours: "Ar 4 434",
    prixAchat: "Ar 233 583",
  },
];

const AchatSkrill = () => {

  const [achatSkrillHistory, setAchatSkrillHistory] = useState([]);

  const getAchatSkrillHistory = async() => {
    
      try{

        const apiUrl = `${BASE_URL}/transactionhistory/filtered`;

        const response = await Axios.post(apiUrl, { type: 'retrait', portefeuille: 'skrill' });

        const achatUsdt = response.data;

        setAchatSkrillHistory(achatUsdt);

        // console.log('Réponse de l\'API :', userVerified);

      }catch(error){
        console.error('Erreur lors de la requête :', error);
      }
    
  }

  useEffect(() => {
    getAchatSkrillHistory();
  }, [])

  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>ID</Text>
          <Text style={styles.headerText}>Montant</Text>
          <Text style={styles.headerText}>Cours</Text>
          <Text style={styles.headerText}>Prix d'achat</Text>
          <Text style={styles.headerText}>Date</Text>
        </View>
        {achatSkrillHistory.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.cell}>{item.numeroordre}</Text>
            <Text style={styles.cell}>{item.montant} USD</Text>
            <Text style={styles.cell}>{formatNumber(item.cours).replace('.00','')} Ar</Text>
            <Text style={styles.cell}>{formatNumber(item.montantmga).replace('.00','')} Ar</Text>
            <Text style={styles.cell}>{item.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    backgroundColor: "#ABDC57",
    borderRadius: 2,
  },
  headerText: {
    fontFamily: "OnestBold",
    fontSize: 10,
    color: "black",
    flex: 1,
    textAlign: "center",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ABDC57",
  },
  cell: {
    fontFamily: "OnestBold",
    fontSize: 10,
    color: "white",
    flex: 1,
    textAlign: "center",
    padding: 5,
  },
});

export default AchatSkrill;
