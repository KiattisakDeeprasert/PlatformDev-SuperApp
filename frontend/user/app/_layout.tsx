import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "MFU-Sport-index" }}
      />
      <Stack.Screen
        name="normal"
        options={{ title: "MFU-Sport-normal" }}
      />
      <Stack.Screen
        name="special"
        options={{ title: "MFU-Sport-special" }}
      />
      <Stack.Screen
        name="profile"
        options={{ title: "MFU-Sport-profile" }}
      />
      <Stack.Screen
        name="payment"
        options={{ title: "MFU-Sport-payment" }}
      />
    </Stack>
  );
}
