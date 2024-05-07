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
  ToastAndroid
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import bgImage from "../../assets/images/bgImage.jpg";
import logo from "../../assets/images/logo.png";
import { FontAwesome } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native";
import Axios from 'axios';
import { BASE_URL } from '../../config';

const MailValidation = ({ route }) => {
  const [countdown, setCountdown] = useState(60);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const CELL_COUNT = 6;
  const { email } = route.params;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const verifyOTP = async (getCode, getEmail) => {
    const email = getEmail;
    const otp = getCode;

    try {
      const response = await Axios.post(`${BASE_URL}/otp/verifyotp`, {email: email, otp: otp});
      console.log(response.data);
      console.log(response.data.otpNotFound);

      if(!response.data.otpNotFound) {
        ToastAndroid.show(
          "Code OPT non valide",
          ToastAndroid.SHORT
        );
      }else if (response.data.otpNotFound) {
        navigation.navigate("PinValidation", { email });
      }

    } catch (error) {
      console.error('Erreur lors de la requête Axios :', error);
    }
  }

  const SubmitValidationEmail = (code) => {
    setValue(code);
    if (code.length === CELL_COUNT) {
      verifyOTP(code, email);
    }
  }

  const handleResendCode = () => {
    // Mettez ici la logique pour renvoyer le code
    setCountdown(60);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={100} // Ajustez ceci selon vos besoins pour un meilleur espacement
        enableOnAndroid={true} // Assure que cela fonctionne également sur Android
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.titleText}>
          <Text style={[styles.text, styles.center]}>
            Nous avons envoyé le code à 6 chiffres à{"\n"}
            <View style={styles.center}>
              <Pressable>
                <Text style={styles.linkText}>{email}</Text>
              </Pressable>
            </View>
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Entrer le code</Text>
        </View>
        <View style={styles.root}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={SubmitValidationEmail}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>

        <View style={styles.titleBas}>
          <Text style={styles.titleText}>
            Vous pouvez renvoyer le code dans{" "}
            <Text style={styles.countStyle}>
              {String(Math.floor(countdown / 60)).padStart(2, "0")}:
              {String(countdown % 60).padStart(2, "0")}{" "}
            </Text>
          </Text>
        </View>
        <View style={styles.boutonRenvoi}>
          <TouchableOpacity
            style={styles.renvoiTouchable}
            onPress={handleResendCode}
            disabled={countdown > 0} // Désactive le bouton si countdown > 0
          >
            <Text
              style={[styles.renvoiText, countdown > 0 && styles.disabledText]}
            >
              Renvoyer le code{" "}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal pour la confirmation */}
        <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(24, 21, 38, 0.8)",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <ActivityIndicator size="large" />
              <Text
                style={{
                  marginTop: "2%",
                  fontFamily: "OnestBold",
                  color: "#fff",
                }}
              >
                Vérification en cours
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
  },
  boutonRenvoi: {
    marginTop: "8%",
    width: "50%",
    alignSelf: "center",
    padding: "2%",
  },
  renvoiTouchable: {
    width: "100%",
    padding: "4%",
    borderRadius: 10,
  },
  countStyle: {
    color: "#B6EA5C",
  },
  disabledText: {
    color: "#808080", // Changer la couleur du texte lorsque le bouton est désactivé
    textDecorationLine: "underline line-through",
  },
  renvoiText: {
    fontFamily: "OnestBold",
    textAlign: "center",
    color: "#B6EA5C",
    textDecorationLine: "underline",
  },
  scroll: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "30%",
    marginBottom: "12%",
  },
  logo: {
    width: 350,
    height: 150,
  },
  titleText: {
    textAlign: "center",
    color: "white",
    fontFamily: "OnestBold",
  },
  linkText: {
    color: "#B6EA5C",
    textDecorationLine: "none",
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
    fontFamily: "OnestBold",
    color: "white",
  },
  center: {
    alignItems: "center",
  },
  titleContainer: {
    textAlign: "center",
    color: "white",
    marginTop: "12%",
  },

  titleBas: {
    borderColor: "white",
    marginTop: "15%",
  },

  root: {
    padding: "3%",
    width: "85%",
    alignSelf: "center",
  },
  codeFieldRoot: { marginTop: "2%" },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    textAlign: "center",
    borderRadius: 50,
    color: "#fff",
  },
  focusCell: {
    borderColor: "#FFF",
  },
  retourButton: {
    position: "absolute",
    top: 30,
    left: 20,
    padding: 10,
  },
});

export default MailValidation;
