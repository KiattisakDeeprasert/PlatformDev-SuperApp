import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();

export default function Main() {
  return (
    <Tab.Navigator
      initialRouteName="Normal"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#000000",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
        },
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          backgroundColor: "#BD1616",
          height: "90%",
          width: "32%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginLeft: 1,
          marginRight: 1,
        },
      }}
    ></Tab.Navigator>
  );
}
