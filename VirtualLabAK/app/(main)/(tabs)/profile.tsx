import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MainScreenLayout } from '@/components/MainScreenLayout';
import { saveObject, loadObject } from '@/utils/storage';

type Gender = 'L' | 'P' | '';

type Profile = {
    nama: string;
    nim: string;
    kelas: string;
    gender: Gender;
  };

export default function ProfileTab() {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [kelas, setKelas] = useState('');
  const [gender, setGender] = useState<Gender>('');

  useEffect(() => {
    loadObject<Profile>('profile', {
      nama: '',
      nim: '',
      kelas: '',
      gender: '',
    }).then((p) => {
      setNama(p.nama);
      setNim(p.nim);
      setKelas(p.kelas);
      setGender(p.gender);
    });
  }, []);

  const onSave = async () => {
    const profile: Profile = { nama, nim, kelas, gender };
    await saveObject('profile', profile);
    console.log('profile saved', profile);
  };

  const onLogout = async () => {
    await saveObject('profile', { nama: '', nim: '', kelas: '', gender: '' });
    setNama('');
    setNim('');
    setKelas('');
    setGender('');
    console.log('logout & clear profile');
  };

  const avatarColor =
    gender === 'P' ? '#F973A4' : gender === 'L' ? '#60A5FA' : '#D1D5DB';

  return (
    <MainScreenLayout title="Profile">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={[styles.avatarBox, { borderColor: avatarColor + '66' }]}>
            <View
              style={[styles.avatarCircle, { backgroundColor: avatarColor }]}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              value={nama}
              onChangeText={setNama}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>NIM</Text>
            <TextInput
              style={styles.input}
              placeholder="8 digit NIM"
              value={nim}
              onChangeText={(v) =>
                setNim(v.replace(/[^0-9]/g, '').slice(0, 8))
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Kelas</Text>
            <TextInput
              style={styles.input}
              placeholder="Pilih Kelas"
              value={kelas}
              onChangeText={setKelas}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              <Pressable
                style={[
                  styles.genderChip,
                  gender === 'P' && styles.genderChipActivePink,
                ]}
                onPress={() => setGender('P')}>
                <Text
                  style={[
                    styles.genderChipText,
                    gender === 'P' && styles.genderChipTextActive,
                  ]}>
                  Perempuan
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.genderChip,
                  gender === 'L' && styles.genderChipActiveBlue,
                ]}
                onPress={() => setGender('L')}>
                <Text
                  style={[
                    styles.genderChipText,
                    gender === 'L' && styles.genderChipTextActive,
                  ]}>
                  Laki-laki
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.btnSave} onPress={onSave}>
            <Text style={styles.btnSaveText}>Simpan Profil</Text>
          </Pressable>
        </View>

        <Pressable style={styles.btnLogout} onPress={onLogout}>
          <Text style={styles.btnLogoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    marginBottom: 18,
  },
  avatarBox: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    color: '#111827',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    backgroundColor: '#ffffff',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  genderChipActivePink: {
    borderColor: '#F973A4',
    backgroundColor: '#FCE7F3',
  },
  genderChipActiveBlue: {
    borderColor: '#60A5FA',
    backgroundColor: '#DBEAFE',
  },
  genderChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  genderChipTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  btnSave: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: '#00A89B',
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnSaveText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnLogout: {
    borderRadius: 999,
    backgroundColor: '#DC2626',
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnLogoutText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});