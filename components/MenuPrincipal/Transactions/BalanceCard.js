import * as React from "react";
import { useEffect, useState } from "react";
import { Card, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import Axios from 'axios';
import { BASE_URL } from '../../config';

import AsyncStorage from "@react-native-async-storage/async-storage";

function BalanceCard() {
  const [showBalance, setShowBalance] = React.useState(false);
  const [soldeUser, setSoldeUser] = useState('');

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };
  const [fontLoaded, setFontLoaded] = useState(false);

  const getSolde = async() => {
    const jwt_token = await AsyncStorage.getItem("jwt_token");

    if(jwt_token){
      try{

        const apiUrl = `${BASE_URL}/soldeuser`;
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, {token: jwt_token});

        const response = await Axios.get(apiUrl, { iduser: user });

        const filteredData = response.data.filter(item => item.iduser === user.data.id);

        const soldeUser = filteredData[0].solde;

        setSoldeUser(soldeUser);
      }catch(error){
        console.error('Erreur lors de la requête :', error);
      }
    }else{
      navigation.navigate("ConnectWallet");
      console.error('JWT introuvable dans l\'Async Storage');
    }
  }

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        PopppinsSemi: require("../../assets/fonts/Poppins-SemiBold.ttf"),
        OnestRegular: require("../../assets/fonts/OnestRegular1602-hint.ttf"),
        OnestBold: require("../../assets/fonts/OnestBold1602-hint.ttf"),
        OnestMedium: require("../../assets/fonts/OnestMedium1602-hint.ttf"),
        MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
        MontserratSemi: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
      });
      setFontLoaded(true);
    };

    getSolde();
    loadFont();
  }, []);

  useEffect(() => {
    getSolde();
  }, [soldeUser])

  if (!fontLoaded) {
    return null; // Afficher un écran de chargement ou une autre indication pendant le chargement de la police
  }
  return (
    <LinearGradient
      colors={["#16DAAC", "#B6EA5C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        width: "90%",
        height: 90,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "gray",
        borderRadius: 15,
        padding: 8,
        backgroundColor: "lightgray",
      }}
    >
      <TouchableOpacity onPress={toggleBalance} style={{ marginLeft: "22%" }}>
        <Ionicons
          name={showBalance ? "eye-off" : "eye"}
          size={25}
          color="black"
        />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 10,
          textAlign: "center",
          fontFamily: "PopppinsSemi",
          fontSize: 18,
          marginTop: "1%",
        }}
      >
        {showBalance ? `${soldeUser.toLocaleString()} Ariary` : "Afficher le solde"}
      </Text>
    </LinearGradient>
  );
}

export default BalanceCard;