import React from 'react';

// Basic types
export interface JK {
    id_jk: string;
    nama_jk: string;
}

export interface Agama {
    id_agama: number;
    nama_agama: string;
}

export interface Darah {
    id_darah: string;
    nama_darah: string;
}

export interface Pendidikan {
    id_pendidikan: number;
    nama_pendidikan: string;
}

export interface StatusHidup {
    id_status_hidup: string;
    nama_status_hidup: string;
}

export interface Wilayah {
    id_wil: string;
    nama_wil: string;
}

export interface Kabupaten {
    id_kabupaten: number;
    nama_kabupaten: string;
}

export interface Provinsi {
    id_provinsi: number;
    nama_provinsi: string;
}

export interface JabatanStruktural {
    id_jabatan_struktural: number;
    nama_jabatan_struktural: string;
}

export interface JabatanFungsional {
    id_jabatan_fungsional: number;
    nama_jabatan_fungsional: string;
}

export interface StatusPegawai {
    id_status_pegawai: number;
    nama_status_pegawai: string;
}

export interface Jurusan {
    id_jurusan: number;
    nama_jurusan: string;
}

export interface Bagian {
    id_bagian: number;
    nama_bagian: string;
}

export interface Prodi {
    id_prodi: number;
    nama_prodi: string;
}

export interface PangkatGolRuang {
    id_pangkat_gol_ruang: number;
    nama_pangkat_gol_ruang: string;
}

export interface RiwayatPangkat {
    id_riwayat_pangkat: number;
    id_pegawai: number;
    id_pangkat_gol_ruang: number;
    tmt_pangkat: string;
    simpeg_pangkat_gol_ruang: PangkatGolRuang;
}

export interface LevelPendidikan {
    id_level_pendidikan: number;
    nama_level_pendidikan: string;
}

export interface RiwayatPendidikan {
    id_riwayat_pendidikan: number;
    id_pegawai: number;
    id_level_pendidikan: number;
    thn_masuk: string;
    thn_lulus: string;
    tempat: string;
    simpeg_level_pendidikan: LevelPendidikan;
}

// Main Pegawai type
export interface Pegawai {
    id_pegawai: number;
    nama_pegawai: string;
    nip: string;
    nidn: string;
    nuptk: string;
    alamat: string;
    foto: string;
}

// Type untuk update data pegawai (tanpa relasi)
export interface PegawaiUpdate {
    nama_pegawai?: string;
    jk?: number;
    id_agama?: number;
    tempat_lahir?: string;
    tgl_lahir?: Date;
    nidn?: string;
    nip?: string;
    nuptk?: string;
    no_ktp?: string;
    no_kk?: string;
    gol_darah?: number;
    id_pendidikan?: string;
    id_status_hidup?: string;
    kota?: string;
    kode_pos?: string;
    id_wil?: string;
    id_kabupaten?: string;
    id_prov?: string;
    handphone?: string;
    email_poliban?: string;
    id_jabatan_struktural?: number;
    id_jabatan_fungsional?: number;
    id_status_pegawai?: number;
    id_jurusan?: number;
    id_bagian?: number;
    id_prodi?: number;
}

// Interface untuk tampilan riwayat pangkat
export interface RiwayatPangkatDisplay {
    nama_pangkat_gol_ruang: string;
}

// Interface untuk tampilan riwayat pendidikan
export interface RiwayatPendidikanDisplay {
    thn_masuk: string;
    thn_lulus: string;
    tempat: string;
    nama_level_pendidikan: string;
}

// Interface untuk data edit pegawai
export interface PegawaiEditData {
    id_pegawai?: number;
    nama_pegawai?: string;
    nip?: string;
    nidn?: string;
    nuptk?: string;
    alamat?: string;
    foto?: string;
}

// Default export untuk memenuhi persyaratan route
const PegawaiTypes = () => {
    return null;
};

export default PegawaiTypes;


