import React, { useState, useEffect } from "react";
import { View, Text, Modal, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TransactionLoading = ({ visible }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    let redirectTimer;

    if (modalVisible) {
      // Utilisation de setTimeout pour définir un délai avant la redirection
      redirectTimer = setTimeout(() => {
        // Redirection après 3 secondes
        navigation.navigate("Home");
      }, 3000);
    }

    return () => {
      // Nettoyer le timer lors du démontage du composant ou lorsque modalVisible change
      clearTimeout(redirectTimer);
    };
  }, [modalVisible]);

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {}}
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
              Transaction en cours
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransactionLoading;