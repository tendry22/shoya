import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import * as Font from "expo-font";

import profile from "../../../assets/images/OIP.jpg";

const CompteAdminNavs = () => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);

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
    return null; // or render a loading indicator
  }

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <Image source={profile} style={styles.profile} />
      </View>
      <View style={styles.viewText}>
        <Text style={styles.condition}>Rakoto</Text>
        <Text style={styles.linkText}>Administrateur</Text>
      </View>
    </View>
  );
};

export default CompteAdminNavs;

const styles = {
  container: {
    container: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 10,
      height: 60,
      marginTop: 10,
    },
  },
  viewText: {
    position: "absolute",
    top: 35,
    left: 80,
  },
  page: {
    marginRight: 10,
    borderColor: "#fff",
    position: "absolute",
    top: 29,
    left: 25,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#fff",
  },
  text: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
  },
  condition: {
    fontFamily: "OnestBold1602-hint",
    color: "white",
  },
  linkText: {
    color: "#B6EA5C",
  },
};
