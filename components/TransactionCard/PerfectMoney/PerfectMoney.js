import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { ImageBackground } from "react-native";
  import * as Font from "expo-font";
  import DepotPM from "./DepotPM";
  import RetraitPM from "./RetraitPM";
  import { FontAwesome } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import BackNavs from "../../Navs/BackNavs";
  
  const PerfectMoney = () => {
    const [boutonActif, setBoutonActif] = useState("Bouton 1");
    const [texteTitre, setTexteTitre] = useState("Dépôt PM");
  
    const navigation = useNavigation();
  
    const handleBoutonPress = (bouton) => {
      setBoutonActif(bouton);
      if (bouton === "Bouton 1") {
        setTexteTitre("Dépôt PM");
      } else if (bouton === "Bouton 2") {
        setTexteTitre("Retrait PM");
      }
    };
  
    const boutonStyle = {
      backgroundColor: "#16DAAC",
      paddingHorizontal: 45,
      paddingVertical: 20,
      borderRadius: 5,
    };
  
    const boutonActifStyle = {
      ...boutonStyle,
      borderColor: "white",
      borderWidth: 2,
    };
  
    const renderFormCard = () => {
      if (boutonActif === "Bouton 1") {
        return (
          <View style={styles.formCard}>
            <DepotPM />
          </View>
        );
      } else if (boutonActif === "Bouton 2") {
        return (
          <View style={styles.formCard}>
            <RetraitPM />
          </View>
        );
      }
      return null;
    };
  
    const [fontLoaded, setFontLoaded] = useState(false);
  
    useEffect(() => {
      const loadFont = async () => {
        await Font.loadAsync({
          PopppinsSemi: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
          OnestRegular: require("../../../assets/fonts/OnestRegular1602-hint.ttf"),
          OnestBold: require("../../../assets/fonts/OnestBold1602-hint.ttf"),
          OnestMedium: require("../../../assets/fonts/OnestMedium1602-hint.ttf"),
          MontserratBold: require("../../../assets/fonts/Montserrat-Bold.ttf"),
          MontserratSemi: require("../../../assets/fonts/Montserrat-SemiBold.ttf"),
        });
        setFontLoaded(true);
      };
  
      loadFont();
    }, []);
  
    if (!fontLoaded) {
      return null; // Afficher un écran de chargement ou une autre indication pendant le chargement de la police
    }
  
    return (
      <ImageBackground
        source={require("../../../assets/background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={{ alignSelf: "flex-start", marginTop: 13, marginLeft: 7 }}>
            <BackNavs />
          </View>
          <View style={styles.container}>
            <Text style={styles.texte}>{texteTitre}</Text>
            <View style={styles.boutonsContainer}>
              <TouchableOpacity
                style={[
                  boutonStyle,
                  boutonActif === "Bouton 1" ? boutonActifStyle : null,
                ]}
                onPress={() => handleBoutonPress("Bouton 1")}
              >
                <Text style={styles.boutonTexte}>Dépôt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  boutonStyle,
                  boutonActif === "Bouton 2" ? boutonActifStyle : null,
                ]}
                onPress={() => handleBoutonPress("Bouton 2")}
              >
                <Text style={styles.boutonTexte}>Retrait</Text>
              </TouchableOpacity>
            </View>
            {renderFormCard()}
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      marginTop: "30%",
      flex: 1,
      alignItems: "center",
    },
    scroll: {
      flexGrow: 1,
    },
    texte: {
      fontSize: 28,
      marginBottom: 25,
      fontFamily: "OnestBold",
      color: "white",
    },
    boutonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
    },
    boutonTexte: {
      color: "white",
      fontSize: 16,
      fontFamily: "OnestBold",
    },
    formCard: {
      backgroundColor: "",
      width: "100%",
      height: 300,
      padding: 20,
      borderRadius: 10,
      marginTop: 20,
    },
    retourButton: {
      position: "absolute",
      top: 30,
      right: 20,
      padding: 10,
    },
  });
  
  export default PerfectMoney;
  