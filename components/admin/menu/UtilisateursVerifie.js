import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";

import Axios from 'axios';
import { BASE_URL } from '../../../config';


const userInfo = [
  {
    id: 1,
    idUtilisateur: "211511",
    solde: "372,514.32",
    nom: "RAKOTONDRATSIORY",
    prenom: "Ambinintsoa Kevin Maria",
    email: "ambinintsoak@gmail.com",
    cin: "117 293 892 012",
    adresse: "Tanjombato Résidence Onisoa Tanjombato",
  },
  {
    id: 2,
    idUtilisateur: "211512",
    solde: "372,514.32",
    nom: "RAKOTO",
    prenom: "Maria",
    email: "rakotok@gmail.com",
    cin: "117 293 892 012",
    adresse: "Analamahitsy",
  },
  {
    id: 3,
    idUtilisateur: "211513",
    solde: "420,558.32",
    nom: "RAKOTONDRATSIORY",
    prenom: "Ambinintsoa Kevin Maria",
    email: "ambinintsoak@gmail.com",
    cin: "117 293 892 012",
    adresse: "Tanjombato Résidence Onisoa Tanjombato",
  },
  {
    id: 4,
    idUtilisateur: "211514",
    solde: "50,000.32",
    nom: "RAKOTONDRATSIORY",
    prenom: "Ambinintsoa Kevin Maria",
    email: "ambinintsoak@gmail.com",
    cin: "117 293 892 012",
    adresse: "Tanjombato Résidence Onisoa Tanjombato",
  },
  {
    id: 5,
    idUtilisateur: "211511",
    solde: "172,452.32",
    nom: "RAKOTONDRATSIORY",
    prenom: "Ambinintsoa Kevin Maria",
    email: "ambinintsoak@gmail.com",
    cin: "117 293 892 012",
    adresse: "Tanjombato Résidence Onisoa Tanjombato",
  },
];

const UtilisateursVerifie = () => {
  const [isCollapsed, setIsCollapsed] = useState(userInfo.map(() => true)); // tableau pour stocker l'état de chaque utilisateur

  const [userDataVerified, setUserDataVerified] = useState([]);

  const getUserVerified = async() => {
    
      try{

        const apiUrl = `${BASE_URL}/kyc/verified`;

        const response = await Axios.get(apiUrl);

        if(response.data.length === 0){
          ToastAndroid.show(
            "Aucun utilisateur",
            ToastAndroid.SHORT
          );
        }else{
          const userVerified = response.data;
          setUserDataVerified(userVerified);
           // console.log('Réponse de l\'API :', userVerified);
        }

       

      }catch(error){
        console.error('Erreur lors de la requête :', error);
      }
    
  }

  const handleSubmit = async (id) => {
    
    try{

      // console.log(id);
      const response = await Axios.post(`${BASE_URL}/api/changeStatut`, {id: id, statut: "non verifie"});

      if(response.data.success === 1) {
        ToastAndroid.show(
          "Changement effectué",
          ToastAndroid.SHORT
        );
      }

    }catch(error){
      console.log(error);
    }


  }

  useEffect(() => {
    getUserVerified();
  }, [])

  const toggleView = (index) => {
    const updatedCollapsed = [...isCollapsed]; // copie du tableau
    updatedCollapsed[index] = !updatedCollapsed[index]; // mise à jour de l'état pour l'utilisateur spécifique
    setIsCollapsed(updatedCollapsed);
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    ToastAndroid.show("ID de l'utilisateur copié !", ToastAndroid.SHORT);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {userDataVerified.map((item, index) => (
        <View style={styles.contenuContainer} key={item.id}>
          <TouchableOpacity onPress={() => toggleView(index)}>
            <View style={styles.contentContainer}>
              <View style={styles.icoTxt}>
                <TouchableOpacity
                  onPress={() => copyToClipboard(item.idUser)}
                >
                  <Icon name="copy" size={14} color="white" />
                </TouchableOpacity>
                <Text style={styles.idU}>{item.user_reference}</Text>
              </View>
              <Text style={styles.solde}></Text>
              <TouchableOpacity onPress={() => handleSubmit(item.kyc.id)} >
                <View style={styles.transactionButton}>
                  <Text style={styles.transactionText}>Modifier</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {isCollapsed[index] ? null : (
            <View style={styles.info}>
              <Text style={styles.infoText}>Nom: {item.kyc.nom}</Text>
              <Text style={styles.infoText}>Prénom: {item.kyc.prenom}</Text>
              <Text style={styles.infoText}>Email: {item.email}</Text>
              <Text style={styles.infoText}>CIN: {item.kyc.cin}</Text>
              <Text style={styles.infoText}>Adresse: {item.kyc.adresse}</Text>
              <TouchableOpacity>
                <View style={styles.modifBtn}>
                  <Text style={styles.modifText}>Transaction</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    marginRight: "5%",
    marginLeft: "5%",
  },
  modifBtn: {
    backgroundColor: "#00FFA8",
    borderRadius: 10,
    padding: "2%",
    width: "30%",
    marginTop: "4%",
    alignSelf: "flex-end",
  },
  modifText: {
    color: "black",
    fontSize: 14,
    fontFamily: "OnestBold",
    textAlign: "center",
  },
  info: {
    marginTop: "5%",
  },
  infoText: {
    color: "white",
    padding: "0.5%",
    fontFamily: "OnestRegular",
    fontSize: 12,
  },
  contenuContainer: {
    flexDirection: "column",
  },
  icoTxt: {
    flexDirection: "row",
  },
  transactionButton: {
    backgroundColor: "#FFEE00",
    borderRadius: 10,
    padding: "2%",
  },
  transactionText: {
    color: "black",
    fontSize: 14,
    fontFamily: "OnestBold",
    textAlign: "center",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "7%",
  },
  idU: {
    color: "white",
    paddingLeft: "2%",
    fontFamily: "OnestBold",
    fontSize: 14,
  },
  solde: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 14,
  },
  separator: {
    height: 2,
    backgroundColor: "white",
    marginTop: "5%",
    borderRadius: 30,
  },
});

export default UtilisateursVerifie;
