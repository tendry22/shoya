import { View, Text, Modal } from "react-native";
import React from "react";
import { Home, Earn, Games, Settings } from "./screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import Logo from "../../assets/images/logobtn.png";
import { Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tether from "../TransactionCard/Tether/Tether";
import ConfirmDepot from "../TransactionCard/Tether/ConfirmDepot";
import ConfirmRetrait from "../TransactionCard/Tether/ConfirmRetrait";
import Reussi from "../TransactionCard/ReussiteEchec/Reussi";
import ConfirmDepotPM from "../TransactionCard/PerfectMoney/ConfirmDepotPM";
import ConfirmRetraitPM from "../TransactionCard/PerfectMoney/ConfirmRetraitPM";
import PerfectMoney from "../TransactionCard/PerfectMoney/PerfectMoney";
import Payeer from "../TransactionCard/Payeer/Payeer";
import ConfirmDepotPayeer from "../TransactionCard/Payeer/ConfirmDepotPayeer";
import ConfirmRetraitPayeer from "../TransactionCard/Payeer/ConfirmRetraitPayeer";
import Airtm from "../TransactionCard/Airtm/Airtm";
import ConfirmRetraitAirtm from "../TransactionCard/Airtm/ConfirmRetraitAirtm";
import ValidationAirtm from "../TransactionCard/Airtm/ValidationAirtm";
import Skrill from "../TransactionCard/Skrill/Skrill";
import ValidationSkrill from "../TransactionCard/Skrill/ValidationSkrill";
import ConfirmRetraitSkrill from "../TransactionCard/Skrill/ConfirmRetraitSkrill";
import Identity from "./Settings/Identity";
import Numero from "./Settings/Numero";
import AideAssistance from "./Settings/AideAssistance";
import Echec from "../TransactionCard/ReussiteEchec/Echec";

const HomeStack = createNativeStackNavigator();

const TabBarRoute = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#181526",
          position: "absolute",
          bottom: "2%",
          marginHorizontal: "3%",
          // width: "100%",
          height: "7%",
          borderRadius: 10,
          shadowOpacity: 0.06,
          shadowOffset: {
            width: 10,
            height: 10,
          },
          paddingHorizontal: 20,
        },
      }}
    >
      <Tab.Screen
        name={"HomeStack"}
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialCommunityIcons
                name="home"
                size={25}
                color={focused ? "#16daac" : "#FFFF"}
              ></MaterialCommunityIcons>
            </View>
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={"Earn"}
        component={Earn}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialCommunityIcons
                name="account-cash"
                size={25}
                color={focused ? "#16daac" : "#FFFF"}
              ></MaterialCommunityIcons>
            </View>
          ),
        }}
      ></Tab.Screen>

      {/* TabScreen action  */}
      <Tab.Screen
        name={"ActionButton"}
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity>
              <View>
                <Image
                  source={Logo}
                  style={{
                    width: 75,
                    height: 75,
                    marginBottom: 10,
                  }}
                ></Image>
              </View>
            </TouchableOpacity>
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name={"Games"}
        component={Games}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialCommunityIcons
                name="gamepad"
                size={25}
                color={focused ? "#16daac" : "#FFFF"}
              ></MaterialCommunityIcons>
            </View>
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={"Settings"}
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialCommunityIcons
                name="menu"
                size={25}
                color={focused ? "#16daac" : "#FFFF"}
              ></MaterialCommunityIcons>
            </View>
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

function EmptyScreen() {
  return <View></View>;
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="HomeScreen">
      <HomeStack.Screen
        name="HomeScreen"
        component={Home}
        options={{ headerShown: false, animation: "fade" }}
      />
      <HomeStack.Screen
        name="Tether"
        component={Tether}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmDepot"
        component={ConfirmDepot}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmDepotPM"
        component={ConfirmDepotPM}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmRetrait"
        component={ConfirmRetrait}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmRetraitPM"
        component={ConfirmRetraitPM}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Reussi"
        component={Reussi}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Echec"
        component={Echec}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="PerfectMoney"
        component={PerfectMoney}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Payeer"
        component={Payeer}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmDepotPayeer"
        component={ConfirmDepotPayeer}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmRetraitPayeer"
        component={ConfirmRetraitPayeer}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Airtm"
        component={Airtm}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Skrill"
        component={Skrill}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmRetraitAirtm"
        component={ConfirmRetraitAirtm}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ValidationAirtm"
        component={ValidationAirtm}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ValidationSkrill"
        component={ValidationSkrill}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="ConfirmRetraitSkrill"
        component={ConfirmRetraitSkrill}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Identity"
        component={Identity}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="Numero"
        component={Numero}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
      <HomeStack.Screen
        name="AideAssistance"
        component={AideAssistance}
        options={{ headerShown: false, animation: "fade_from_bottom" }}
      />
    </HomeStack.Navigator>
  );
}

export default TabBarRoute;