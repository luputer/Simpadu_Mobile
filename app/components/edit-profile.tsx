import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { s } from "react-native-wind"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserLoginData, PegawaiDetail } from '../types/auth.types';
import axiosInstance from '../lib/axios';

export default function EditProfile() {
  const [activeTab, setActiveTab] = useState('Data Pribadi');
  const [userData, setUserData] = useState<UserLoginData | null>(null);
  const [editData, setEditData] = useState<Partial<PegawaiDetail>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedData: UserLoginData = JSON.parse(storedUserData);
          setUserData(parsedData);
          setEditData(parsedData.pegawai || {});
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        Alert.alert("Error", "Gagal memuat data pengguna.");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userData?.pegawai?.id) {
      Alert.alert('Error', 'ID Pegawai tidak ditemukan.');
      return;
    }

    try {
      await axiosInstance.patch(`/api/pegawai/${userData.pegawai.id}`, editData);
      Alert.alert('Sukses', 'Profil berhasil diperbarui!');
      setIsEditing(false);
      // Refresh user data in AsyncStorage if needed
      const updatedUserData = { ...userData, pegawai: { ...userData.pegawai, ...editData } };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Gagal memperbarui profil.');
    }
  };

  // Helper function to format date for TextInput
  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Helper function to parse date from TextInput
  const parseDateFromInput = (dateString: string) => {
    const [month, day, year] = dateString.split('/').map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
    if (isEditing) { // If was editing, now saving
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
          <View style={s`rounded-full overflow-hidden w-24 h-24 bg-gray-200`}>
            <Image
              source={editData.foto ? { uri: editData.foto } : require('../../assets/images/profile.png')}
              style={s`w-full h-full`}
            />
          </View>
          <TouchableOpacity style={s`absolute bottom-0 right-0 bg-green-600 rounded-full p-2`}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={s`px-4 mt-4`}>
        <View style={s`flex-row flex-wrap justify-between`}>
          {[
            'Data Pribadi',
            'Kepegawaian',
            'Pendidikan',
            'Alamat & Kontak',
            'Dokumen',
            'Keluarga'
          ].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                s`w-[48%] py-2 rounded-xl p-2 mb-3 items-center`,
                activeTab === tab
                  ? { backgroundColor: '#088904' }
                  : { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#088904' }
              ]}
            >
              <Text
                style={[s`${activeTab === tab ? 'text-white' : 'text-green-800'} text-sm font-medium`]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Form Fields */}
      <ScrollView style={s`flex-1 px-4 mt-4`}>
        {activeTab === 'Kepegawaian' ? (
          // Kepegawaian Form Fields
          <>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>NIP</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan NIP"
                value={editData.nip || ''}
                onChangeText={(text) => setEditData({ ...editData, nip: text })}
                editable={isEditing}
              />
            </View>

            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Jabatan Fungsional</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Pilih Jabatan Fungsional"
                value={editData.simpeg_jabatan_fungsional?.nama_jabatan_fungsional || ''}
                onChangeText={(text) => setEditData({ ...editData, simpeg_jabatan_fungsional: { ...editData.simpeg_jabatan_fungsional, nama_jabatan_fungsional: text } as any })}
                editable={isEditing}
              />
            </View>

            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Jabatan Struktural</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Pilih Jabatan Struktural"
                value={editData.simpeg_jabatan_struktural?.nama_jabatan_struktural || ''}
                onChangeText={(text) => setEditData({ ...editData, simpeg_jabatan_struktural: { ...editData.simpeg_jabatan_struktural, nama_jabatan_struktural: text } as any })}
                editable={isEditing}
              />
            </View>

            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Status Pegawai</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Pilih Status Pegawai"
                value={editData.status || ''}
                onChangeText={(text) => setEditData({ ...editData, status: text })}
                editable={isEditing}
              />
            </View>
          </>
        ) : activeTab === 'Data Pribadi' ? (
          // Data Pribadi Form Fields
          <>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Nama Pegawai</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan nama pegawai"
                value={editData.nama || ''}
                onChangeText={(text) => setEditData({ ...editData, nama: text })}
                editable={isEditing}
              />
            </View>

            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Jenis Kelamin</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan jenis kelamin (1: L, 2: P)"
                value={editData.jk !== undefined ? String(editData.jk) : ''}
                onChangeText={(text) => setEditData({ ...editData, jk: parseInt(text) || undefined })}
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>

            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Agama</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan ID Agama"
                value={editData.id_agama !== undefined ? String(editData.id_agama) : ''}
                onChangeText={(text) => setEditData({ ...editData, id_agama: parseInt(text) || undefined })}
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Tempat Lahir</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan tempat lahir"
                value={editData.tempat_lahir || ''}
                onChangeText={(text) => setEditData({ ...editData, tempat_lahir: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Tanggal Lahir</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="mm/dd/yyyy"
                value={formatDateForInput(editData.tgl_lahir)}
                onChangeText={(text) => setEditData({ ...editData, tgl_lahir: parseDateFromInput(text) })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Golongan Darah</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan golongan darah (contoh: 1 untuk A, 2 untuk B)"
                value={editData.gol_darah !== undefined ? String(editData.gol_darah) : ''}
                onChangeText={(text) => setEditData({ ...editData, gol_darah: parseInt(text) || undefined })}
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Status Hidup</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan status hidup"
                value={editData.id_status_hidup || ''}
                onChangeText={(text) => setEditData({ ...editData, id_status_hidup: text })}
                editable={isEditing}
              />
            </View>
          </>
        ) : activeTab === 'Pendidikan' ? (
          // Pendidikan Form Fields
          <>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>ID Pendidikan</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Contoh: 8 untuk Pasca Sarjana"
                value={editData.id_pendidikan || ''}
                onChangeText={(text) => setEditData({ ...editData, id_pendidikan: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>ID Jurusan</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Contoh: 3 untuk Teknik Elektro"
                value={editData.id_jurusan !== undefined ? String(editData.id_jurusan) : ''}
                onChangeText={(text) => setEditData({ ...editData, id_jurusan: parseInt(text) || undefined })}
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>ID Prodi</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Contoh: 1 untuk Teknik Informatika"
                value={editData.id_prodi !== undefined ? String(editData.id_prodi) : ''}
                onChangeText={(text) => setEditData({ ...editData, id_prodi: parseInt(text) || undefined })}
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
            {/* Menampilkan riwayat pendidikan dari simpeg_riwayat_pendidikan */}
            <Text style={s`text-gray-700 text-lg font-bold mt-4 mb-2`}>Riwayat Pendidikan</Text>
            {editData.simpeg_riwayat_pendidikan && editData.simpeg_riwayat_pendidikan.length > 0 ? (
              editData.simpeg_riwayat_pendidikan.map((riwayat: { simpeg_level_pendidikan: { nama_level_pendidikan: string; } | null; thn_lulus: number; tempat: string; }, index: number) => (
                <View key={index} style={s`mb-4 p-3 border border-gray-200 rounded-lg`}>
                  <Text style={s`text-gray-600 mb-1`}>Level Pendidikan: {riwayat.simpeg_level_pendidikan?.nama_level_pendidikan || ''}</Text>
                  <Text style={s`text-gray-600 mb-1`}>Tahun Lulus: {riwayat.thn_lulus || ''}</Text>
                  <Text style={s`text-gray-600`}>Tempat: {riwayat.tempat || ''}</Text>
                </View>
              ))
            ) : (
              <Text style={s`text-gray-500`}>Tidak ada riwayat pendidikan.</Text>
            )}
          </>
        ) : activeTab === 'Alamat & Kontak' ? (
          // Alamat & Kontak Form Fields
          <>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Alamat Lengkap</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan alamat lengkap"
                value={editData.alamat || ''}
                onChangeText={(text) => setEditData({ ...editData, alamat: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Kota</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan kota"
                value={editData.kota || ''}
                onChangeText={(text) => setEditData({ ...editData, kota: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Kode Pos</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan kode pos"
                value={editData.kode_pos || ''}
                onChangeText={(text) => setEditData({ ...editData, kode_pos: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Wilayah (ID)</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan ID Wilayah"
                value={editData.id_wil || ''}
                onChangeText={(text) => setEditData({ ...editData, id_wil: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Kabupaten (ID)</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan ID Kabupaten"
                value={editData.id_kabupaten || ''}
                onChangeText={(text) => setEditData({ ...editData, id_kabupaten: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Provinsi (ID)</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan ID Provinsi"
                value={editData.id_prov || ''}
                onChangeText={(text) => setEditData({ ...editData, id_prov: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Nomor HP</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan nomor handphone"
                value={editData.handphone || ''}
                onChangeText={(text) => setEditData({ ...editData, handphone: text })}
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Email Poliban</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan email poliban"
                value={editData.email_poliban || ''}
                onChangeText={(text) => setEditData({ ...editData, email_poliban: text })}
                keyboardType="email-address"
                editable={isEditing}
              />
            </View>
          </>
        ) : activeTab === 'Dokumen' ? (
          // Dokumen Form Fields
          <>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>NIDN</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan NIDN"
                value={editData.nidn || ''}
                onChangeText={(text) => setEditData({ ...editData, nidn: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>NUPTK</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan NUPTK"
                value={editData.NUPTK || ''}
                onChangeText={(text) => setEditData({ ...editData, NUPTK: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Nomor KTP</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan nomor KTP"
                value={editData.no_ktp || ''}
                onChangeText={(text) => setEditData({ ...editData, no_ktp: text })}
                editable={isEditing}
              />
            </View>
            <View style={s`mb-4`}>
              <Text style={s`text-gray-600 mb-2`}>Nomor KK</Text>
              <TextInput
                style={s`border border-gray-300 rounded-lg p-3 ${isEditing ? '' : 'bg-gray-100'}`}
                placeholder="Masukkan nomor KK"
                value={editData.no_kk || ''}
                onChangeText={(text) => setEditData({ ...editData, no_kk: text })}
                editable={isEditing}
              />
            </View>
          </>
        ) : activeTab === 'Keluarga' ? (
          // Keluarga Form Fields (Contoh, sesuaikan dengan struktur data riwayat keluarga)
          <>
            {/* Untuk data keluarga yang kompleks, Anda mungkin perlu mengiterasi array atau membuat komponen terpisah */}
            <Text style={s`text-gray-500`}>Fungsionalitas data keluarga akan ditambahkan di sini.</Text>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}