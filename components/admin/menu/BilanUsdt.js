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
  Button,
} from "react-native";

const BilanUsdt = () => {
  return (
    <View style={styles.container}>
      <View style={styles.benefice}>
        <Text style={styles.titleContent}>Bénéfice</Text>
        <View style={styles.beneficeGauche}>
          <View style={{ marginLeft: "5%" }}>
            <Text style={styles.txtBenef}>PNL Réalisé </Text>
            <Text style={styles.txtBenef}>Nombre de Trade </Text>
            <Text style={styles.txtBenef}>Par USDT </Text>
          </View>
          <View style={{ marginRight: "5%" }}>
            <Text style={styles.txtBenefDroite}>Ar 20 000 000</Text>
            <Text style={styles.txtBenefDroite}>2400</Text>
            <Text style={styles.txtBenefDroite}>Ar 200</Text>
          </View>
        </View>
      </View>
      <View style={styles.achat}>
        <Text style={styles.titleContent}>Achat</Text>
        <View style={styles.beneficeGauche}>
          <View style={{ marginLeft: "5%" }}>
            <Text style={styles.txtBenef}>Quantité</Text>
            <Text style={styles.txtBenef}>Total acheté</Text>
            <Text style={styles.txtBenef}>Nombre de Trade</Text>
          </View>
          <View style={{ marginRight: "5%" }}>
            <Text style={styles.txtBenefDroite}>$ 100 000.00</Text>
            <Text style={styles.txtBenefDroite}>Ar 450 000 000</Text>
            <Text style={styles.txtBenefDroite}>1 000</Text>
          </View>
        </View>
      </View>
      <View style={styles.vente}>
        <Text style={styles.titleContent}>Vente</Text>
        <View style={styles.beneficeGauche}>
          <View style={{ marginLeft: "5%" }}>
            <Text style={styles.txtBenef}>Quantité</Text>
            <Text style={styles.txtBenef}>Total vendu</Text>
            <Text style={styles.txtBenef}>Nombre de trade</Text>
          </View>
          <View style={{ marginRight: "5%" }}>
            <Text style={styles.txtBenefDroite}>$ 100 000.00</Text>
            <Text style={styles.txtBenefDroite}>Ar 470 000 000</Text>
            <Text style={styles.txtBenefDroite}>1 400</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: "30%",
    width: "90%",
    alignSelf: "center",
  },
  txtCard: {
    fontFamily: "OnestBold",
    fontSize: 14,
  },
  renderCard: {
    backgroundColor: "rgba(24, 21, 38, 0.8)",
    marginTop: "5%",
    flex: 1,
    borderRadius: 10,
  },
  titleContent: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "OnestBold",
    color: "#ABDC57",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
    width: "90%",
    alignSelf: "center",
    height: "6%",
  },
  container: {
    width: "90%",
    flex: 1,
    alignSelf: "center",
    marginBottom: "7%",
    marginTop: "4%",
  },
  benefice: {
    height: "33%",
    justifyContent: "center",
  },
  vente: {
    height: "33%",
    justifyContent: "center",
  },
  achat: {
    height: "33%",
    justifyContent: "center",
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
  beneficeGauche: {
    flexDirection: "row",
    backgroundColor: "rgba(24, 21, 30, 1)",
    borderRadius: 10,
    width: "70%",
    alignSelf: "center",
    justifyContent: "space-between",
    height: "50%",
    alignItems: "center",
    marginTop: "2%",
  },
  txtBenef: {
    color: "white",
    paddingBottom: "2%",
    fontFamily: "OnestBold",
    fontSize: 12,
  },
  txtBenefDroite: {
    color: "#ccc",
    paddingBottom: "2%",
    textAlign: "right",
    fontFamily: "OnestRegular",
    fontSize: 12,
  },
});

export default BilanUsdt;
