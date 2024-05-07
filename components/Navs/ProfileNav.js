import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Axios from "axios";
import { BASE_URL } from "../../config";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileNav = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const jwt_token = await AsyncStorage.getItem("jwt_token");

      if (jwt_token) {
        try {
          const user = await Axios.post(`${BASE_URL}/users/validate-token`, {
            token: jwt_token,
          });
          setUser(user.data);
        } catch (error) {
          console.error("Erreur lors de la requête :", error);
        }
      } else {
        navigation.navigate("ConnectWallet");
        console.error("JWT introuvable dans l'Async Storage");
      }
    };

    const intervalId = setInterval(() => {
      getUser();
    }, 4000);

    // Appeler getUser une fois au montage et le déclencher également avec l'intervalle
    getUser();

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []); // Utiliser une seule fois useEffect ici

  return (
    <View style={styles.navsView}>
      <View style={{ justifyContent: "center" }}>
        <View style={styles.navCompte}>
          {user && user.validation ? (
            <>
              <Feather name="user-check" size={30} color={"#B6EA5C"} />
              <View style={styles.textContainer}>
                <Text style={styles.monCompteText}>Bienvenue !</Text>
                <Text style={styles.nomCompte}>{user.email}</Text>
              </View>
            </>
          ) : (
            <>
              <Feather name="user-x" size={30} color={"#FF0A0A"} />
              <View style={styles.textContainer}>
                <Text style={styles.monCompteText}>Bienvenue !</Text>
                <Text style={styles.nomCompte}>
                  {user ? user.email : "Utilisateur"}
                </Text>
                <Text style={styles.nomCompteNonVerifie}>
                  Compte non vérifié
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={{ justifyContent: "center" }}>
        <TouchableOpacity>
          <View style={styles.notifIcon}>
            <MaterialIcons
              name="circle-notifications"
              size={30}
              color={"whitesmoke"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileNav;

const styles = StyleSheet.create({
  viewCover: {
    borderWidth: 2,
    borderColor: "white",
    height: "100%",
  },
  navsView: {
    height: "7%",
    marginTop: "8%",
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monCompteText: {
    fontFamily: "OnestBold",
    color: "whitesmoke",
    fontSize: 14,
  },
  nomCompte: {
    fontFamily: "OnestRegular",
    color: "#B6EA5C",
    fontSize: 12,
  },
  nomCompteNonVerifie: {
    fontFamily: "OnestRegular",
    color: "#FF0A0A",
    fontSize: 12,
  },
  navCompte: {
    flexDirection: "row",
  },
  textContainer: {
    marginLeft: "4%",
  },
  notifIcon: {},
});
