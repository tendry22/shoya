import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import Axios from 'axios';
import { BASE_URL } from "../../config";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import global from "../../assets/css/global";

import bgImage from "../../assets/images/bgImage.jpg";
import logo from "../../assets/images/logo.png";
import { FontAwesome } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const HomeAdminConnexion = ({ route }) => {

  const { email } = route.params;

  const [fontLoaded, setFontLoaded] = useState(false);
  const [isAuthenticationEnabled, setAuthenticationEnabled] = useState(false);
  const [storedPin, setStoredPin] = useState("");
  const [isVerificationPinValid, setIsVerificationPinValid] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const navigation = useNavigation();
  const [isPinValid, setIsPinValid] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const CELL_COUNT = 4;

  const verificationRef = useBlurOnFulfill({
    value: enteredPin,
    cellCount: CELL_COUNT,
  });
  const [verificationProps, getVerificationCellOnLayoutHandler] =
    useClearByFocusCell({
      value: enteredPin,
      setValue: setIsVerificationPinValid,
    });

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "OnestBold1602-hint": require("../../assets/fonts/OnestBold1602-hint.ttf"),
      });
      setFontLoaded(true);
    };
    const loadStoredPin = async () => {
      try {
        const pin = await AsyncStorage.getItem("pin");
        if (pin !== null) {
          setStoredPin(pin);
        }
      } catch (error) {
        console.log(
          "Erreur lors de la récupération du PIN depuis le local storage:",
          error
        );
      }
    };

    loadFont();
    loadStoredPin();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  const handleFingerprintAuthentication = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        navigation.replace("TabRoutesAdmin");
      }
    } catch (error) {
      console.log("Erreur d'authentification par empreinte digitale :", error);
    }
  };
  const handleFaceIdAuthentication = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        navigation.replace("TabRoutesAdmin");
      }
    } catch (error) {
      console.log(
        "Erreur d'authentification par reconnaissance faciale :",
        error
      );
    }
  };

  const showPinModal = () => {
    setIsModalVisible(true);
  };

  const hidePinModal = () => {
    setIsModalVisible(false);
  };

  const handlePinValidation = async () => {
    try{
      console.log("MITSOFOKA");
      const admin = await Axios.post(`${BASE_URL}/admin/login`, {
        email: email, pin: enteredPin
      });
      if(admin.data.length > 0){
        navigation.replace("TabRoutesAdmin");
      }
      else{
        Alert.alert("Erreur", "Le PIN saisi est invalide.");
        setEnteredPin("");
      }
    }
    catch(error){
      Alert.alert("Erreur", "Le PIN saisi est invalide.");
      setEnteredPin("");
    }
  };

  const faceId = () => {
    navigation.navigate("FaceIdentification");
  };
  const empreinte = () => {
    navigation.navigate("Empreinte");
  };
  const ignorer = () => {
    navigation.navigate("PinValidation");
  };

  return (
    <ImageBackground source={bgImage} style={global.container}>
      <View style={global.logoContainer}>
        <Image source={logo} style={global.logo} />
      </View>
      <View style={styles.title}>
        <Text style={styles.titleTextJaune}>Méthodes de connexion</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "3%",
          }}
          onPress={handleFingerprintAuthentication}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/finger.png")}
              style={{ width: 52, height: 52 }}
            />
            <Text
              style={{
                marginTop: 5,
                fontFamily: "OnestBold1602-hint",
                color: "whitesmoke",
                fontSize: 11,
                color: "#B6EA5C",
              }}
            >
              Empreinte
            </Text>
          </View>
        </TouchableOpacity>
        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={handleFaceIdAuthentication}
            style={{ alignItems: "center", marginTop: "5%", marginLeft: "10%" }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/faceid.png")}
                style={{ width: 47, height: 47 }}
              />
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: "OnestBold1602-hint",
                  color: "whitesmoke",
                  fontSize: 11,
                  color: "#B6EA5C",
                }}
              >
                Face ID
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={[global.title, styles.title]}>
        <TouchableOpacity onPress={showPinModal}>
          <Text style={styles.titleTextJaune2}>
            Se connecter avec le Code Pin ?
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.modalTitle}>Entrez votre PIN</Text>
              <TouchableOpacity onPress={hidePinModal}>
                <FontAwesome name="times" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <CodeField
                ref={verificationRef}
                {...verificationProps}
                value={enteredPin}
                onChangeText={setEnteredPin}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => {
                  const isVerificationPinEmpty = enteredPin.length === 0;
                  const isVerificationPinInvalid =
                    !isVerificationPinEmpty && !isVerificationPinValid;
                  const isCellValid = index < enteredPin.length;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.cell,
                        isFocused && styles.focusCell,
                        isCellValid && styles.validCell,
                        !isButtonPressed && styles.whiteCell,
                        isButtonPressed && !isPinValid && styles.invalidCell,
                      ]}
                      onLayout={getVerificationCellOnLayoutHandler(index)}
                    >
                      {symbol ? (
                        <Text
                          style={[
                            styles.cellText,
                            isFocused && styles.focusCellText,
                            { fontSize: 20 },
                          ]}
                        >
                          <Icon name="circle" style={styles.cellIcon} />
                        </Text>
                      ) : null}
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handlePinValidation}
              >
                <Text style={styles.buttonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default HomeAdminConnexion;

const styles = StyleSheet.create({
  title: {
    paddingBottom: 54,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: "2%",
    marginTop: "30%",
  },
  retourButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 10,
  },
  titleTextJaune: {
    fontFamily: "OnestBold1602-hint",
    fontSize: 12,
    color: "whitesmoke",
  },
  titleTextJaune2: {
    marginTop: "10%",
    fontFamily: "OnestBold1602-hint",
    fontSize: 14,
    color: "#B6EA5C",
    textDecorationLine: "underline",
  },
  title: {
    alignItems: "center",
    marginTop: "4%",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "OnestBold1602-hint",
    fontSize: 16,
    marginBottom: 20,
    color: "white",
  },
  codeFieldRoot: {
    width: 200,
    marginTop: 20,
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
  modalButton: {
    backgroundColor: "#B6EA5C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    fontFamily: "OnestBold1602-hint",
    fontSize: 14,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#181526",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#B6EA5C",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  buttonText: {
    fontFamily: "OnestBold1602-hint",
    fontSize: 14,
    color: "black",
  },
  root: {
    flex: 1,
    paddingHorizontal: "15%",
    paddingTop: "2%",
    paddingBottom: "2%",
  },

  // codeFieldRoot: { marginTop: 0.001 },
  cell: {
    width: "20%",
    height: 40,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "white",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "white",
    borderRadius: 50,
  },
  cellText: {
    color: "white",
    marginTop: "30%",
    marginLeft: "36%",
    width: 20,
  },
  focusCell: {
    borderColor: "#FFF",
  },
  focusCellText: {
    color: "#FFF",
  },
  cellIcon: {
    width: 30,
  },
  validCell: {
    borderColor: "#16DAAC",
    backgroundColor: "rgba(0, 255, 0, 0.3)",
    color: "white",
  },

  invalidCell: {
    borderColor: "red",
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    color: "white",
  },

  whiteCell: {
    backgroundColor: "transparent",
    color: "#16DAAC",
  },
});
