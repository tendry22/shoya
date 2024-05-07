import React from "react";
import {
  View,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome } from "@expo/vector-icons";

const RetourNavs = () => {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity
      style={styles.retourButton}
      onPress={() => {
        navigation.goBack();
      }}
    >
      <FontAwesome name="arrow-left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default RetourNavs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    // backgroundColor: '#fff',
  },

  backButton: {
    // position: 'absolute',
    // top: 40,
    // left: 10,
  },
  backButtonIcon: {
    color: "white",
    fontSize: 30,
  },
  retourButton: {
    position: "absolute",
    top: 30,
    right: 20,
    padding: 10,
  },
});
