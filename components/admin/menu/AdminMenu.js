import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import CompteAdminNavs from "../navs/CompteAdminNavs";
import IconEntypo from "react-native-vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {useState, useEffect} from "react";
import Axios from 'axios';
import { BASE_URL } from '../../../config';

const AdminMenu = () => {
  const navigation = useNavigation();

  const handleRectClick = (rectNumber) => {
    if (rectNumber === 1) {
      navigation.navigate("Solde");
    }
    if (rectNumber === 2) {
      navigation.navigate("Utilisateurs");
    }
    if (rectNumber === 3) {
      navigation.navigate("Cours");
    }
    if (rectNumber === 4) {
      navigation.navigate("Transaction");
    }
    if (rectNumber === 5) {
      navigation.navigate("Bilan");
    }
    if (rectNumber === 6) {
      navigation.navigate("Airtm");
    }
    if (rectNumber === 7) {
      navigation.navigate("Skrill");
    }
    if (rectNumber === 8) {
      navigation.navigate("Connexion");
    }
  };

  return (
    <ScrollView>
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <CompteAdminNavs />

      <View style={styles.deviseContainer}>
        <TouchableOpacity onPress={() => handleRectClick(1)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/portefeuille.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Solde</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(2)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/utilisateur.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Utilisateurs</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(3)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/bon-taux-de-conversion.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Cours de change</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(4)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/archiver.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Transactions</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(5)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/bilan-de-sante.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Bilan</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(6)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/jaccepte.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Validation Airtm</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(7)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/jaccepte.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Validation Skrill</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRectClick(8)}>
          <LinearGradient
            colors={["rgba(22, 218, 172, 1)", "rgba(182, 234, 92, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Image
                source={require("../../../assets/Glyphicon/jaccepte.png")}
                style={{ height: 18, width: 18, marginLeft: 15 }}
              />
              <Text style={styles.cardText}>Deconnexion</Text>
            </View>
            <View style={styles.cardContentDroite}>
              <IconEntypo name="chevron-right" size={25} color={"white"} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  Operateurcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "30%",
    width: "90%",
    height: "12%",
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: 62.5,
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#85FFDE",
  },
  cardPM: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#FF8585",
  },
  cardPayeer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#8589FF",
  },
  cardSkrill: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#C685FF",
  },
  cardAirtm: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "blue",
    height: "15.5%",
    marginTop: "5%",
    borderWidth: 0.2,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#EAEAEE",
  },
  cardContent: {
    flexDirection: "row",
  },
  cardContentDroite: {
    flexDirection: "row",
    marginRight: "2%",
  },
  cardText: {
    marginLeft: 12,
    fontFamily: "OnestBold",
    color: "white",
    fontSize: 16,
  },
  cardTextDroite: {
    marginRight: "8%",
    fontFamily: "OnestBold",
    fontSize: 15,
  },
  mvola: {
    flexDirection: "column",
    borderWidth: 0.2,
    borderColor: "#ccc",
    width: "45%",
    backgroundColor: "#BAFF85",
    borderRadius: 5,
    alignItems: "center",
  },
  orangeMoney: {
    flexDirection: "column",
    borderWidth: 0.2,
    borderColor: "#ccc",
    width: "45%",
    borderRadius: 5,
    backgroundColor: "#FCCC83",
    alignItems: "center",
  },
  txtOp: {
    fontFamily: "OnestRegular",
    textAlign: "center",
    paddingRight: 3,
    paddingLeft: 3,
    fontSize: 13,
  },
  txt: {
    fontFamily: "OnestBold",
    textAlign: "center",
    padding: 2,
    fontSize: 13,
  },
  deviseContainer: {
    width: "90%",
    flex: 1,
    marginBottom: "7%",
    marginTop: "30%",
    alignSelf: "center",
  },
});
export default AdminMenu;
