import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import { s } from 'react-native-wind';
import axiosInstance from '../lib/axios';
import { Pegawai, PegawaiEditData } from '../types/pegawai.types';
import PegawaiForm from '../components/PegawaiForm';
import axios from 'axios';

// Skeleton Loader Component
const SkeletonLoader = ({ width = 100, height = 20, style = s`bg-gray-300 rounded` }: { width?: number | string; height?: number; style?: string }) => (
  <View style={[{ width, height }, s`bg-gray-300 rounded`, style]} />
);

export default function PegawaiScreen() {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<PegawaiEditData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch data pegawai
  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/pegawai');

      // Validasi response data
      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (!Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      setPegawaiList(response.data);
    } catch (error) {
      console.error('Error fetching pegawai:', error);
      let errorMessage = 'Gagal mengambil data pegawai';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'Tidak dapat terhubung ke server';
        }
      }

      Alert.alert('Error', errorMessage);
      setPegawaiList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(pegawaiList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = pegawaiList.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setSelected([]);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelected([]);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelected([]);
    }
  };

  const selectAll = () => {
    if (selected.length === pegawaiList.length) {
      setSelected([]);
    } else {
      setSelected(pegawaiList.map(p => p.id_pegawai));
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditData({

    });
    setAddModalVisible(true);
  };

  const handleInputChange = (field: keyof PegawaiEditData, value: string | number | null) => {
    if (!editData) return;

    setEditData({
      ...editData,
      [field]: value
    });
  };

  const openEditModal = (pegawai: Pegawai) => {
    setIsEditMode(true);
    const editData: PegawaiEditData = {
      id_pegawai: pegawai.id_pegawai,
      nama_pegawai: pegawai.nama_pegawai,
      nip: pegawai.nip,
      nidn: pegawai.nidn,
      nuptk: pegawai.nuptk,
      alamat: pegawai.alamat,
      foto: pegawai.foto
    };

    setEditData(editData);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!editData) return;

    // Basic validation for required fields
    if (!editData.nama_pegawai?.trim() || !editData.nip?.trim()) {
      Alert.alert('Error', 'Nama Pegawai dan NIP harus diisi!');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && editData.id_pegawai) {
        await axiosInstance.put(`/api/pegawai/${editData.id_pegawai}`, editData);
        Alert.alert('Success', 'Data pegawai berhasil diperbarui');
      } else {
        await axiosInstance.post('/api/pegawai', editData);
        Alert.alert('Success', 'Data pegawai berhasil ditambahkan');
      }
      setModalVisible(false);
      fetchPegawai();
    } catch (error) {
      console.error('Error saving pegawai:', error);
      Alert.alert('Error', 'Gagal menyimpan data pegawai');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPegawai = async (newPegawaiData: Partial<Pegawai>) => {
    try {
      // Basic validation for required fields based on error message
      // if (
      //   !newPegawaiData.nama_pegawai?.trim() ||
      //   !newPegawaiData.nip?.trim() ||
      //   !newPegawaiData.no_ktp?.trim() || // NIK
      //   newPegawaiData.id_agama === undefined || // id_agama
      //   !newPegawaiData.id_wil?.trim() // id_wil
      // ) {
      //   Alert.alert('Error', 'Nama, NIP, NIK, ID Agama, dan ID Wilayah wajib diisi!');
      //   return;
      // }

      await axiosInstance.post('/api/pegawai', newPegawaiData);
      Alert.alert('Sukses', 'Data pegawai berhasil ditambahkan');
      setAddModalVisible(false); // Close the modal
      fetchPegawai(); // Refresh data
    } catch (error) {
      console.error('Error adding pegawai:', error);
      Alert.alert('Error', 'Gagal menambahkan pegawai. Pastikan semua field yang wajib diisi sudah benar.');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Konfirmasi', 'Yakin hapus pegawai ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosInstance.delete(`/api/pegawai/${id}`);
            Alert.alert('Sukses', 'Pegawai berhasil dihapus');
            fetchPegawai(); // Refresh data
          } catch (error) {
            console.error('Error deleting pegawai:', error);
            Alert.alert('Error', 'Gagal menghapus pegawai');
          }
        }
      }
    ]);
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      Alert.alert('Info', 'Tidak ada pegawai yang dipilih untuk dihapus.');
      return;
    }

    Alert.alert(
      'Konfirmasi',
      `Yakin hapus ${selected.length} pegawai yang dipilih?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete each selected item
              const deletePromises = selected.map(id => axiosInstance.delete(`/api/pegawai/${id}`));
              await Promise.all(deletePromises);
              Alert.alert('Sukses', `${selected.length} pegawai berhasil dihapus`);
              setSelected([]); // Clear selection
              fetchPegawai(); // Refresh data
            } catch (error) {
              console.error('Error deleting multiple pegawai:', error);
              Alert.alert('Error', 'Gagal menghapus beberapa pegawai.');
            }
          }
        }
      ]
    );
  };

  const toggleSelect = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderPegawaiItem = ({ item, index }: { item: Pegawai; index: number }) => (
    <View style={[
      s`flex-row items-center border-b border-gray-100`,
      index % 2 === 0 ? s`bg-gray-50` : s`bg-white`
    ]}>
      <TouchableOpacity
        style={s`w-12 justify-center items-center py-4`}
        onPress={() => toggleSelect(item.id_pegawai)}
      >
        <View style={[
          s`w-5 h-5 border-2 rounded`,
          selected.includes(item.id_pegawai)
            ? s`bg-green-600 border-green-600`
            : s`border-gray-300 bg-white`
        ]}>
          {selected.includes(item.id_pegawai) && (
            <Ionicons name="checkmark" size={12} color="white" style={s`self-center mt-0.5`} />
          )}
        </View>
      </TouchableOpacity>

      <Text style={s`w-40 text-sm text-gray-900 px-2 font-medium`} numberOfLines={2}>
        {item.nama_pegawai}
      </Text>
      <Text style={s`w-44 text-xs text-gray-600 px-2 font-mono`}>
        {item.nip}
      </Text>
      <Text style={s`w-36 text-sm text-gray-700 px-2`} numberOfLines={2}>
        {item.nidn}
      </Text>
      <Text style={s`w-36 text-sm text-gray-700 px-2`} numberOfLines={2}>
        {item.nuptk}
      </Text>
      <Text style={s`w-36 text-sm text-gray-700 px-2`} numberOfLines={2}>
        {item.alamat}
      </Text>

      <View style={s`w-20 flex-row justify-center`}>
        <TouchableOpacity
          style={s`p-1 mr-1`}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={16} color="#059669" />
        </TouchableOpacity>
        <TouchableOpacity
          style={s`p-1`}
          onPress={() => handleDelete(item.id_pegawai)}
        >
          <Ionicons name="trash" size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSkeletonItems = () => {
    return Array.from({ length: itemsPerPage }).map((_, index) => (
      <View
        key={`skeleton-${index}`}
        style={[
          s`flex-row items-center border-b border-gray-100`,
          index % 2 === 0 ? s`bg-gray-50` : s`bg-white`,
          s`py-4`
        ]}
      >
        <SkeletonLoader width={30} height={30} style={s`rounded-full ml-4`} />
        <SkeletonLoader width={120} height={20} style={s`ml-4`} />
        <SkeletonLoader width={100} height={20} style={s`ml-4`} />
        <SkeletonLoader width={140} height={20} style={s`ml-4`} />
        <SkeletonLoader width={60} height={20} style={s`ml-4`} />
      </View>
    ));
  };

  return (
    <SafeAreaView style={s`flex-1 bg-white`}>
      <StatusBar backgroundColor="#088904" barStyle="light-content" />

      {/* Header */}
      <View style={[s`px-6 py-4 shadow-sm`, { backgroundColor: '#088904' }]}>
        <View style={s`flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={s`p-2 -ml-2`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={s`text-white text-xl font-bold`}>
            Daftar Pegawai
          </Text>

          <View style={s`w-8`} /> {/* Placeholder to maintain layout */}
        </View>
      </View>

      {/* Action Bar */}
      <View style={s`flex-row justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200`}>
        <View style={s`flex-row items-center`}>
          <Text style={s`text-gray-600 text-sm mr-2`}>
            {pegawaiList.length} pegawai total
          </Text>
          {selected.length > 0 && (
            <Text style={s`text-green-600 text-sm font-medium`}>
              ({selected.length} dipilih)
            </Text>
          )}
        </View>

        <View style={s`flex-row items-center`}>
          {selected.length > 0 ? (
            <TouchableOpacity
              style={s`flex-row items-center bg-red-500 px-4 py-2 rounded-lg`}
              onPress={handleBulkDelete}
            >
              <Ionicons name="trash" size={18} color="white" />
              <Text style={s`text-white font-medium ml-1`}>Hapus</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={s`flex-row items-center bg-green-600 px-4 py-2 rounded-lg`}
              onPress={openAddModal}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={s`text-white font-medium ml-1`}>Tambah Data</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Add Pegawai Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.addModalContainer}>
          <View style={styles.addModalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.addModalTitle}>Tambah Pegawai Baru</Text>
            <ScrollView style={styles.addModalScrollView}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Pegawai *</Text>
                <TextInput
                  style={styles.input}
                  value={editData?.nama_pegawai}
                  onChangeText={(text) => setEditData({ ...editData, nama_pegawai: text })}
                  placeholder="Masukkan nama pegawai"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIP *</Text>
                <TextInput
                  style={styles.input}
                  value={editData?.nip}
                  onChangeText={(text) => setEditData({ ...editData, nip: text })}
                  placeholder="Masukkan NIP"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIDN</Text>
                <TextInput
                  style={styles.input}
                  value={editData?.nidn}
                  onChangeText={(text) => setEditData({ ...editData, nidn: text })}
                  placeholder="Masukkan NIDN"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NUPTK</Text>
                <TextInput
                  style={styles.input}
                  value={editData?.nuptk}
                  onChangeText={(text) => setEditData({ ...editData, nuptk: text })}
                  placeholder="Masukkan NUPTK"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alamat</Text>
                <TextInput
                  style={styles.input}
                  value={editData?.alamat}
                  onChangeText={(text) => setEditData({ ...editData, alamat: text })}
                  placeholder="Masukkan alamat"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.addSaveButton}
                onPress={() => handleAddPegawai(editData as Pegawai)}
              >
                <Text style={s`text-white font-bold`}>Simpan Pegawai</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit/View Modal (existing) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={s`bg-white rounded-2xl p-8 w-11/12 max-w-2xl`}>
            <Text style={s`text-xl font-bold mb-4`}>
              {isEditMode ? 'Detail Data Pegawai' : 'Tambah Data Pegawai'}
            </Text>

            <PegawaiForm
              editData={editData}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onClose={() => setModalVisible(false)}
              isEditMode={isEditMode}
            />
          </View>
        </View>
      </Modal>

      {/* Table */}
      <ScrollView
        horizontal
        style={s`flex-1`}
        showsHorizontalScrollIndicator={true}
      >
        <View style={{ minWidth: 650, flex: 1 }}>
          {/* Table Header */}
          <View style={s`flex-row items-center bg-gray-100 border-b-2 border-gray-200`}>
            <TouchableOpacity
              style={s`w-12 justify-center items-center py-3`}
              onPress={selectAll}
            >
              <View style={[
                s`w-5 h-5 border-2 rounded`,
                selected.length === pegawaiList.length && pegawaiList.length > 0
                  ? s`bg-green-600 border-green-600`
                  : s`border-gray-400 bg-white`
              ]}>
                {selected.length === pegawaiList.length && pegawaiList.length > 0 && (
                  <Ionicons name="checkmark" size={12} color="white" style={s`self-center mt-0.5`} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={s`w-40 text-gray-700 font-semibold text-sm px-2 text-center`}>Nama Pegawai</Text>
            <Text style={s`w-44 text-gray-700 font-semibold text-sm px-2 text-center`}>NIP</Text>
            <Text style={s`w-36 text-gray-700 font-semibold text-sm px-2 text-center`}>NIDN</Text>
            <Text style={s`w-36 text-gray-700 font-semibold text-sm px-2 text-center`}>NUPTK</Text>
            <Text style={s`w-36 text-gray-700 font-semibold text-sm px-2 text-center`}>Alamat</Text>
            <Text style={s`w-20 text-gray-700 font-semibold text-sm text-center`}>Aksi</Text>
          </View>

          {/* Table Content */}
          {loading ? (
            renderSkeletonItems()
          ) : currentData.length === 0 ? (
            <View style={s`flex-1 justify-center items-center py-20`}>
              <Ionicons name="people-outline" size={64} color="#9ca3af" />
              <Text style={s`text-gray-500 text-lg mt-4`}>Belum ada data pegawai</Text>
            </View>
          ) : (
            currentData.map((item, index) => (
              <View key={`pegawai-${item.id_pegawai}-${index}`}>
                {renderPegawaiItem({ item, index: startIndex + index })}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Pagination */}
      {pegawaiList.length > 0 && (
        <View style={s`border-t border-gray-200 bg-white px-4 py-3`}>
          <View style={s`flex-row justify-between items-center`}>
            <Text style={s`text-sm text-gray-700`}>
              {startIndex + 1} - {Math.min(endIndex, pegawaiList.length)} dari {pegawaiList.length}
            </Text>

            <View style={s`flex-row items-center`}>
              <TouchableOpacity
                style={[
                  s`px-3 py-2 rounded-lg border mr-2`,
                  currentPage === 1
                    ? s`border-gray-200 bg-gray-100`
                    : s`border-gray-300 bg-white`
                ]}
                onPress={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={currentPage === 1 ? "#9ca3af" : "#374151"}
                />
              </TouchableOpacity>

              <View style={s`flex-row items-center mx-2`}>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  if (totalPages <= 5) {
                    return (
                      <TouchableOpacity
                        key={`page-${pageNumber}`}
                        style={[
                          s`w-8 h-8 rounded-lg justify-center items-center mx-1`,
                          isCurrentPage
                            ? s`bg-green-600`
                            : s`bg-gray-100`
                        ]}
                        onPress={() => goToPage(pageNumber)}
                      >
                        <Text style={[
                          s`text-sm font-medium`,
                          isCurrentPage ? s`text-white` : s`text-gray-700`
                        ]}>
                          {pageNumber}
                        </Text>
                      </TouchableOpacity>
                    );
                  } else {
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <TouchableOpacity
                          key={`page-${pageNumber}`}
                          style={[
                            s`w-8 h-8 rounded-lg justify-center items-center mx-1`,
                            isCurrentPage
                              ? s`bg-green-600`
                              : s`bg-gray-100`
                          ]}
                          onPress={() => goToPage(pageNumber)}
                        >
                          <Text style={[
                            s`text-sm font-medium`,
                            isCurrentPage ? s`text-white` : s`text-gray-700`
                          ]}>
                            {pageNumber}
                          </Text>
                        </TouchableOpacity>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <Text key={`ellipsis-${pageNumber}`} style={s`text-gray-400 mx-1`}>
                          ...
                        </Text>
                      );
                    }
                  }
                  return null;
                })}
              </View>

              <TouchableOpacity
                style={[
                  s`px-3 py-2 rounded-lg border ml-2`,
                  currentPage === totalPages
                    ? s`border-gray-200 bg-gray-100`
                    : s`border-gray-300 bg-white`
                ]}
                onPress={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={currentPage === totalPages ? "#9ca3af" : "#374151"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addModalScrollView: {
    maxHeight: '85%', // Adjust as needed to leave space for title and button
  },
  addSaveButton: {
    backgroundColor: '#088904',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
});