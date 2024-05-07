import React, { useState, useEffect } from "react";
import { View, Text, Modal, ActivityIndicator } from "react-native";

const VerificationLoading = ({ visible }) => {
  return (
    <Modal
      visible={visible}
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
            style={{ marginTop: "2%", fontFamily: "OnestBold", color: "#fff" }}
          >
            Vérification en cours
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default VerificationLoading;
