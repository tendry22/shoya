import React from "react";
import {
  View,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const BackHome = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.retourButton}
      onPress={() => {
        navigation.replace("TabBarRoute");
      }}
    >
      <FontAwesome name="arrow-left" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default BackHome;

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
    top: 40,
    left: 20,
    padding: 10,
    width: "12%",
    // borderWidth: 2,
    // borderColor: "white",
    borderRadius: 50,
  },
});