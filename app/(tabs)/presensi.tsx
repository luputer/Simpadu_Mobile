import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

// QRScanner component for handling camera and QR code scanning
export default function QRScanner(): JSX.Element {
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Memeriksa izin kamera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Akses kamera ditolak!</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraActive && (
        <CameraView style={styles.camera} >
          <View style={styles.overlay}>
            <Text style={styles.text}>Arahkan kamera ke QR Code</Text>
          </View>
        </CameraView>
      )}
      <Button title="Tutup Kamera" onPress={() => setCameraActive(false)} />
      <Button title="buka kamera" onPress={() => setCameraActive(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, width: "100%" },
  overlay: { position: "absolute", top: 50, backgroundColor: "rgba(0,0,0,0.5)", padding: 10 },
  text: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});