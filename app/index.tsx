import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (router) {
        router.replace("/auth/login");
      }
  }, 3000); // Splash screen muncul selama 3 detik
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground
        source={require("../assets/images/BG.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          {/* Logo POLIBAN */}
          <Image source={require("../assets/images/poliban.png")} style={styles.logo} />

          {/* Teks SIMPADU */}
          <Text style={styles.title}>SIMPADU</Text>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
});