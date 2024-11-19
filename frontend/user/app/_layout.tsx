import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "MFU-Library-index" }} />
      <Stack.Screen name="normal" options={{ title: "MFU-Library-normal" }} />
      <Stack.Screen name="special" options={{ title: "MFU-Library-specail" }} />
      <Stack.Screen name="profile" options={{ title: "MFU-Library-profile" }} />
      <Stack.Screen name="payment" options={{ title: "MFU-Library-payment" }} />
    </Stack>
  );
}
