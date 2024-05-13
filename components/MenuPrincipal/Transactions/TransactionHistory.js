import { View, Text, ScrollView, StyleSheet, ToastAndroid } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import { RefreshControl } from "react-native-gesture-handler";

import Axios from "axios";
import { BASE_URL } from "../../../config";

import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionHistory = () => {
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

  const [TransactionHistoryListe, setTransactionHistoryListe] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getTransactionHistory = async () => {
    const jwt_token = await AsyncStorage.getItem("jwt_token");

    if (jwt_token) {
      try {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, {
          token: jwt_token,
        });
        const apiUrl = `${BASE_URL}/transactionhistory`;
        const response = await Axios.get(apiUrl);

        const transHistory = response.data;

        const filteredTransactions = transHistory.filter(
          (transaction) => transaction.iduser === user.data.id
        );

        setTransactionHistoryListe(filteredTransactions);
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
      }
    } else {
      navigation.navigate("ConnectWallet");
      console.error("JWT introuvable dans l'Async Storage");
    }
  };

  useEffect(() => {
    getTransactionHistory();
  }, []);

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    ToastAndroid.show("Ordre copié !", ToastAndroid.SHORT);
  };

  // useEffect(() => {
  //   getTransactionHistory();
  //   const intervalId = setInterval(() => {
  //     getTransactionHistory();
  //   }, 4000);
  //   return () => clearInterval(intervalId);
  // }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getTransactionHistory();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  function formatNumber(number) {
    let thing = parseFloat(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    return thing.replace(/,/g, " ");
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {TransactionHistoryListe.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.typeCu,
                { color: item.type === "depot" ? "#FF0A0A" : "#16DAAC" },
              ]}
            >
              {item.type}
            </Text>
            <Text style={styles.textC}>{item.actif}</Text>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              {/* <Text style={styles.stat}>
                {item.stat}{" "}
                <Icon
                  style={styles.stat}
                  name="chevron-right"
                  size={20}
                  color="white"
                />
              </Text> */}
            </View>
            <Text style={styles.text}>
              <Text
                style={{
                  color:
                    item.validation === "validated"
                      ? "green"
                      : item.validation === "cancelled"
                      ? "red"
                      : item.validation === "pending"
                      ? "yellow"
                      : "black",
                }}
              >
                {item.validation}
              </Text>
            </Text>
          </View>

          <Text style={styles.text}>
            <Text style={styles.boldText}>Prix:</Text> {formatNumber(item.cours).replace('.00','')} Ariary
          </Text>
          <View style={styles.rowContainer}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Montant:</Text> {formatNumber(item.montant)} USDT
            </Text>
            <Text style={styles.dateText}>{formatDateTime(item.date)}</Text>
          </View>

          <View style={styles.orderContainer}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.boldText}>Ordre: {item.numeroordre}</Text>
              <View>
                <TouchableOpacity
                  onPress={() => copyToClipboard(item.numeroordre)}
                >
                  <Icon
                    style={styles.icon}
                    name="copy"
                    size={12}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.total}>Ar {formatNumber(item.montantmga).replace('.00','')} Ar</Text>
          </View>

          <View style={styles.separator}></View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    height: "76%",
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "white",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  itemContainer: {
    marginTop: "5%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  text: {
    fontSize: 12,
    paddingBottom: "2%",
    fontFamily: "OnestRegular",
    color: "white",
    padding: 1,
  },
  total: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "OnestBold",
    color: "white",
    padding: 1,
  },
  boldText: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "OnestBold",
    color: "white",
  },
  textC: {
    fontSize: 14,
    fontFamily: "MontserratBold",
    color: "white",
    padding: 2,
    marginRight: 10,
  },
  separator: {
    height: 3,
    backgroundColor: "white",
    marginTop: "5%",

    borderRadius: 10,
  },
  typeCu: {
    fontFamily: "MontserratSemi",
    padding: 2,
    fontSize: 14,
    marginRight: 10,
    marginBottom: 20,
  },
  stat: {
    fontFamily: "MontserratSemi",
    fontSize: 12,
    color: "white",
    padding: 5,
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginLeft: "20%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 11,
    fontFamily: "OnestRegular",
    color: "white",
    padding: 1,
    textAlign: "right",
  },
});

export default TransactionHistory;
