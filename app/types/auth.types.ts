export interface PegawaiDetail {
    id: number;
    nip: string;
    nama: string;
    status: string;
    jk: number;
    alamat: string;
    email_poliban: string;
    foto: string;
    gol_darah: number;
    handphone: string;
    id_agama: number;
    id_bagian: number;
    id_jabatan_fungsional: number;
    id_jabatan_struktural: number;
    id_jurusan: number;
    id_kabupaten: string;
    id_pendidikan: string;
    id_prodi: number;
    id_prov: string;
    id_status_hidup: string;
    id_status_pegawai: number;
    id_wil: string;
    kode_pos: string;
    kota: string;
    nidn: string;
    NUPTK: string;
    no_kk: string;
    no_ktp: string;
    tempat_lahir: string;
    tgl_lahir: Date | null;
    simpeg_jabatan_struktural: {
        id_jabatan_struktural: number;
        nama_jabatan_struktural: string;
    } | null;
    simpeg_jabatan_fungsional: {
        id_jabatan_fungsional: number;
        nama_jabatan_fungsional: string;
    } | null;
    simpeg_riwayat_pendidikan: Array<{
        id_riwayat_pendidikan: number;
        id_pegawai: number;
        thn_masuk: number;
        thn_lulus: number;
        tempat: string;
        simpeg_level_pendidikan: {
            id_level_pendidikan: number;
            nama_level_pendidikan: string;
        };
    }> | null;
}

export interface UserLoginData {
    id: number;
    username: string;
    role: number;
    nama: string;
    pegawai: PegawaiDetail;
}

export interface User {
    id: number;
    nip: string;
    nama: string;
    email: string;
    role: number;
    pegawaiId: number;
    gol_darah: number;
    handphone: string;
    id_agama: number;
    id_bagian: number;
    id_jabatan_fungsional: number;
    id_jabatan_struktural: number;
    id_jurusan: number;
    id_kabupaten: string;
    id_pendidikan: string;
    id_prodi: number;
    id_prov: string;
    id_status_hidup: string;
    id_status_pegawai: number;
    id_wil: string;
    kode_pos: string;
    kota: string;
    nidn: string;
}

export interface UserData {
    email: string;
    id_kelas_mk: number[];
    id_user: number;
    nip: string;
    role: 'Dosen' | 'adminpegawai';
}

export interface LoginResponse {
    user: UserData;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
} 