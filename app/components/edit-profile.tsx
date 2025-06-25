import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { s } from "react-native-wind"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLoginData } from '../types/auth.types';
import axiosInstance from '../lib/axios';

// Skeleton Loader Component
const SkeletonLoader = ({ width = 100, height = 20, style = {} }: { width?: number | string; height?: number; style?: object }) => (
  <View style={[{ width, height, backgroundColor: '#e0e0e0', borderRadius: 4 }, style]} />
);

export default function EditProfile() {
  const [userData, setUserData] = useState<UserLoginData | null>(null);
  const [editData, setEditData] = useState({
    id_pegawai: '',
    nama_pegawai: '',
    nidn: '',
    nip: '',
    nuptk: '',
    alamat: '',
    foto: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/pegawai/profile/me');
        const data = response.data;
        setEditData({
          id_pegawai: data.id_pegawai || '',
          nama_pegawai: data.nama_pegawai || '',
          nidn: data.nidn || '',
          nip: data.nip || '',
          nuptk: data.nuptk || '',
          alamat: data.alamat || '',
          foto: data.foto || ''
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        Alert.alert("Error", "Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axiosInstance.put('/api/pegawai', editData);
      Alert.alert('Sukses', 'Profil berhasil diperbarui!');
      setIsEditing(false);
      // Refresh user data in AsyncStorage if needed
      if (userData) {
        const updatedUserData = { ...userData, pegawai: { ...userData.pegawai, ...editData } };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Gagal memperbarui profil.');
    }
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      handleSave();
    }
  };

  return (
    <View style={s`flex-1 bg-white`}>
      {/* Header */}
      <View style={[s`p-6 pt-12 flex-row items-center`, { backgroundColor: '#088904' }]}>
        <TouchableOpacity onPress={() => router.back()} style={s`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={s`text-white text-2xl font-bold flex-1`}>My Account</Text>
        <TouchableOpacity onPress={handleEditPress}>
          <Text style={s`text-white text-lg`}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View style={s`items-center mt-8`}>
        <View style={s`relative`}>
          {loading ? (
            <SkeletonLoader width={96} height={96} style={{ borderRadius: 48 }} />
          ) : (
            <View style={s`rounded-full overflow-hidden w-24 h-24 bg-gray-200`}>
              <Image
                source={editData.foto ? { uri: editData.foto } : require('../../assets/images/profile.png')}
                style={s`w-full h-full`}
              />
            </View>
          )}
          {!loading && (
            <TouchableOpacity style={s`absolute bottom-0 right-0 bg-green-600 rounded-full p-2`}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Form Fields */}
      <ScrollView style={s`flex-1 px-4 mt-4`}>
        {/* <View style={s`mb-4`}>
          <Text style={s`text-gray-600 mb-2`}>ID Pegawai</Text>
          <TextInput
            style={s`border border-gray-300 rounded-lg p-3 bg-gray-100`}
            value={String(editData.id_pegawai)}
            editable={false}
          />
        </View> */}
        <View style={s`mb-4`}>
          <Text style={s`text-gray-600 mb-2`}>Nama Pegawai</Text>
          {loading ? (
            <SkeletonLoader width="100%" height={48} style={{ borderRadius: 8 }} />
          ) : (
            <TextInput
              style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
              placeholder="Masukkan nama pegawai"
              value={editData.nama_pegawai}
              onChangeText={(text) => setEditData({ ...editData, nama_pegawai: text })}
              editable={isEditing}
            />
          )}
        </View>
        <View style={s`mb-4`}>
          <Text style={s`text-gray-600 mb-2`}>NIDN</Text>
          {loading ? (
            <SkeletonLoader width="100%" height={48} style={{ borderRadius: 8 }} />
          ) : (
            <TextInput
              style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
              placeholder="Masukkan NIDN"
              value={editData.nidn}
              onChangeText={(text) => setEditData({ ...editData, nidn: text })}
              editable={isEditing}
            />
          )}
        </View>
        <View style={s`mb-4`}>
          <Text style={s`text-gray-600 mb-2`}>NIP</Text>
          {loading ? (
            <SkeletonLoader width="100%" height={48} style={{ borderRadius: 8 }} />
          ) : (
            <TextInput
              style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
              placeholder="Masukkan NIP"
              value={editData.nip}
              onChangeText={(text) => setEditData({ ...editData, nip: text })}
              editable={isEditing}
            />
          )}
        </View>
        <View style={s`mb-4`}>
          <Text style={s`text-gray-600 mb-2`}>NUPTK</Text>
          {loading ? (
            <SkeletonLoader width="100%" height={48} style={{ borderRadius: 8 }} />
          ) : (
            <TextInput
              style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
              placeholder="Masukkan NUPTK"
              value={editData.nuptk}
              onChangeText={(text) => setEditData({ ...editData, nuptk: text })}
              editable={isEditing}
            />
          )}
        </View>
        <View style={s`mb-4`}>
          <Text style={s`text-gray-600 mb-2`}>Alamat</Text>
          {loading ? (
            <SkeletonLoader width="100%" height={48} style={{ borderRadius: 8 }} />
          ) : (
            <TextInput
              style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
              placeholder="Masukkan alamat"
              value={editData.alamat}
              onChangeText={(text) => setEditData({ ...editData, alamat: text })}
              editable={isEditing}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}