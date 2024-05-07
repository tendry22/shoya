import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    ToastAndroid,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import * as Font from "expo-font";
  import { LinearGradient } from "expo-linear-gradient";
  
  import global from "../../../assets/css/global";
    import bgImage from "../../../assets/images/bgImage.jpg";
    import BackNavs from "../../Navs/BackNavs";
    import Axios from 'axios';
    import { BASE_URL } from "../../../config";
    import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const Identity = () => {
    const navigation = useNavigation();
  
    const [fontLoaded, setFontLoaded] = useState(false);
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [cin, setCin] = useState("");
    const [adresse, setAdresse] = useState("");
    const [parrinage, setParrinage] = useState("");
  
    const handleNomChange = (text) => {
      setNom(text);
    };
    const handlePrenomChange = (text) => {
      setPrenom(text);
    };
    const handleCinhange = (text) => {
      setCin(text);
    };
    const handleAdresseChange = (text) => {
      setAdresse(text);
    };
    const handleParrinageChange = (text) => {
      setParrinage(text);
    };
  
    const SendKYC = async (nom, prenom, cin, adresse, parrinage) => {
      const jwt_token = await AsyncStorage.getItem("jwt_token");
      if (jwt_token) {
        const user = await Axios.post(`${BASE_URL}/users/validate-token`, {token: jwt_token});
        try {
          
          const apiUrl = `${BASE_URL}/kyc`;
  
          const config = {
            headers: {
              Authorization: `Bearer ${jwt_token}`
            }
          };
  
          if(parrinage != ""){
            const valideurl= `${BASE_URL}/affiliation/validite-parrinage`;
            const responsevalideurl = await Axios.post(valideurl, { parrinage: parrinage });  
            if(responsevalideurl.data.message){
              const response = await Axios.post(apiUrl, {iduser:user.data.id, nom: nom, prenom: prenom, cin_passeport: cin, adresse:adresse, statut: 'non verifie'} ,config);
              if(response.data.message == 'KYC créée avec succès') {
                const parinageurl = `${BASE_URL}/affiliation`;
                  const responseparrinage = await Axios.post(parinageurl, { parrinage: parrinage, iduserparrinee:user.data.id,  });  
                  console.log(responseparrinage.data.message);
                  if(responseparrinage.data.message == '- affiliation ajoutee avec succes -') {
                    setNom("");
                    setPrenom("");
                    setCin("");
                    setAdresse("");
                    setParrinage("");  
                    navigation.navigate("Reussi");
                  }else if (responseparrinage.data.message == 'code de parrinage invalide') {
                    ToastAndroid.show(
                      responseparrinage.data.message,
                      ToastAndroid.SHORT
                    );
                  }
              }else if (response.data.message == 'Vous avez deja une KYC') {
                ToastAndroid.show(
                  response.data.message,
                  ToastAndroid.SHORT
                );
              }
            }
            else{
              ToastAndroid.show(
                'Verifiez votre code de parrainage',
                ToastAndroid.SHORT
              );
            }
          }
          if(parrinage == ""){
            const response = await Axios.post(apiUrl, {iduser:user.data.id, nom: nom, prenom: prenom, cin_passeport: cin, adresse:adresse, statut: 'non verifie'} ,config);
            if(response.data.message == 'KYC créée avec succès') {
              setNom("");
              setPrenom("");
              setCin("");
              setAdresse("");
              navigation.navigate("Reussi");
            }
            else if (response.data.message == 'Vous avez deja une KYC') {
              ToastAndroid.show(
                response.data.message,
                ToastAndroid.SHORT
              );
            }
          }
        } catch (error) {
          console.error('Erreur lors de la requête Axios :', error);
        }
  
        
      }else{
        navigation.navigate("ConnectWallet");
        console.error('JWT introuvable dans l\'Async Storage');
      }
  
    }
  
    const handleSubmit = () => {
      if (
        nom === "" ||
        prenom === "" ||
        cin === "" ||
        adresse === ""
      ) {
        ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
      } else {
  
        SendKYC(nom, prenom, cin, adresse, parrinage);
        // navigation.navigate("Reussi");
  
      }
    };
  
    useEffect(() => {
      const loadFont = async () => {
        await Font.loadAsync({
          "OnestBold1602-hint": require("../../../assets/fonts/OnestBold1602-hint.ttf"),
        });
        setFontLoaded(true);
      };
      loadFont();
    }, []);
  
    if (!fontLoaded) {
      return null;
    }
  
    return (
      <ImageBackground source={bgImage} style={styles.pageContainer}>
        <ScrollView contentContainerStyle={global.scroll}>
          <BackNavs />
          <View style={styles.logoContainer}>
            <Text style={global.grandTextJaune}>Information Personnelle</Text>
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>Nom:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={nom}
              onChangeText={handleNomChange}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>Prénom:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={prenom}
              onChangeText={handlePrenomChange}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>CIN/Passport:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={cin}
              onChangeText={handleCinhange}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>Adresse:</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={adresse}
              onChangeText={handleAdresseChange}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.email}>
            <Text style={styles.label}>Id Parrinage: ("facultatif")</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={parrinage}
              onChangeText={handleParrinageChange}
              keyboardType="default"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.Buttoncreate} onPress={handleSubmit}>
              <LinearGradient
                colors={["#16daac", "#b6ea5c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Text style={styles.textCreate}>Envoyer le formulaire </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };
  
  export default Identity;
  
  const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginTop: "30%",
      marginBottom: "2%",
    },
    navContainer: {
      alignSelf: "flex-start",
    },
    email: {
      marginBottom: 10,
      marginLeft: "8%",
    },
    label: {
      fontSize: 14,
      fontFamily: "OnestBold1602-hint",
      marginBottom: "1%",
      color: "#B6EA5C",
      marginLeft: 9,
    },
    input: {
      width: "90%",
      height: 35,
      borderColor: "white",
      backgroundColor: "white",
      borderRadius: 30,
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      textDecorationStyle: "dashed",
      alignItems: "center",
      fontFamily: "OnestBold1602-hint",
    },
    buttonContainer: {
      alignItems: "center",
      width: "90%",
    },
    Buttoncreate: {
      width: 360,
      height: 45,
      overflow: "hidden",
      marginTop: "5%",
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "10%",
      marginRight: "1%",
      borderRadius: 30,
    },
    textCreate: {
      fontSize: 16,
      fontFamily: "OnestBold1602-hint",
      textAlign: "center",
      lineHeight: 48,
    },
    error: {
      color: "red",
      fontSize: 12,
      marginLeft: 9,
    },
  });