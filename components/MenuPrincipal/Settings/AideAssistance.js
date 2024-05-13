import {
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import * as Font from "expo-font";
  import { LinearGradient } from "expo-linear-gradient";
  import { FontAwesome } from "@expo/vector-icons";
  import global from "../../../assets/css/global";
  
  import bgImage from "../../../assets/images/bgImage.jpg";
  import BackNavs from "../../Navs/BackNavs";
  import { TouchableOpacity } from "react-native-gesture-handler";
  
  const AideAssistance = () => {
    const navigation = useNavigation();
  
    return (
      <ImageBackground source={bgImage} style={styles.pageContainer}>
        <BackNavs />
        <View style={styles.viewContainer}>
          <Text style={styles.textAide}>Aide et Assistance</Text>
          <View style={styles.viewMessage}>
            <Text style={styles.txtMessage}>Message</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="default"
              autoCapitalize="words"
              multiline={true}
              placeholder="Ecrivez ici..."
              maxLength={1000}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.warningContainer}>
            <FontAwesome
              name="warning"
              size={14}
              color="yellow"
              style={{ marginLeft: 8 }}
            />
            <Text style={styles.warningLabelText}>
              Pour une aide supplémentaire, veuiller contacter le numéro: XXX XX
              XXX XX
            </Text>
          </View>
          <TouchableOpacity>
            <LinearGradient
              colors={["#16daac", "#b6ea5c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonSubmit}
            >
              <Text style={styles.txtButton}>Envoyer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };
  
  export default AideAssistance;
  
  const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      resizeMode: "cover",
    },
    viewContainer: {
      height: "90%",
    },
    textAide: {
      color: "#B6EA5C",
      marginTop: "30%",
      textAlign: "center",
      fontFamily: "OnestBold",
      fontSize: 18,
    },
    viewMessage: {
      width: "85%",
      height: "30%",
      alignSelf: "center",
      marginTop: "10%",
    },
    buttonSubmit: {
      borderWidth: 0.2,
      borderColor: "white",
      marginTop: "8%",
      width: "85%",
      alignSelf: "center",
      height: "36%",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    txtButton: {
      fontFamily: "OnestBold",
      color: "black",
      fontSize: 16,
    },
    txtMessage: {
      color: "#B6EA5C",
      fontFamily: "OnestRegular",
      fontSize: 16,
      marginTop: "1.01%",
    },
    textInput: {
      width: "100%",
      borderWidth: 2,
      borderColor: "white",
      height: "80%",
      marginTop: "2%",
      borderRadius: 7,
      backgroundColor: "white",
      fontFamily: "OnestBold",
      padding: 5,
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
      alignSelf: "center",
    },
    warningLabelText: {
      fontFamily: "OnestBold",
      color: "#FFEE00",
      fontSize: 10,
      paddingRight: 12,
      marginLeft: 8,
      marginRight: 8,
    },
  });