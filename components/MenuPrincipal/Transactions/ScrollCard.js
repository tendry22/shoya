import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Axios from "axios";
import { BASE_URL } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ScrollCard({ logo, balance1, balance2 }) {
  const [coursData, setCoursData] = useState([]); // État pour stocker les données de la requête Axios
  const [dataCard, setDataCard] = useState([]); // État pour stocker dataCard

  const [fontLoaded, setFontLoaded] = useState(false);

  const [disable, setDisable] = useState(false);

  const navigation = useNavigation();

  const [iduser, setIdUser] = useState(0);

  function formatNumber(number) {
    let thing = parseFloat(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    return thing.replace(/,/g, " ");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt_token = await AsyncStorage.getItem("jwt_token");

        if (jwt_token) {
          const userResponse = await Axios.post(
            `${BASE_URL}/users/validate-token`,
            { token: jwt_token }
          );
          const user = userResponse.data;
          setIdUser(user.id);
          if (user.validation) {
            setDisable(true);
          }
          const listeResponse = await Axios.get(`${BASE_URL}/cours`);

          listeResponse.data.forEach((item, index) => {
            switch (index) {
              case 0:
                item.image = require("../../../assets/tether-seeklogo.com.png");
                break;
              case 4:
                item.image = require("../../../assets/surface1.png");
                break;
              case 1:
                item.image = require("../../../assets/logo2.png");
                break;
              case 2:
                item.image = require("../../../assets/skrill.png");
                break;
              case 3:
                item.image = require("../../../assets/airtm.png");
                break;
              default:
                break;
            }
          });
          setDataCard(listeResponse.data);
        } else {
          navigation.navigate("ConnectWallet");
          console.error("JWT introuvable dans l'Async Storage");
        }
      } catch (error) {
        console.error(
          "Une erreur est survenue lors de la récupération des données :",
          error
        );
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  const navigateToScreen = async (id) => {
    console.log(disable);
    if (!disable) {
      ToastAndroid.show("Vous n'etes pas encore verifiee", ToastAndroid.SHORT);
    } else {
      if (id === 1) {
        navigation.navigate("Tether");
      }
      if (id === 5) {
        navigation.navigate("PerfectMoney");
      }
      if (id === 2) {
        navigation.navigate("Payeer");
      }
      if (id === 3) {
        const id = await AsyncStorage.getItem("idskrill");
        if (id) {
          const response = await Axios.get(`${BASE_URL}/skrill/${id}`);
          if (response.data.validation == "pending") {
            const montant = await AsyncStorage.getItem("montantskrill");
            navigation.navigate("ValidationSkrill", { id, montant });
          } else {
            await AsyncStorage.removeItem("idskrill");
            await AsyncStorage.removeItem("montantskrill");
            await AsyncStorage.removeItem("timeskrill");
            navigation.navigate("Skrill");
          }
        } else {
          navigation.navigate("Skrill");
        }
      }
      if (id === 4) {
        const id = await AsyncStorage.getItem("idairtm");
        if (id) {
          const response = await Axios.get(`${BASE_URL}/airtm/${id}`);
          if (response.data.validation == "pending") {
            const montant = await AsyncStorage.getItem("montantairtm");
            navigation.navigate("ValidationAirtm", { id, montant });
          } else {
            await AsyncStorage.removeItem("idairtm");
            await AsyncStorage.removeItem("montantairtm");
            await AsyncStorage.removeItem("timeairtm");
            navigation.navigate("Airtm");
          }
        } else {
          navigation.navigate("Airtm");
        }
      }
    }
  };

  return (
    <View style={crdstyles.container}>
      <FlatList
        data={dataCard}
        style={{ height: "9%" }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToScreen(item.id)}>
            <View style={crdstyles.card}>
              <View style={crdstyles.balanceContainer}>
                {item.actif === "skrill" || item.actif === "airtm" ? (
                  <Text style={[crdstyles.balance2, { color: "#16DAAC" }]}>
                    {formatNumber(item.retrait).replace(".00", "")} Ar
                  </Text>
                ) : (
                  <>
                    <Text style={crdstyles.balance1}>
                      {formatNumber(item.retrait).replace(".00", "")} Ar
                    </Text>
                    <Text style={crdstyles.balance2}>
                      {formatNumber(item.depot).replace(".00", "")} Ar
                    </Text>
                  </>
                )}
              </View>
              <View style={crdstyles.logoContain}>
                <Image source={item.image} style={crdstyles.logo} />
              </View>
            </View>
          </TouchableOpacity>
        )}
        horizontal
      />
    </View>
  );
}
const crdstyles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
    marginTop: "2%",
  },
  card: {
    height: "100%",
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  balanceContainer: {
    flex: 1,
  },
  balance1: {
    fontSize: 12,
    marginBottom: 5,
    color: "#16DAAC",
    fontFamily: "OnestBold",
  },
  balance2: {
    fontSize: 12,
    marginBottom: 5,
    color: "#DA1616",
    fontFamily: "OnestBold",
  },
  logo: {
    width: 35,
    height: 35,
  },
  logoContain: {
    marginLeft: 10,
  },
});

export default ScrollCard;
