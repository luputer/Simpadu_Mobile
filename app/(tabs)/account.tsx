import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { s } from "react-native-wind"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLoginData } from '../types/auth.types';

export default function Account() {
  const [userData, setUserData] = useState<UserLoginData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Failed to load user data on account page:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={s`flex-1 bg-white`}>
      {/* Header */}
      <View style={[s`p-6 pt-12 rounded-b-3xl`, { backgroundColor: '#088904' }]}>
        <Text style={s`text-white text-2xl font-bold text-center`}>
          Account
        </Text>
      </View>

      {/* Profile Section */}
      <View style={s`items-center mt-8`}>
        <View style={s`rounded-full overflow-hidden w-24 h-24 bg-gray-200`}>
          <Image
            source={userData?.pegawai?.foto ? { uri: userData.pegawai.foto } : require('../../assets/images/profile.png')}
            style={s`w-full h-full`}
          />
        </View>
        <Text style={s`text-xl font-bold mt-4`}>{userData?.nama || 'Nama Pengguna'}</Text>
        <Text style={s`text-gray-600 mt-1`}>
          {userData?.pegawai?.simpeg_jabatan_struktural?.nama_jabatan_struktural || userData?.pegawai?.simpeg_jabatan_fungsional?.nama_jabatan_fungsional || 'Role Tidak Diketahui'}
        </Text>
      </View>

      {/* Menu Options */}
      <View style={s`px-4 mt-8`}>
        <TouchableOpacity
          onPress={() => router.push('/components/edit-profile')}
          style={[s`flex-row items-center p-4 rounded-xl mb-3`, { backgroundColor: '#E8F5E9' }]}>
          <View style={[s`p-2 rounded-full mr-4`, { backgroundColor: '#B7DFB9' }]}>
            <Ionicons name="settings-outline" size={24} color="#088904" />
          </View>
          <Text style={s`flex-1 text-gray-800 text-lg`}>My Account</Text>
          <Ionicons name="chevron-forward" size={24} color="#088904" />
        </TouchableOpacity>

        {/* Add more menu options here if needed */}
      </View>
    </View>
  );
}