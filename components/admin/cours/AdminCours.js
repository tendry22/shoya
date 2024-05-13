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
  ToastAndroid,
} from "react-native";
import CompteAdminNavs from "../navs/CompteAdminNavs";
import IconFeather from "react-native-vector-icons/Feather";
import { FontAwesome } from "@expo/vector-icons";
import Axios from 'axios';
import { BASE_URL } from '../../../config';

const AdminCours = () => {
  const [depotValues, setDepotValues] = useState({});

  const [retraitValues, setRetraitValues] = useState({});

  const [selectedDevise, setSelectedDevise] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isModalDepotVisible, setIsModalDepotVisible] = useState(false);
  const [isModalRetraitVisible, setIsModalRetraitVisible] = useState(false);

  const handleEditDepot = (devise) => {
    setSelectedDevise(devise);
    setIsModalDepotVisible(true);
  };

  const hideModalDepot = () => {
    setIsModalDepotVisible(false);
  };
  const hideModalRetrait = () => {
    setIsModalRetraitVisible(false);
  };

  const handleEditRetrait = (devise) => {
    setSelectedDevise(devise);
    setIsModalRetraitVisible(true);
  };

  const getAllCoursDepot = async() => {
    try{

      const apiUrl = `${BASE_URL}/cours`;

      const response = await Axios.get(apiUrl);

      const dataGet = {
        USDT: response.data[0].depot,
        PM: response.data[4].depot,
        Payeer: response.data[1].depot,
        Skrill: "",
        Airtm: "",
      }

      setDepotValues(dataGet);

      // console.log('Réponse de l\'API :', dataGet);

    }catch(error){
      console.error('Erreur lors de la requête :', error);
    }
  
  };

  const getAllCoursRetrait = async() => {
    
    try{

      const apiUrl = `${BASE_URL}/cours`;

      const response = await Axios.get(apiUrl);

      const dataGet = {
        USDT: response.data[0].retrait,
        PM: response.data[4].retrait,
        Payeer: response.data[1].retrait,
        Skrill: response.data[2].retrait,
        Airtm: response.data[3].retrait,
      }

      setRetraitValues(dataGet);

      // console.log('Réponse de l\'API :', dataGet);

    }catch(error){
      console.error('Erreur lors de la requête :', error);
    }
  
}

  const changeCoursDepot = async (depot, actif) => {
    console.log("=======");
    console.log(depot);
    console.log("=======");
    console.log(actif);
    console.log("=======");

    try {
      const response = await Axios.put(`${BASE_URL}/cours/updatedepot`, {valeur: depot, actif: actif});

      if(response.data) {
        ToastAndroid.show(
          "Changer avec succès",
          ToastAndroid.SHORT
        );
      }

    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }

  }

  const changeCoursRetrait = async (retrait, actif) => {
  

    try {
      const response = await Axios.put(`${BASE_URL}/cours/updateretrait`, {valeur: retrait, actif: actif});
      // console.log(response.data);

      if(response.data) {
        ToastAndroid.show(
          "Changer avec succès",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }

  }

  const handleSaveDepot = () => {
    if (selectedDevise && newValue !== "") {
      
      setDepotValues((prevDepotValues) => ({
        ...prevDepotValues,
        [selectedDevise]: newValue,
      }));

      changeCoursDepot(newValue, selectedDevise);

      setSelectedDevise("");
      setNewValue("");
      setIsModalDepotVisible(false);
    }
  };

  const handleSaveRetrait = () => {
    if (selectedDevise && newValue !== "") {
      setRetraitValues((prevRetraitValues) => ({
        ...prevRetraitValues,
        [selectedDevise]: newValue,
      }));

      changeCoursRetrait(newValue, selectedDevise);

      setSelectedDevise("");
      setNewValue("");
      setIsModalRetraitVisible(false);
    }

  };

  useEffect(() => {
    getAllCoursDepot();
    getAllCoursRetrait();
  }, [])

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <CompteAdminNavs />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cours de change</Text>
      </View>
      <View style={styles.transactionContainer}>
        <View style={styles.devise}>
          <Text style={styles.tableHeader}>Devise</Text>
          <Text style={styles.tableDevise1}>USDT</Text>
          <Text style={styles.tableDevise1}>PM</Text>
          <Text style={styles.tableDevise1}>Payeer</Text>
          <Text style={styles.tableDevise1}>Skrill</Text>
          <Text style={styles.tableDevise1}>Airtm</Text>
        </View>
        <View style={styles.depot}>
          <Text style={styles.tableHeader}>Dépôt</Text>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{depotValues.USDT} Ar</Text>
            <TouchableOpacity onPress={() => handleEditDepot("USDT")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{depotValues.PM} Ar</Text>
            <TouchableOpacity onPress={() => handleEditDepot("PM")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{depotValues.Payeer} Ar</Text>
            <TouchableOpacity onPress={() => handleEditDepot("Payeer")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.tableDevise}>{depotValues.Skrill}</Text>
          <Text style={styles.tableDevise}>{depotValues.Airtm}</Text>
        </View>
        <View style={styles.retrait}>
          <Text style={styles.tableHeader}>Retrait</Text>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{retraitValues.USDT} Ar</Text>
            <TouchableOpacity onPress={() => handleEditRetrait("USDT")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{retraitValues.PM} Ar</Text>
            <TouchableOpacity onPress={() => handleEditRetrait("PM")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{retraitValues.Payeer} Ar</Text>
            <TouchableOpacity onPress={() => handleEditRetrait("Payeer")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{retraitValues.Skrill} Ar</Text>
            <TouchableOpacity onPress={() => handleEditRetrait("Skrill")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.depotDevise}>
            <Text style={styles.tableDevise}>{retraitValues.Airtm} Ar</Text>
            <TouchableOpacity onPress={() => handleEditRetrait("Airtm")}>
              <IconFeather
                style={styles.icoDevise}
                name="edit"
                size={14}
                color={"#ccc"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal visible={isModalDepotVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.modalTitle}>Modifier la valeur</Text>
              <TouchableOpacity onPress={hideModalDepot}>
                <FontAwesome name="times" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={newValue}
              keyboardType="numeric"
              onChangeText={(text) => setNewValue(text)}
              placeholder="Nouvelle valeur"
              placeholderTextColor="#999"
            />
            <Text
              style={{
                color: "white",
                position: "absolute",
                top: 70,
                right: 30,
                fontFamily: "OnestRegular",
              }}
            >
              Ariary
            </Text>
            <TouchableOpacity
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 10,
                alignSelf: "center",
              }}
              onPress={handleSaveDepot}
            >
              <Text style={styles.button}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isModalRetraitVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.modalTitle}>Modifier la valeur</Text>
              <TouchableOpacity onPress={hideModalRetrait}>
                <FontAwesome name="times" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={newValue}
              keyboardType="numeric"
              onChangeText={(text) => setNewValue(text)}
              placeholder="Nouvelle valeur"
              placeholderTextColor="#999"
            />
            <Text
              style={{
                color: "white",
                position: "absolute",
                top: 70,
                right: 30,
                fontFamily: "OnestRegular",
              }}
            >
              Ariary
            </Text>
            <TouchableOpacity
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 10,
                alignSelf: "center",
              }}
              onPress={handleSaveRetrait}
            >
              <Text style={styles.button}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: "30%",
    width: "90%",
    alignSelf: "center",
  },
  depotDevise: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#B6EA5C",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    width: "50%",
    alignSelf: "center",
    fontFamily: "OnestBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: "OnestBold",
    color: "white",
    borderWidth: 0.5,
  },
  modalContent: {
    backgroundColor: "#181526",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: "OnestBold",
    fontSize: 16,
    marginBottom: 20,
    color: "white",
  },
  transactionContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: "15%",
    flex: 1,
    marginBottom: "7%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  title: {
    fontFamily: "OnestBold",
    color: "#ABDC57",
    fontSize: 18,
  },
  devise: {
    flexDirection: "column",
  },
  depot: {
    flexDirection: "column",
  },
  modif: {
    flexDirection: "column",
  },
  retrait: {
    flexDirection: "column",
  },
  tableHeader: {
    fontFamily: "OnestBold",
    fontSize: 16,
    marginBottom: "20%",
    color: "white",
    paddingBottom: 5,
  },
  tableDevise: {
    fontFamily: "OnestRegular",
    textAlign: "center",
    marginBottom: "25%",
    color: "#ccc",
    fontSize: 13,
  },
  tableDevise1: {
    fontFamily: "OnestRegular",
    textAlign: "center",
    marginBottom: "25%",
    color: "#ccc",
    fontSize: 13,
    paddingBottom: 5,
  },
  icoDevise: {
    fontFamily: "OnestRegular",
    paddingLeft: 4,
  },
});

export default AdminCours;
