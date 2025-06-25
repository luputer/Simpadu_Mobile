import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import axiosInstance from "../lib/axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PresensiLog {
  id: number;
  tanggal: string;
  status: string;
  jam_masuk?: string;
  jam_pulang?: string;
  keterangan_izin?: string;
}

export default function Presensi() {
  const [logMasuk, setLogMasuk] = useState<PresensiLog[]>([]);
  const [logPulang, setLogPulang] = useState<PresensiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresensi = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ambil userData dari AsyncStorage
        const storedUserData = await AsyncStorage.getItem('userData');
        if (!storedUserData) throw new Error('User belum login');
        const userData = JSON.parse(storedUserData);
        const id_pegawai = userData?.pegawai?.id_pegawai || userData?.pegawai?.id || userData?.id_pegawai || userData?.id;
        if (!id_pegawai) throw new Error('ID Pegawai tidak ditemukan');
        // Fetch presensi dari endpoint backend lokal
        const res = await axiosInstance.get(`/api/presensi?id_pegawai=${id_pegawai}`);
        // Helper untuk format tanggal dan jam
        function formatTanggal(tanggal: string) {
          const d = new Date(tanggal);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        }
        function formatJam(jam: string | null) {
          if (!jam) return '-';
          // Jika jam format ISO, ambil jam dan menit
          const date = new Date(jam);
          if (!isNaN(date.getTime())) {
            const h = String(date.getHours()).padStart(2, '0');
            const m = String(date.getMinutes()).padStart(2, '0');
            return `${h}:${m}`;
          }
          // Jika string biasa (misal '08:00:00'), ambil 5 karakter pertama
          return jam.length >= 5 ? jam.slice(0, 5) : jam;
        }
        const data: PresensiLog[] = res.data.presensi.map((item: any) => ({
          id: item.id_presensi,
          tanggal: formatTanggal(item.tanggal),
          status: item.status,
          jam_masuk: formatJam(item.jam_masuk),
          jam_pulang: formatJam(item.jam_keluar),
          keterangan_izin: item.keterangan_izin,
        }));
        setLogMasuk(data.filter(item => item.status === "Hadir" || item.status === "Izin"));
        setLogPulang(data.filter(item => item.status === "Pulang"));
      } catch (err: any) {
        setError("Gagal memuat data presensi");
      } finally {
        setLoading(false);
      }
    };
    fetchPresensi();
  }, []);

  return (
    <ScrollView style={styles.bg}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Presensi</Text>
        <Text style={styles.subtitle}>Pendataan Presensi anda.</Text>
      </View>

      <Text style={styles.sectionMasuk}>Log Presensi Masuk</Text>
      <View style={styles.tableContainer}>
        <TablePresensi
          data={logMasuk}
          loading={loading}
          error={error}
          type="masuk"
        />
      </View>

      <Text style={styles.sectionPulang}>Log Presensi Pulang</Text>
      <View style={styles.tableContainer}>
        <TablePresensi
          data={logPulang}
          loading={loading}
          error={error}
          type="pulang"
        />
      </View>
    </ScrollView>
  );
}

function TablePresensi({ data, loading, error, type }: { data: PresensiLog[]; loading: boolean; error: string | null; type: "masuk" | "pulang" }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableRowHeader}>
        <Text style={styles.th}>No</Text>
        <Text style={styles.th}>Tanggal</Text>
        <Text style={styles.th}>Status</Text>
        <Text style={styles.th}>{type === "masuk" ? "Jam Masuk" : "Jam Pulang"}</Text>
        <Text style={styles.th}>Keterangan</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={{ margin: 16 }} color="#088904" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.empty}>No data available</Text>
      ) : (
        data.map((item, idx) => (
          <View style={styles.tableRow} key={item.id}>
            <Text style={styles.td}>{idx + 1}</Text>
            <Text style={styles.td}>{item.tanggal}</Text>
            <Text style={[styles.td, item.status === 'Hadir' ? styles.statusHadir : item.status === 'Izin' ? styles.statusIzin : styles.statusPulang]}>{item.status}</Text>
            <Text style={styles.td}>{type === "masuk" ? (item.status === "Hadir" ? item.jam_masuk : "-") : item.jam_pulang || "-"}</Text>
            <Text style={styles.td}>{item.status === "Izin" ? item.keterangan_izin || "-" : "-"}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: '#088904', paddingTop: 36, paddingBottom: 24, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 16 },
  title: { color: "#fff", fontSize: 24, fontWeight: "semibold", marginBottom: 4, textAlign: 'center' },
  subtitle: { color: "#E8F5E9", fontSize: 16, marginBottom: 0, textAlign: 'center' },
  sectionMasuk: { color: "#088904", fontWeight: "semibold", fontSize: 18, marginTop: 16, marginBottom: 8, marginLeft: 8 },
  sectionPulang: { color: "#088904", fontWeight: "semibold", fontSize: 18, marginTop: 32, marginBottom: 8, marginLeft: 8 },
  tableContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 8, marginBottom: 16, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  table: {},
  tableRowHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E8F5E9", paddingVertical: 8, backgroundColor: '#E8F5E9', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f5f5f5", paddingVertical: 8 },
  th: { flex: 1, color: "#088904", fontWeight: "semibold", fontSize: 12, textAlign: "center" },
  td: { flex: 1, color: "#333", fontSize: 10, textAlign: "center" },
  error: { color: "#dc2626", textAlign: "center", margin: 12 },
  empty: { color: "#888", textAlign: "center", margin: 12 },
  statusHadir: { color: '#088904', fontWeight: 'semibold' },
  statusIzin: { color: '#FFA500', fontWeight: 'semibold' },
  statusPulang: { color: '#333', fontWeight: 'semibold' },
});