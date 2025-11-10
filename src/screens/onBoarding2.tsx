import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigation"; 

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding2">;

export default function OnboardingScreen2({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kelola Produk Anda</Text>
      <Text style={styles.desc}>
        Tambahkan produk baru dengan mudah langsung dari aplikasi.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace("MainTabs")}>
        <Text style={styles.btnText}>Mulai Sekarang</Text>
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
