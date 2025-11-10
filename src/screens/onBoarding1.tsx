import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigation";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding1">;

export default function OnboardingScreen1({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang di Mini E-Commerce!</Text>
      <Text style={styles.desc}>
        Aplikasi sederhana untuk melihat dan menambah produk.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Onboarding2")}>
        <Text style={styles.btnText}>Lanjut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  desc: { textAlign: "center", color: "#666", marginBottom: 20 },
  btn: { backgroundColor: "#1f6feb", padding: 10, borderRadius: 8 },
  btnText: { color: "white", fontWeight: "600" },
});
