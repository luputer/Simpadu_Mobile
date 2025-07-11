import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosInstance from '../lib/axios';
import { UserLoginData } from '../types/auth.types';

// Skeleton Loader Component
const SkeletonLoader = ({ width = 100, height = 20, style = {} }: { width?: number | string; height?: number; style?: object }) => (
    <View style={[{ width, height, backgroundColor: '#e0e0e0', borderRadius: 4 }, style]} />
);

function formatTanggalWaktu(date: Date) {
    const hari = [
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    ];
    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const h = hari[date.getDay()];
    const t = date.getDate();
    const b = bulan[date.getMonth()];
    const y = date.getFullYear();
    const jam = date.toLocaleTimeString('id-ID', { hour12: false });
    return `${h}, ${t} ${b} ${y} — ${jam}`;
}

export default function Dashbord() {
    const [modalVisible, setModalVisible] = useState(false);
    const [userData, setUserData] = useState<UserLoginData | any>(null);
    const [loading, setLoading] = useState(true);
    // const [absenKeluar, setAbsenKeluar] = useState(false);
    const [modalPresensi, setModalPresensi] = useState(false);
    const [loadingPresensi, setLoadingPresensi] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [jadwal, setJadwal] = useState([]);
    const [loadingJadwal, setLoadingJadwal] = useState(true);
    const [loadingMulai, setLoadingMulai] = useState({});
    const [sudahDimulai, setSudahDimulai] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error("Failed to load user data:", error);
                Alert.alert("Error", "Gagal memuat data pengguna.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchJadwal = async () => {
            if (!userData?.id_pegawai) {
                setJadwal([]);
                return;
            }
            try {
                setLoadingJadwal(true);
                const res = await fetch(`https://ti054d02.agussbn.my.id/api/pegawai/proxy-jadwal/${userData.id_pegawai}`);
                const data = await res.json();
                setJadwal(data || []);
            } catch {
                setJadwal([]);
            } finally {
                setLoadingJadwal(false);
            }
        };
        fetchJadwal();
    }, [userData?.id_pegawai]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            router.replace('/auth/login');
        } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
            console.error("Logout error:", error);
        }
    };

    const handlePresensi = async (status: 'Hadir' | 'Pulang' | 'Izin') => {
        setLoadingPresensi(true);
        try {
            if (!userData || !userData.id_pegawai) {
                Alert.alert('Gagal', 'Data pegawai tidak ditemukan.');
                setLoadingPresensi(false);
                return;
            }
            const now = new Date();
            const tanggal = now.toISOString().slice(0, 10); // "2025-06-26"
            let payload: any = {
                id_pegawai: userData.id_pegawai,
                status,
                tanggal,
            };

            if (status === 'Hadir') {
                payload.jam_masuk =  // format ISO
                    payload.jam_keluar = null;
                payload.keterangan_izin = null;
            } else if (status === 'Pulang') {
                payload.jam_masuk = null;
                payload.jam_keluar = now.toISOString(); // format ISO
                payload.keterangan_izin = null;
            } else if (status === 'Izin') {
                payload.jam_masuk = now.toISOString();
                payload.jam_keluar = now.toISOString();
                payload.keterangan_izin = 'Izin';
            }

            await axiosInstance.post('/api/presensi', payload);
            Alert.alert('Sukses', `Presensi ${status} berhasil!`);
            setModalPresensi(false);
        } catch (error: any) {
            Alert.alert('Gagal', error?.message || 'Gagal presensi');
        } finally {
            setLoadingPresensi(false);
        }
    };

    const handleMulai = async (id_kelas_mk: any) => {
        setLoadingMulai((prev) => ({ ...prev, [id_kelas_mk]: true }));
        try {
            const res = await fetch('https://ti054d02.agussbn.my.id/api/pegawai/proxy-buka', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_pegawai: userData.id_pegawai,
                    id_kelas_mk,
                }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Gagal memulai perkuliahan!');
            }
            Alert.alert('Sukses', 'Perkuliahan dimulai!');
            setSudahDimulai((prev) => [...prev, id_kelas_mk]);
        } catch (err) {
            Alert.alert('Error', err.message || 'Gagal memulai perkuliahan!');
        } finally {
            setLoadingMulai((prev) => ({ ...prev, [id_kelas_mk]: false }));
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Jadwal Mengajar</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#888' }}>
                    {formatTanggalWaktu(currentTime)}
                </Text>
                {/* <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 14 }}>
                    Selamat Datang! {userData?.nama_lengkap || 'User'}
                </Text> */}
            </View>

            <View style={styles.profileCard}>
                {loading ? (
                    <View style={styles.profileInfo}>
                        <SkeletonLoader width={200} height={24} style={styles.skeletonProfileName} />
                        <SkeletonLoader width={150} height={18} style={styles.skeletonProfileRole} />
                    </View>
                ) : (
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userData?.nama_lengkap || 'Dosen 123'}</Text>
                        <Text style={styles.profileRole}>{userData?.pegawai?.simpeg_jabatan_struktural?.nama_jabatan_struktural || userData?.pegawai?.simpeg_jabatan_fungsional?.nama_jabatan_fungsional || 'Jabatan Tidak Diketahui'}</Text>
                    </View>
                )}
                <View style={styles.profileImage}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} disabled={loading}>
                        {loading ? (
                            <SkeletonLoader width={40} height={40} style={{ borderRadius: 20 }} />
                        ) : (
                            <Ionicons name="person" size={40} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        {loading ? (
                            <View>
                                <SkeletonLoader width={150} height={20} style={styles.skeletonModalName} />
                                <SkeletonLoader width={200} height={16} style={styles.skeletonModalEmail} />
                            </View>
                        ) : (
                            <>
                                <Text style={styles.modalName}>{userData?.nama || 'Belum ada'}</Text>
                                <Text style={styles.modalEmail}>{userData?.pegawai?.email_poliban || 'belumada@gmail.com'}</Text>
                            </>
                        )}
                        <TouchableOpacity style={styles.modalButton}
                            onPress={() => router.push('/account')}>
                            <Ionicons name="person-circle-outline" size={24} color="#333" />
                            <Text style={styles.modalButtonText}>My Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Jadwal Mengajar</Text>
                {loadingJadwal ? (
                    <Text>Memuat jadwal...</Text>
                ) : jadwal.length === 0 ? (
                    <Text>Tidak ada jadwal ditemukan.</Text>
                ) : (
                    jadwal.map((item) => (
                        <View key={item.id_kelas_mk} style={styles.scheduleCard}>
                            <Text style={styles.courseTitle}>{item.nama_mk}</Text>
                            <Text>Kelas: {item.nama_kelas}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.startButton,
                                    sudahDimulai.includes(item.id_kelas_mk) && { opacity: 0.6 }
                                ]}
                                onPress={() => handleMulai(item.id_kelas_mk)}
                                disabled={!!loadingMulai[item.id_kelas_mk] || sudahDimulai.includes(item.id_kelas_mk)}
                            >
                                <Text style={styles.startButtonText}>
                                    {loadingMulai[item.id_kelas_mk]
                                        ? 'Memulai...'
                                        : sudahDimulai.includes(item.id_kelas_mk)
                                            ? 'Mata kuliah sudah dimulai!'
                                            : 'Mulai Perkuliahan'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            <ScrollView style={styles.content}>
                {/* Class Schedule Cards */}
                <View style={styles.scheduleCard}>
                    <View style={styles.scheduleHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="school" size={24} color="#088904" />
                        </View>
                        <View style={styles.scheduleInfo}>
                            <Text style={styles.courseTitle}>Pesensi dosen</Text>
                            <Text style={styles.courseCode}>Matkul 1</Text>
                        </View>
                    </View>

                    <View style={styles.scheduleDetails}>
                        <View style={styles.detailItem}>
                            <Ionicons name="location" size={20} color="#666" />
                            <Text style={styles.detailText}>Ruang 1</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="time" size={20} color="#666" />
                            <Text style={styles.detailText}>08.00-10.00</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="people" size={20} color="#666" />
                            <Text style={styles.detailText}>Pertemuan 8 dari 16</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => setModalPresensi(true)}
                    >
                        <Text style={styles.startButtonText}>Presensi</Text>
                        <Ionicons name="alarm" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Add more schedule cards here */}
            </ScrollView>

            <Modal
                transparent
                visible={modalPresensi}
                animationType="slide"
                onRequestClose={() => setModalPresensi(false)}
            >
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <View style={{
                        backgroundColor: 'white', borderRadius: 12, padding: 24, width: '80%', alignItems: 'center', position: 'relative'
                    }}>
                        <TouchableOpacity
                            onPress={() => setModalPresensi(false)}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Pilih Jenis Presensi</Text>
                        <TouchableOpacity
                            style={[styles.startButton, { backgroundColor: '#088904', marginBottom: 12 }]}
                            disabled={loadingPresensi}
                            onPress={() => handlePresensi('Hadir')}
                        >
                            <Text style={styles.startButtonText}>Presensi Masuk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.startButton, { backgroundColor: '#1e40af', marginBottom: 12 }]}
                            disabled={loadingPresensi}
                            onPress={() => handlePresensi('Pulang')}
                        >
                            <Text style={styles.startButtonText}>Presensi Pulang</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.startButton, { backgroundColor: '#b45309' }]}
                            disabled={loadingPresensi}
                            onPress={() => handlePresensi('Izin')}
                        >
                            <Text style={styles.startButtonText}>Izin</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Add these styles for the modal
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    profileCard: {
        backgroundColor: '#088904',
        margin: 15,
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileRole: {
        color: 'white',
        opacity: 0.8,
    },
    profileImage: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        paddingLeft: 15,
    },
    statCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: 160,
        marginRight: 10,
    },
    selengkapnyaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        padding: 5,
    },
    selengkapnyaText: {
        color: '#088904',
        fontSize: 12,
        marginRight: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
    },
    notificationSection: {
        backgroundColor: 'white',
        margin: 15,
        padding: 15,
        borderRadius: 10,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    notificationLink: {
        color: '#088904',
        fontSize: 12,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9e6',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    notificationText: {
        flex: 1,
        marginLeft: 10,
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    scheduleCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        backgroundColor: '#E8F5E9',
        padding: 10,
        borderRadius: 12,
        marginRight: 12,
    },
    scheduleInfo: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    courseCode: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    scheduleDetails: {
        marginBottom: 15,
        gap: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: '#666',
        fontSize: 14,
    },
    startButton: {
        backgroundColor: '#088904',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    startButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: 8,
        padding: 8
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    modalSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    logoutButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#333',
    },
    // Skeleton styles
    skeletonProfileName: {
        marginBottom: 8,
        borderRadius: 4,
        height: 24,
    },
    skeletonProfileRole: {
        height: 18,
        borderRadius: 4,
    },
    skeletonModalName: {
        marginBottom: 5,
        borderRadius: 4,
        height: 20,
    },
    skeletonModalEmail: {
        marginBottom: 15,
        borderRadius: 4,
        height: 16,
    },
});