/**
 * Wilayah Administratif Kota Bengkulu (9 Kecamatan & Kelurahan Utama)
 * Digunakan untuk pendaftaran domisili warga & pemetaan laporan TRACE.
 */

export interface KecamatanBengkulu {
  nama: string;
  kelurahan: string[];
}

export const KECAMATAN_BENGKULU: KecamatanBengkulu[] = [
  {
    nama: 'Ratu Samban',
    kelurahan: [
      'Lempuing',
      'Belakang Pondok',
      'Anggut Atas',
      'Anggut Bawah',
      'Pengantungan',
      'Kebun Dahri',
      'Penurunan',
      'Padang Jati',
      'Kebun Geran',
    ],
  },
  {
    nama: 'Ratu Agung',
    kelurahan: [
      'Nusa Indah',
      'Tanah Patah',
      'Kebun Beler',
      'Kebun Tebeng',
      'Sawah Lebar',
      'Sawah Lebar Baru',
    ],
  },
  {
    nama: 'Gading Cempaka',
    kelurahan: [
      'Padang Harapan',
      'Jalan Gedang',
      'Panorama',
      'Dusun Besar',
      'Lingkar Barat',
    ],
  },
  {
    nama: 'Selebar',
    kelurahan: [
      'Pagar Dewa',
      'Sukarami',
      'Pekan Sabtu',
      'Betungan',
      'Bumi Ayu',
    ],
  },
  {
    nama: 'Muara Bangkahulu',
    kelurahan: [
      'Bentiring',
      'Bentiring Permai',
      'Kandang Limun',
      'Beringin Raya',
      'Pematang Gubernur',
      'Rawa Makmur',
      'Rawa Makmur Permai',
    ],
  },
  {
    nama: 'Sungai Serut',
    kelurahan: [
      'Surabaya',
      'Pasar Bengkulu',
      'Semarang',
      'Tanjung Agung',
      'Tanjung Jaya',
      'Sukamerindu',
    ],
  },
  {
    nama: 'Teluk Segara',
    kelurahan: [
      'Berkas',
      'Kebun Ros',
      'Pasar Melayu',
      'Malabero',
      'Pasar Baru',
      'Bajak',
      'Pondok Besi',
      'Sumur Melele',
      'Pintu Batu',
      'Tengah Padang',
      'Kampung Bali',
    ],
  },
  {
    nama: 'Kampung Melayu',
    kelurahan: [
      'Sumber Jaya',
      'Kandang',
      'Padang Serai',
      'Teluk Sepang',
      'Muara Dua',
    ],
  },
  {
    nama: 'Singaran Pati',
    kelurahan: [
      'Padang Nangka',
      'Jembatan Kecil',
      'Lingkar Timur',
    ],
  },
];
