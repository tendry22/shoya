import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Modal,
    Image,
    ToastAndroid,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Alert } from "react-native";
  import Icon from "react-native-vector-icons/FontAwesome";
  import { LinearGradient } from "expo-linear-gradient";
  import { useNavigation } from "@react-navigation/native";
  import * as Clipboard from "expo-clipboard";
  import { BASE_URL } from "../../../config";
  
  import Axios from 'axios';
  import { ScrollView } from "react-native-gesture-handler";
  
  const RetraitTether = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [walletAddresses, setWalletAddresses] = useState({});
    const [walletAddress, setWalletAddress] = useState("Choisissez un réseau pour voir l'adresse");
    const [networkList, setNetworkList] = useState([]);
  
    const [maxMga, setMaxMga] = useState(0);
    const [cours, setCours] = useState();   
  
    useEffect(() => {
      const fetchCours = async () => {
        try {
          const response = await Axios.get(`${BASE_URL}/cours`);
          const liste = response.data;
          for(let i=0; i<liste.length; i++){
            if(response.data[i].actif == 'usdt'){
              setCours(response.data[i].retrait);
            }
          }
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchCours();
    }, []);
  
    useEffect(() => {
      const fetchmaxMga = async () => {
        try {
          const response = await Axios.get(`${BASE_URL}/soldeshoya`);
          console.log(response.data[0].mga);
          const mga = response.data[0].mga;
          setMaxMga(mga);
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchmaxMga();
    }, []);
  
    useEffect(() => {
      const fetchNetworkList = async () => {
        try {
          const response = await Axios.get(`${BASE_URL}/adressenetwork`);
          console.log(response.data);
          setNetworkList(response.data); // Mettre à jour la liste des réseaux avec les données de la réponse
        } catch (error) {
          console.log(error.response.data);
        }
      };
      fetchNetworkList();
    }, []);
  
    // useEffect(() => {
    //   const fetchNetworkList = async () => {
    //     try {
    //       const response = await Axios.get(`${BASE_URL}/adressenetwork`);
    //       console.log(response.data);
    //       // const responseNet = await Axios.post(`${BASE_URL}/binance/network-list`, { coin: 'USDT' });
    //       // // console.log('EFA NIOVA=',responseNet.data[0].networkList[0].network);
    //       // console.log('EFA NIOVA=',responseNet.data[0].networkList[0].name);
    //       // console.log('TAILLE=',responseNet.data[0].networkList.length);
    //     } catch (error) {
    //       console.log(error.response.data);
    //     }
    //   };
    //   fetchNetworkList();
    // }, []);
  
    const handleSubmit = async () => {
      if (selectedValue === "" || (selectedValue !== selectedValue &&
          selectedValue !== selectedValue &&
          selectedValue !== selectedValue &&
          selectedValue !== selectedValue &&
          selectedValue !== selectedValue)
      ) {
        ToastAndroid.show("Veuillez vérifier les champs", ToastAndroid.SHORT);
      } else {
        console.log("Réseau:", selectedValue);
        navigation.navigate("ConfirmRetrait");
      }
    };
  
    const handleSelect = async (value) => {
      setSelectedValue(value);
      setModalVisible(false);
      
      const adresse = await Axios.post(`${BASE_URL}/binance/network-adress`, { network : value });
  
      setWalletAddress(adresse.data.address);
      
      // Mise à jour de l'adresse du portefeuille en fonction du réseau sélectionné
      // if (value === "BNB Smart Chain (BEP20)") {
      //   setWalletAddress("9ca8ac571c2f818d6850c0054ca16a7a");
      // } else if (value === "Ethereum (ERC20)") {
      //   setWalletAddress("caca574a7eb8bc77003174c5d87");
      // } else if (value === "Polygon") {
      //   setWalletAddress("535da9c78e0c59d4bdc3bcfb809c240a36");
      // } else if (value === "Solana") {
      //   setWalletAddress("19873159bf588f054e5");
      // } else if (value === "Tron (TRC20)") {
      //   setWalletAddress("TMHS6obBX2uWSkcxiVek1KVUZbypsUwttc");
      // }
    };
  
    const copyToClipboard = async (text) => {
      await Clipboard.setStringAsync(text);
      ToastAndroid.show("Adresse copiée avec succès !", ToastAndroid.SHORT);
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View>
            <Text style={styles.staticText1}>Choix du réseau</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.selectButton}
            >
              <Text style={styles.selectButtonText}>
                {selectedValue !== "" ? selectedValue : "Choisir un réseau"}
              </Text>
              <Image
                source={require("../../../assets/select.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={["#16DAAC", "#B6EA5C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.cardHeader}>Choisir le réseau</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Icon
              style={{ paddingBottom: 15 }}
              name="close"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {networkList.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(item.diminutif)}
              style={[
                styles.optionCard,
                selectedValue === item.network && styles.selectedOption,
              ]}
            >
              <Text style={styles.optionButton}>{item.network}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
      </LinearGradient>
    </View>
  </Modal>
          </View>
          <Text style={styles.staticText}>
            Adresse du portefeuille ({selectedValue})
          </Text>
  
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.staticTextAddress}>{walletAddress}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(walletAddress)}>
              <Icon name="copy" size={14} color="white" />
            </TouchableOpacity>
          </View>
  
          <View style={styles.inputContainer}>
            <View style={styles.minMaxContainer}>
              <View>
                <Text style={styles.minMaxLabelText}>Minimum</Text>
                <Text style={styles.minMaxLabelText}>Maximum</Text>
              </View>
              <View>
                <Text style={styles.minMaxValueText}>10 USDT</Text>
                <Text style={styles.minMaxValueText}>{(maxMga / cours).toFixed(2)} USDT</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>USDT Envoyé</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    selectedOption: {
      borderWidth: 3,
      borderColor: "white",
    },
    inputContainer: {
      position: "relative",
      marginBottom: 10,
    },
    staticText: {
      color: "white",
      fontFamily: "OnestBold",
      fontSize: 12,
      padding: 5,
      marginTop: "5%",
    },
    staticText1: {
      color: "white",
      fontFamily: "OnestBold",
      fontSize: 12,
      padding: 5,
    },
    staticTextAddress: {
      color: "white",
      fontFamily: "OnestRegular",
      fontSize: 10,
      marginBottom: "10%",
      marginLeft: "2%",
    },
    input: {
      width: "100%",
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
      borderColor: "#ccc",
      borderRadius: 15,
      fontFamily: "OnestBold",
      color: "white",
    },
    text: {
      color: "white",
      fontFamily: "OnestRegular",
      fontSize: 11,
      marginLeft: 5,
    },
    button: {
      backgroundColor: "#FFEE00",
      alignSelf: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 4,
      width: "50%", // Réduire la largeur du bouton ici
      marginTop: 20,
    },
    buttonText: {
      color: "black",
      textAlign: "center",
      fontFamily: "OnestBold",
    },
    selectButton: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      borderBottomWidth: 1,
      height: 40,
      marginBottom: 16,
      borderBottomColor: "gray",
      paddingHorizontal: 8,
      borderColor: "#ccc",
    },
    selectButtonText: {
      flex: 1,
      color: "#ccc",
      fontFamily: "OnestBold",
      fontSize: 14,
    },
    icon: {
      width: 12,
      height: 12,
      marginLeft: 10,
    },
    optionButton: {
      padding: 10,
      backgroundColor: "#16DAAC",
      fontFamily: "OnestBold",
      fontSize: 14,
      color: "white",
      borderRadius: 10,
      borderColor: "white",
      borderWidth: 0.5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    card: {
      borderRadius: 0,
      padding: 20,
      margin: 20,
      marginBottom: 0,
      width: "100%",
      flex: 1,
      maxHeight: 300,
    },
    cardHeader: {
      fontSize: 16,
      marginBottom: 10,
      fontFamily: "OnestBold",
      color: "white",
    },
    optionCard: {
      backgroundColor: "lightgray",
      borderRadius: 8,
      marginBottom: 10,
    },
    minMaxContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      width: "100%",
      height: 40,
      marginTop: 10,
      borderColor: "gray",
      borderWidth: 0.2,
      borderColor: "#ccc",
      borderRadius: 5,
      alignItems: "center",
      backgroundColor: "rgba(109, 117, 136, 0.5)",
    },
    minMaxLabelText: {
      textAlign: "left",
      fontFamily: "OnestBold",
      color: "white",
      fontSize: 10,
    },
    minMaxValueText: {
      textAlign: "right",
      fontFamily: "OnestRegular",
      color: "white",
      fontSize: 10,
    },
  });
  
  export default RetraitTether;