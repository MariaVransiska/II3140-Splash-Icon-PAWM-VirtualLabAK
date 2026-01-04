import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MainScreenLayout } from '@/components/MainScreenLayout';
import { saveObject, loadObject } from "@/utils/storage";

export default function JournalTab() {
  const [text, setText] = useState('');

  useEffect(() => {
    loadObject<string>("journal-latest", "").then(setText);
  }, []);

  const onSave = async () => {
    await saveObject("journal-latest", text);
    console.log("journal saved");
  };

  const onClear = async () => {
    setText("");
    await saveObject("journal-latest", "");
  };

  return (
    <MainScreenLayout title="Journal">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Jurnal Harian</Text>

          <View style={styles.dashedBox}>
            <TextInput
              style={styles.textArea}
              multiline
              textAlignVertical="top"
              placeholder="Tuliskan doa, catatan rohani, atau notes kelas"
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.btnPrimary} onPress={onSave}>
              <Text style={styles.btnText}>Simpan</Text>
            </Pressable>
            <Pressable
              style={[styles.btnPrimary, styles.btnDanger]}
              onPress={onClear}>
              <Text style={styles.btnText}>Hapus</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  dashedBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    borderColor: '#D1D5DB',
    padding: 10,
    marginBottom: 14,
    minHeight: 260,
  },
  textArea: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrimary: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#00A89B',
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: '#DC2626',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});