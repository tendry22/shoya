import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import global from "../../assets/css/global";

import bgImage from "../../assets/images/bgImage.jpg";
import logo from "../../assets/images/logo.png";
import { Modal } from "react-native";
import { BackHandler } from "react-native";
import LottieView from "lottie-react-native";

import Axios from 'axios';
import { BASE_URL } from '../../config';

const CELL_COUNT = 4;

const PinValidation = ({ route }) => {
  const navigation = useNavigation();
  const [pin, setPin] = useState("");
  const [verificationPin, setVerificationPin] = useState("");
  const [isPinValid, setIsPinValid] = useState(false);
  const [isVerificationPinValid, setIsVerificationPinValid] = useState(false);
  const isVerificationPinEmpty = verificationPin.length === 0;
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(0);

  const ref = useBlurOnFulfill({ value: pin, cellCount: CELL_COUNT });
  const verificationRef = useBlurOnFulfill({
    value: verificationPin,
    cellCount: CELL_COUNT,
  });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: pin,
    setValue: setPin,
  });
  const [verificationProps, getVerificationCellOnLayoutHandler] =
    useClearByFocusCell({
      value: verificationPin,
      setValue: setVerificationPin,
    });

  useEffect(() => {
    const backAction = () => {
      // Empêcher le retour en arrière si vous êtes sur la page CreateWallet
      if (navigation.isFocused()) {
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (modalVisible) {
      const timerId = setTimeout(() => {
        // Redirection après 4 secondes
        navigation.navigate("Connexion");
      }, 3000);

      // Enregistrer l'ID du timer pour pouvoir l'annuler si nécessaire
      setRedirectTimer(timerId);
    } else {
      // Si le modal est fermé, annuler le timer
      clearTimeout(redirectTimer);
    }

    // Nettoyage du timer lorsque le composant est démonté
    return () => clearTimeout(redirectTimer);
  }, [modalVisible]);

  const handlePinValidation = async () => {
    console.log('MIANTSO');
    const { email } = route.params;
    console.log(email);

    if (pin === verificationPin && pin !== "") {
      setIsPinValid(true);
      setIsVerificationPinValid(true);
      setIsButtonPressed(true); // Active la variable isButtonPressed
      // Enregistrement du code PIN dans le stockage local
      try {
        console.log('email= '+email);
        console.log('pin= '+pin);
        const response = await Axios.post(`${BASE_URL}/users`, {email: email, pin: pin});
        if(response.data){
          setModalVisible(true);
        }
        else{
          ToastAndroid.show(
            "Verifiez les informations",
            ToastAndroid.SHORT
          );
        }
      } catch (error) {
        console.log("Erreur lors de l'enregistrement du code PIN :", error);
      }

    } else {
      setIsPinValid(false);
      setIsVerificationPinValid(false);
      setIsButtonPressed(true); // Active la variable isButtonPressed
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={100}
      enableOnAndroid={true}
    >
      <ImageBackground source={bgImage} style={global.container}>
        <View style={global.logoContainer}>
          <Image source={logo} style={global.logo} />
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>Créer un code PIN</Text>
        </View>
        <View style={styles.root}>
          <CodeField
            ref={ref}
            {...props}
            value={pin}
            onChangeText={setPin}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => {
              const isCellValid = index < pin.length;

              return (
                <View
                  key={index}
                  style={[
                    styles.cell,
                    isFocused && styles.focusCell,
                    isCellValid && styles.validCell,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
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

        <View style={styles.title1}>
          <Text style={styles.titleText1}>Vérification du code PIN</Text>
        </View>
        <View style={styles.root}>
          <CodeField
            ref={verificationRef}
            {...verificationProps}
            value={verificationPin}
            onChangeText={setVerificationPin}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => {
              const isVerificationPinEmpty = verificationPin.length === 0;
              const isVerificationPinInvalid =
                !isVerificationPinEmpty && !isVerificationPinValid;
              const isCellValid = index < verificationPin.length;

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
            style={styles.Buttoncreate}
            onPress={handlePinValidation}
          >
            <LinearGradient
              colors={["#16daac", "#b6ea5c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={global.gradient}
            >
              <Text style={global.textCreate}>Valider</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* MODAL COMPTE CREE */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Compte créé avec succès !</Text>
              <LottieView
                source={require("../../assets/celebrate.json")}
                loop={false}
                autoPlay
                style={{ width: "100%", height: "80%" }}
              />
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

export default PinValidation;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    alignItems: "center",
  },
  titleText: {
    fontFamily: "OnestBold",
    fontSize: 16,
    color: "#16DAAC",
    marginBottom: "2%",
    marginTop: "2%",
  },
  title1: {
    alignItems: "center",
  },
  titleText1: {
    fontFamily: "OnestBold",
    fontSize: 16,
    color: "#16DAAC",
    marginBottom: "2%",
    marginTop: "10%",
  },
  root: {
    flex: 1,
    paddingHorizontal: "15%",
    paddingTop: "2%",
    paddingBottom: "2%",
  },
  cell: {
    width: "14%",
    height: 40,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#FFF",
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
    borderColor: "green",
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
  Buttoncreate: {
    width: "80%",
    height: "18%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 43,
    marginBottom: 110,
  },
  buttonContainer: {
    alignItems: "center",
  },
  retourButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "5%",
    borderRadius: 10,
    alignItems: "center",
    width: "82%",
    height: "50%",
  },
  modalText: {
    fontFamily: "OnestBold",
    fontSize: 20,
    marginBottom: "5%",
  },
  modalButton: {
    backgroundColor: "#16daac",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontFamily: "OnestBold",
    fontSize: 16,
  },
});
