import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { s } from 'react-native-wind';

export default function TambahDosen() {
    const [form, setForm] = useState({ nidn: '', nama: '', jurusan: '' });

    const handleSave = () => {
        if (!form.nidn || !form.nama || !form.jurusan) {
            Alert.alert('Semua field wajib diisi!');
            return;
        }
        // TODO: Kirim data ke backend di sini
        Alert.alert('Sukses', 'Dosen berhasil ditambahkan!');
        setForm({ nidn: '', nama: '', jurusan: '' });
        router.back();
    };

    return (
        <View style={s`flex-1 bg-white p-6`}>
            {/* Header */}
            <View style={s`flex-row items-center mb-6`}>
                <TouchableOpacity onPress={() => router.back()} style={s`mr-4`}>
                    <Ionicons name="arrow-back" size={28} color="#088904" />
                </TouchableOpacity>
                <Text style={s`text-2xl font-bold text-green-700`}>Tambah Dosen</Text>
            </View>
            {/* Form */}
            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-2`}>NIDN Dosen</Text>
                <TextInput
                    style={s`border border-gray-300 rounded-lg p-3`}
                    placeholder="Masukkan NIDN"
                    value={form.nidn}
                    onChangeText={text => setForm({ ...form, nidn: text })}
                />
            </View>
            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-2`}>Nama Dosen</Text>
                <TextInput
                    style={s`border border-gray-300 rounded-lg p-3`}
                    placeholder="Masukkan Nama Dosen"
                    value={form.nama}
                    onChangeText={text => setForm({ ...form, nama: text })}
                />
            </View>
            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-2`}>Jurusan</Text>
                <TextInput
                    style={s`border border-gray-300 rounded-lg p-3`}
                    placeholder="Masukkan Jurusan"
                    value={form.jurusan}
                    onChangeText={text => setForm({ ...form, jurusan: text })}
                />
            </View>
            {/* Tombol Aksi */}
            <View style={s`flex-row justify-between mt-8`}>
                <TouchableOpacity
                    style={s`bg-gray-300 px-6 py-3 rounded-lg`}
                    onPress={() => router.back()}
                >
                    <Text style={s`text-gray-700 font-bold`}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s`bg-green-700 px-6 py-3 rounded-lg`}
                    onPress={handleSave}
                >
                    <Text style={s`text-white font-bold`}>Simpan</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
} 