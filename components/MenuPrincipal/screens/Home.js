import { View, Text, StyleSheet, ImageBackground } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import global from "../../../assets/css/global";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import ScrollCard from "../Transactions/ScrollCard";
import TransactionHistory from "../Transactions/TransactionHistory";

import ProfileNav from "../../Navs/ProfileNav";
import Axios from 'axios';
import { BASE_URL } from '../../../config';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";

const Home = () => {
  const navigation = useNavigation();

  const [showBalance, setShowBalance] = React.useState(false);
  const [soldeUser, setSoldeUser] = useState('');

  const toggleBalance = () => {
    getSolde();
    setShowBalance(!showBalance);
  };

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
    const backAction = () => {
      if (navigation.isFocused()) {
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    getSolde();
  },[]);

  useEffect(() => {
    getSolde();
  }, [soldeUser])

  function formatNumber(number) {
    let thing = parseFloat(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return thing.replace(',',' ');
  }


  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.viewCover}>
        {/* -- Charger le nav -- */}
        <ProfileNav />
        {/* -------------------- */}
        <LinearGradient
          colors={["#16DAAC", "#B6EA5C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewSolde}
        >
          <TouchableOpacity
            onPress={toggleBalance}
            style={styles.iconContainer}
          >
            <Feather
              name={showBalance ? "eye-off" : "eye"}
              size={25}
              color={"black"}
            />
          </TouchableOpacity>
          <View style={styles.balanceTextContainer}>
            <Text style={styles.balanceText}>
            {showBalance ? `${formatNumber(soldeUser).replace(',',' ').replace('.00','')} Ariary` : "Afficher le solde"}
            </Text>
          </View>
        </LinearGradient>
        <ScrollCard />
        <Text style={styles.transactionHistoryText}>
          Historique des transactions
        </Text>
        <View style={styles.transactionHistory}>
          <TransactionHistory />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  viewCover: {
    height: "90%",
  },
  viewSolde: {
    width: "95%",
    height: "13%",
    borderWidth: 0.5,
    borderColor: "whitesmoke",
    alignSelf: "center",
    marginTop: "4%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center", // Pour centrer horizontalement
    alignItems: "center", // Pour centrer verticalement
  },
  scrollCard: {
    width: "95%",
    height: "10%",
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
    marginTop: "2%",
  },
  transactionHistoryText: {
    fontFamily: "OnestBold",
    color: "whitesmoke",
    fontSize: 14,
    width: "95%",
    alignSelf: "center",
    marginTop: "4%",
  },
  transactionHistory: {
    borderWidth: 0.5,
    borderColor: "white",
    flex: 1,
    width: "95%",
    alignSelf: "center",
    marginTop: "1%",
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    borderRadius: 15,
  },
  balanceText: {
    fontFamily: "PoppinsSemi",
    marginLeft: "4%",
    fontSize: 16,
  },
});
