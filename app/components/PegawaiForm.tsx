import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { s } from 'react-native-wind';
import { Pegawai } from '../types/pegawai.types';
import axiosInstance from '../lib/axios';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface PegawaiFormProps {
    editData: Partial<Pegawai> | null;
    onInputChange: (field: keyof Partial<Pegawai>, value: string | number | null) => void;
    onSave: () => void;
    onClose: () => void;
    isEditMode: boolean;
}

export default function PegawaiForm({ editData, onInputChange, onSave, onClose, isEditMode }: PegawaiFormProps) {
    if (!editData) return null;

    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setUploading(true);
                const formData = new FormData();
                formData.append('foto', {
                    uri: result.assets[0].uri,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                } as any);

                const response = await axiosInstance.post('/uploads', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.filename) {
                    onInputChange('foto', response.data.filename);
                    Alert.alert('Sukses', 'Foto berhasil diupload');
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Gagal mengupload foto. Silakan coba lagi.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView>
            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-1`}>Foto</Text>
                <View style={s`items-center`}>
                    <View style={s`relative`}>
                        <View style={s`rounded-full overflow-hidden w-24 h-24 bg-gray-200`}>
                            <Image
                                source={
                                    editData.foto
                                        ? { uri: `${(axiosInstance.defaults.baseURL || '').replace(/\/api$/, '')}/uploads/${editData.foto}` }
                                        : { uri: 'https://via.placeholder.com/100' }
                                }
                                style={s`w-full h-full object-cover`}
                            />
                        </View>
                        <TouchableOpacity
                            style={[
                                s`absolute bottom-0 right-0 bg-green-600 rounded-full p-2`,
                                uploading && s`opacity-50`
                            ]}
                            onPress={pickImage}
                            disabled={uploading}
                        >
                            <Ionicons name="camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-1`}>Nama Pegawai *</Text>
                <TextInput
                    style={s`border border-gray-300 p-2 rounded-lg`}
                    value={editData.nama_pegawai || ''}
                    onChangeText={(text) => onInputChange('nama_pegawai', text)}
                    placeholder="Masukkan nama pegawai"
                />
            </View>

            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-1`}>NIP *</Text>
                <TextInput
                    style={s`border border-gray-300 p-2 rounded-lg`}
                    value={editData.nip || ''}
                    onChangeText={(text) => onInputChange('nip', text)}
                    placeholder="Masukkan NIP"
                    keyboardType="numeric"
                />
            </View>

            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-1`}>NIDN</Text>
                <TextInput
                    style={s`border border-gray-300 p-2 rounded-lg`}
                    value={editData.nidn || ''}
                    onChangeText={(text) => onInputChange('nidn', text)}
                    placeholder="Masukkan NIDN"
                />
            </View>

            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-1`}>NUPTK</Text>
                <TextInput
                    style={s`border border-gray-300 p-2 rounded-lg`}
                    value={editData.nuptk || ''}
                    onChangeText={(text) => onInputChange('nuptk', text)}
                    placeholder="Masukkan NUPTK"
                />
            </View>

            <View style={s`mb-4`}>
                <Text style={s`text-gray-700 mb-1`}>Alamat</Text>
                <TextInput
                    style={[s`border border-gray-300 p-2 rounded-lg`, { height: 100 }]}
                    value={editData.alamat || ''}
                    onChangeText={(text) => onInputChange('alamat', text)}
                    placeholder="Masukkan alamat"
                    multiline
                    numberOfLines={3}
                />
            </View>

            <View style={s`flex-row justify-end mt-8`}>
                <TouchableOpacity
                    style={s`px-6 py-2 rounded-lg border border-gray-400 mr-2`}
                    onPress={onClose}
                >
                    <Text style={s`text-gray-600 font-bold`}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s`px-6 py-2 rounded-lg bg-green-600`}
                    onPress={onSave}
                >
                    <Text style={s`text-white font-bold`}>SIMPAN</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
} 