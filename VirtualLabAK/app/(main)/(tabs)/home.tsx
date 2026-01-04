import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/components/MainScreenLayout';

export default function HomeTab() {
  const router = useRouter();

  return (
    <MainScreenLayout title="VirtualLabAK">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Overview Materi:</Text>
            <Text style={styles.cardSub}>Siapakah Kristus</Text>
            <Image
              source={require('@/assets/images/Gambar Materi.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.cardSmall}>
            <Text style={styles.cardTitle}>Ayat Alkitab Harian</Text>
            <Text style={styles.cardBody}>
              Matius 11:28 - Marilah kepada-Ku, semua yang letih lesu dan
              berbeban berat, Aku akan memberi kelegaan kepadamu.
            </Text>
          </View>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.cardTitle}>Assignments This Week:</Text>
          <Text style={styles.assignItem}>● xxxxxxx</Text>
          <Text style={styles.assignItem}>● xxxxxxx</Text>
          <Text style={styles.assignItem}>● xxxxxxx</Text>
        </View>

        <View style={styles.menuRow}>
          <Pressable
            style={styles.menuTile}
            onPress={() => router.push('/(main)/materi')}>
            <Text style={styles.menuText}>Materi &amp; Video</Text>
          </Pressable>
          <Pressable
            style={styles.menuTile}
            onPress={() => router.push('/(main)/tugas')}>
            <Text style={styles.menuText}>Tugas</Text>
          </Pressable>
        </View>

        <View style={styles.menuRow}>
          <Pressable
            style={styles.menuTile}
            onPress={() => router.push('/(main)/quiz')}>
            <Text style={styles.menuText}>Quiz</Text>
          </Pressable>
          <Pressable
            style={styles.menuTile}
            onPress={() => router.push('/(main)/progress')}>
            <Text style={styles.menuText}>Progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  cardSmall: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
  },
  cardBody: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  cardWide: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  assignItem: {
    fontSize: 13,
    marginTop: 6,
  },
  menuRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  menuTile: {
    flex: 1,
    height: 96,
    borderRadius: 18,
    backgroundColor: '#00A89B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});