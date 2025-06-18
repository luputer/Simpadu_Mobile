import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { s } from "react-native-wind"
import axiosInstance from '../lib/axios'; // Import axiosInstance

// Skeleton Loader Component
const SkeletonLoader = ({ width = 100, height = 20, style = s`bg-gray-300 rounded` }: { width?: number | string; height?: number; style?: string }) => (
    <View style={[{ width, height }, s`bg-gray-300 rounded`, style]} />
);

export default function Employees() {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        nip: '',
        nama: '',
        email: '',
        no_hp: '',
        alamat: ''
    });
    const [totalPegawai, setTotalPegawai] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTotalPegawai = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('api/pegawai');
                setTotalPegawai(response.data.length);
            } catch (error) {
                console.error("Error fetching total pegawai:", error);
                setTotalPegawai(0); // Set to 0 on error
            } finally {
                setLoading(false);
            }
        };

        fetchTotalPegawai();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Data dosen:', formData);
        setIsModalVisible(false);
        setFormData({
            nip: '',
            nama: '',
            email: '',
            no_hp: '',
            alamat: ''
        });
        // Optionally re-fetch total pegawai after adding new data if this modal also adds employees
        // fetchTotalPegawai();
    };

    return (
        <View style={s`flex-1 bg-white`}>
            {/* Header */}
            <View style={[s`p-6 pt-12 rounded-b-3xl`, { backgroundColor: '#088904' }]}>
                <Text style={s`text-white text-2xl font-bold text-center`}>
                    Daftar Pegawai & Dosen
                </Text>
            </View>

            <ScrollView style={s`flex-1 px-4`}>
                {/* Action Buttons */}
                <View style={s`flex-row justify-between mt-4 mb-4`}>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)} style={[s`py-2 px-4 rounded-full flex-row items-center`, { backgroundColor: '#088904' }]}>
                        <Ionicons name="add-circle" size={20} color="white" />
                        <Text style={s`text-white ml-2`}>Tambah Dosen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s`py-2 px-4 rounded-full flex-row items-center`, { backgroundColor: '#FFA500' }]}>
                        <Ionicons name="add-circle" size={20} color="white" />
                        <Text style={s`text-white ml-2`}>Tambah Pegawai</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                {loading ? (
                    <View style={[s`mb-3 p-4 rounded-xl flex-row items-center justify-between`, { backgroundColor: '#E8F5E9' }]}>
                        <View style={s`flex-row items-center`}>
                            <SkeletonLoader width={48} height={48} style={s`rounded-full mr-4`} />
                            <View>
                                <SkeletonLoader width={80} height={28} style={s`mb-1`} />
                                <SkeletonLoader width={120} height={18} />
                            </View>
                        </View>
                        <SkeletonLoader width={28} height={28} style={s`rounded-full`} />
                    </View>
                ) : (
                    <CardTotalPegawai total={totalPegawai} onPress={() => router.push('/employees/editPegawai')} />
                )}

                <TouchableOpacity style={[s`mb-3 p-4 rounded-xl flex-row items-center justify-between`, { backgroundColor: '#E8F5E9' }]}>
                    <View style={s`flex-row items-center`}>
                        <View style={[s`p-2 rounded-full`, { backgroundColor: '#FFE0B2' }]}>
                            <Ionicons name="school" size={24} color="#088904" />
                        </View>
                        <View style={s`ml-4`}>
                            <Text style={s`text-2xl font-bold text-gray-800`}>100</Text>
                            <Text style={s`text-gray-600`}>Total Dosen</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#088904" />
                </TouchableOpacity>
            </ScrollView>

            {/* Modal Tambah Dosen */}
            <Modal
                // animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={s`flex-1 justify-center items-center bg-black/50`}>
                    <View style={[s`bg-white p-6 rounded-lg w-11/12 max-h-[80%]`, { borderWidth: 2, borderColor: '#088904' }]}>
                        <View style={s`flex-row justify-between items-center mb-4`}>
                            <Text style={s`text-xl font-bold`}>Tambah Dosen</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <View style={s`mb-4`}>
                                <Text style={s`mb-2`}>NIP</Text>
                                <TextInput
                                    style={s`border border-gray-300 rounded-lg p-2`}
                                    value={formData.nip}
                                    onChangeText={(value) => handleInputChange('nip', value)}
                                    placeholder="Masukkan NIP"
                                />
                            </View>

                            <View style={s`mb-4`}>
                                <Text style={s`mb-2`}>Nama</Text>
                                <TextInput
                                    style={s`border border-gray-300 rounded-lg p-2`}
                                    value={formData.nama}
                                    onChangeText={(value) => handleInputChange('nama', value)}
                                    placeholder="Masukkan nama"
                                />
                            </View>

                            <View style={s`mb-4`}>
                                <Text style={s`mb-2`}>Email</Text>
                                <TextInput
                                    style={s`border border-gray-300 rounded-lg p-2`}
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="Masukkan email"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={s`mb-4`}>
                                <Text style={s`mb-2`}>No. HP</Text>
                                <TextInput
                                    style={s`border border-gray-300 rounded-lg p-2`}
                                    value={formData.no_hp}
                                    onChangeText={(value) => handleInputChange('no_hp', value)}
                                    placeholder="Masukkan nomor HP"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={s`mb-4`}>
                                <Text style={s`mb-2`}>Alamat</Text>
                                <TextInput
                                    style={[s`border border-gray-300 rounded-lg p-2`, { height: 100 }]}
                                    value={formData.alamat}
                                    onChangeText={(value) => handleInputChange('alamat', value)}
                                    placeholder="Masukkan alamat"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={[s`py-3 rounded-lg items-center`, { backgroundColor: '#088904' }]}>
                                <Text style={s`text-white font-bold`}>Simpan</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

function CardTotalPegawai({ total = 0, onPress }: { total?: number; onPress: () => void }) {
    return (
        <TouchableOpacity style={[s`mb-3 p-4 rounded-xl flex-row items-center justify-between`, { backgroundColor: '#E8F5E9' }]} onPress={onPress}>
            <View style={s`flex-row items-center`}>
                <View style={[s`p-2 rounded-full`, { backgroundColor: '#B7DFB9' }]}>
                    <Ionicons name="people" size={28} color="#088904" />
                </View>
                <View style={s`ml-4`}>
                    <Text style={s`text-2xl font-bold text-gray-800`}>{total}</Text>
                    <Text style={s`text-gray-600`}>Total Pegawai</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={28} color="#088904" />
        </TouchableOpacity>
    )
}

// Tambahkan style untuk tombol tambah
const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#088904',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 