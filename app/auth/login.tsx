import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import axiosInstance from '../lib/axios';

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {

            const response = await axiosInstance.post('api/auth/login', {
                username,
                password,
            })

            const { token, user } = response.data;

            // Simpan token dan data user terlebih dahulu
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));

            // Kemudian ambil token untuk verifikasi
            const storedToken = await AsyncStorage.getItem('userToken');
            console.log('Token dari AsyncStorage:', storedToken);

            // Clear form
            setUsername('');
            setPassword('');

            // Navigate to employees tab
            router.replace('/(tabs)/dashbord');
        } catch (error) {
            let errorMessage = "Something went wrong. Please try again.";
            const err = error as any;
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.toLowerCase().includes("password")) {
                    errorMessage = "Password atau Nip yang Anda masukkan salah!";
                } else {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                // Axios network or other error
                errorMessage = err.message;
            }
            Alert.alert("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <StatusBar hidden={true} />
            <ImageBackground source={require("../../assets/images/BG.png")} style={styles.background}>
                <View style={styles.container}>
                    {/* Logo POLIBAN */}
                    <Image source={require("../../assets/images/poliban.png")} style={styles.logo} />

                    {/* Teks Header */}
                    <Text style={styles.title}>SIMPADU</Text>
                    <Text style={styles.subtitle}>Sistem Informasi Terpadu</Text>
                    <Text style={styles.welcome}>Selamat Datang Kembali</Text>
                    <Text style={styles.prompt}>Silahkan masuk ke akun Anda</Text>

                    {/* Input Email/NIP */}
                    <TextInput
                        style={styles.input}
                        placeholder="Email/NIP"
                        placeholderTextColor="#aaa"
                        value={username}
                        onChangeText={setUsername}
                        editable={!isLoading}
                    />

                    {/* Input Password */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoading}
                    />

                    {/* Checkbox + Lupa Password */}
                    <View style={styles.options}>
                        <TouchableOpacity>
                            <Text style={styles.checkbox}>✅ Ingat Saya</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.link}>Lupa Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tombol Masuk */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        // onPress={() => router.push('/(tabs)/dashbord')}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Masuk</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer */}
                    <Text style={styles.footer}>2023 SIMPADU - Politeknik Negeri Banjarmasin</Text>
                </View>
            </ImageBackground>
            <Toast />
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
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#088904",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    welcome: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    },
    prompt: {
        fontSize: 14,
        color: "#888",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },
    options: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    checkbox: {
        color: "#333",
    },
    link: {
        color: "#088904",
    },
    button: {
        backgroundColor: "#088904",
        paddingVertical: 12,
        width: "100%",
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    footer: {
        marginTop: 20,
        fontSize: 10,
        color: "#888",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});