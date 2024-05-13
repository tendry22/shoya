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
  Button
} from "react-native";
import CompteAdminNavs from "../navs/CompteAdminNavs";
import Icon from "react-native-vector-icons/Ionicons";
import IconOct from "react-native-vector-icons/Octicons";

import Axios from 'axios';
import { BASE_URL } from "../../../config";
import { useNavigation } from "@react-navigation/native";
import { ToastAndroid } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ajout de l'import AsyncStorage
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from "expo-local-authentication";
import { schedulePushNotification, sendPushNotification } from '../notificationsUtils';
import { getExpoPushTokenAsync } from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const AdminSkrill = () => {
  const navigation = useNavigation();
  
  const [listeAirtm, setListeAirtm] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const projectId = 'da434518-0960-451b-834b-0a20a9ec1e31'; // Votre projet ID
        const token = (await getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token);
        await AsyncStorage.setItem('adminExpoToken', token);
        console.log('Jeton Expo de l\'administrateur stocké avec succès.');
  
        //await sendPushNotification(token, 'Skrill :Aucun Transaction', 'Personne n`a fait de transaction Skrill');
      } catch (error) {
        console.error('Erreur lors du stockage du jeton Expo de l\'administrateur :', error);
      }
    })();
  }, []);

  const handleSubmit = async (idtransaction) => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        const apiUrl = `${BASE_URL}/skrill/validation`;
        const response = await Axios.post(apiUrl, { idskrilltransaction: idtransaction });
        if(response.data.messageresult == 'transaction skrill validee'){
          navigation.navigate("ValidationHistorySkrill");
        }
        else{
          ToastAndroid.show(
            response.data.messageresult,
            ToastAndroid.SHORT
          );
        }
      }
      else{
        ToastAndroid.show(
          "Erreur lors de l'authentification",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  };

  const handleSubmitCancel = async (idtransaction) => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        const apiUrl = `${BASE_URL}/skrill/cancel`;
        const response = await Axios.post(apiUrl, { idskrilltransaction: idtransaction });
        if(response.data.messageresult == 'transaction skrill refusee'){
          navigation.navigate("ValidationHistorySkrill");
        }
        else{
          ToastAndroid.show(
            'Il y a une erreur',
            ToastAndroid.SHORT
          );
        }
      }
      else{
        ToastAndroid.show(
          "Erreur lors de l'authentification",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  };

  useEffect(() => {
    const fetchAirtm = async () => {
      try {
        const response = await Axios.get(`${BASE_URL}/skrill/pending`);
        const newData = response.data;
        
        // Vérifier si de nouvelles données sont disponibles
        if (!areArraysEqual(newData, listeAirtm)) {
          setListeAirtm(newData);
          
          // Effectuer d'autres actions si nécessaire
          const adminExpoToken = await AsyncStorage.getItem('adminExpoToken');
          if (adminExpoToken) {
            //await sendPushNotification(adminExpoToken, "Une transaction en attente", "Une transaction est en attente de validation.");
            await schedulePushNotification({
              adminExpoToken,
              title: "Skrill :Une transaction en attente",
              body: `Une transaction est en attente de validation Skrill.`,
              data: { type: 'transaction'},
            }, { seconds: 1 });
          } else {
            console.error('Jeton Expo de l\'administrateur non trouvé ou invalide.');
          }
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
  
    fetchAirtm();
    const intervalId = setInterval(fetchAirtm, 15000);

    return () => clearInterval(intervalId);
  }, []); 
  const areArraysEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }
  
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
  
    return true;
  };
  

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <CompteAdminNavs />
      <TouchableOpacity
        style={styles.retourButton}
        onPress={() => {
          navigation.navigate("ValidationHistorySkrill");
        }}
      >
        <IconOct name="history" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Validation Skrill</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {listeAirtm.map((item) => (
          <View style={styles.contenuContainer} key={item.id}>
            <View style={styles.contentContainer}>
              <Text style={styles.idU}>{item.numeroordre}</Text>
              <Text style={styles.idU}>{item.userReference}</Text>
              {/* <Text style={styles.idU}>{item.date}</Text> */}
              <Text style={styles.solde}>{item.cours} Ar</Text>
              <Text style={styles.solde}>{item.montant} USD</Text>
              <TouchableOpacity onPress={() => handleSubmit(item.id)}>
                <View style={styles.transactionButton}>
                  <Text style={styles.transactionText}>Valider</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSubmitCancel(item.id)}>
                <Icon name="close-circle" size={16} color="#F44336" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: "30%",
    width: "90%",
    alignSelf: "center",
  },
  retourButton: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
  scrollContainer: {
    flexGrow: 1,
    marginRight: "5%",
    marginLeft: "5%",
    marginBottom: "7%",
    marginTop: "5%",
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
    fontSize: 12,
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
    fontFamily: "OnestBold",
    fontSize: 11,
  },
  solde: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 11,
  },
  separator: {
    height: 2,
    backgroundColor: "white",
    marginTop: "5%",
    borderRadius: 30,
  },
});

export default AdminSkrill;
