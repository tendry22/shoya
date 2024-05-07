import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import global from "../../../assets/css/global";
import ProfileNav from "../../Navs/ProfileNav";
import Games from "../games/jeu";

const Jeu = () => {
  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
        <ProfileNav /> 
        
      <ScrollView contentContainerStyle={global.scroll}>
        {/* <View style={styles.container}>
          <Text style={styles.text}>Prochainement..</Text>
        </View> */}
        {/* <RouletteApp /> */}
        <Games />
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontFamily: "OnestBold",
    textAlign: "center",
    fontSize: 40,
    color: "#B6EA5C",
    marginTop: "1%",
  },
});
export default Jeu;
