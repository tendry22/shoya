import React, { useState, useEffect } from "react";
import { ImageBackground, View, TouchableOpacity, StyleSheet, Text, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from 'axios';
import { BASE_URL } from '../../../config';
import * as Notifications from 'expo-notifications';
import BackNavs from "../../Navs/BackNavs";
import { schedulePushNotification, sendPushNotification } from './notificationsUtils';
import { getExpoPushTokenAsync } from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const ConfirmRetraitSkrill = ({ route }) => {
  const { montant } = route.params;
  const navigation = useNavigation();

  const adresseShoya = process.env.EXPO_PUBLIC_SHOYA_ADRESS_SKRILL;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const projectId = 'da434518-0960-451b-834b-0a20a9ec1e31'; // Votre projet ID
        const token = (await getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token);
        await AsyncStorage.setItem('adminExpoToken', token);
        console.log('Jeton Expo de l\'administrateur stocké avec succès.');
  
        await sendPushNotification(token, 'Une transaction en attente', 'Une transaction est en attente de validation.');
      } catch (error) {
        console.error('Erreur lors du stockage du jeton Expo de l\'administrateur :', error);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    try {
      let date = new Date();
      date.setHours(20);
      date.setMinutes(49);

      if (currentTime > date) {
        ToastAndroid.show(
          'Notre temps de service est fini pour aujourd\'hui, revenez demain',
          ToastAndroid.SHORT
        );
      } else {
        const jwt_token = await AsyncStorage.getItem("jwt_token");
        if (jwt_token) {
          const user = await Axios.post(`${BASE_URL}/users/validate-token`, { token: jwt_token });
          const apiUrl = `${BASE_URL}/skrill/retrait`;
          const response = await Axios.post(apiUrl, { iduser: user.data.id, montant: montant });
          const id = response.data.id;
          await AsyncStorage.setItem("idskrill", id + '');
          await AsyncStorage.setItem("montantskrill", montant + '');
          await AsyncStorage.setItem("timeskrill", new Date() + '');
          if (response.data.messageresult == 'transaction skrill effectue, en attente de validation') {
            navigation.navigate("ValidationSkrill", { montant, id });
            await schedulePushNotification({
              title: "Transaction en cours !",
              body: `Votre transaction de ${montant} USD a été en cours de vérification.`,
              data: { type: 'transaction', montant: montant },
            }, { seconds: 2 });
            const adminExpoToken = await AsyncStorage.getItem('adminExpoToken');
            if (adminExpoToken) {
              await sendPushNotification(adminExpoToken, "Une transaction en attente", "Une transaction est en attente de validation.");
            } else {
              console.error('Jeton Expo de l\'administrateur non trouvé ou invalide.');
            }
          } else {
            ToastAndroid.show(
              response.data.messageresult,
              ToastAndroid.SHORT
            );
          }
        } else {
          navigation.navigate("ConnectWallet");
        }
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ alignSelf: "flex-start", marginTop: 13, marginLeft: 7 }}>
        <BackNavs />
      </View>
      <View style={styles.container}>
        <Text style={styles.texte}>
          Confirmez que toutes les informations ci-dessous correspondent au
          transfert effectué
        </Text>
        <Text style={styles.texte1}>Retrait de: </Text>
        <View style={styles.amountContainer}>
          <Text style={styles.montant}>{montant} USD</Text>
        </View>
        <View style={styles.minMaxContainer}>
          <View>
            <Text style={styles.minMaxLabelText}>E-mail du portefeuille</Text>
            <Text style={styles.minMaxLabelText}>Code de référence</Text>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxLabelText}>Actif</Text>
              <Text style={styles.minMaxLabelText}>Montant</Text>
              <Text style={styles.minMaxLabelText}>
                Montant Total en Ariary
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.minMaxValueText}>Ambinintsoak@gmail.com</Text>
              <Text style={styles.minMaxValueText}>
                {adresseShoya}
              </Text>
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text style={styles.minMaxValueText}>USD</Text>
              <Text style={styles.minMaxValueText}>{montant} USD</Text>
              <Text style={styles.minMaxValueText}>
                {(montant * 4600).toLocaleString()} Ariary
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.warningContainer}>
          <FontAwesome
            name="warning"
            size={14}
            color="yellow"
            style={{ marginLeft: 8 }}
          />
          <Text style={styles.warningLabelText}>
            Vérifier que tout est correct. Les transactions ne peuvent pas être
            annulées
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "30%",
    flex: 1,
    alignItems: "center",
  },
  texte: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: "OnestBold",
    color: "white",
    textAlign: "center",
    width: "80%",
  },
  texte1: {
    fontSize: 14,
    fontFamily: "OnestRegular",
    color: "white",
  },
  montant: {
    fontSize: 40,
    fontFamily: "OnestBold",
    color: "white",
    padding: 10,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  minMaxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "80%",
    height: 180,
    marginTop: 10,
    borderColor: "gray",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "rgba(109, 117, 136, 0.5)",
  },
  warningContainer: {
    marginTop: 15,
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 238, 00, 0.4)",
  },
  minMaxLabelText: {
    textAlign: "left",
    fontFamily: "OnestRegular",
    color: "#ccc",
    fontSize: 10,
    padding: 5,
  },
  warningLabelText: {
    fontFamily: "OnestBold",
    color: "#FFEE00",
    fontSize: 10,
    paddingRight: 12,
    marginLeft: 8,
    marginRight: 8,
  },
  minMaxValueText: {
    textAlign: "right",
    fontFamily: "OnestRegular",
    color: "white",
    fontSize: 10,
    padding: 5,
  },
  button: {
    backgroundColor: "#FFEE00",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "80%",
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontFamily: "OnestBold",
  },
});

export default ConfirmRetraitSkrill;
