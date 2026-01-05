import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { loadObject, saveObject } from "@/utils/storage";

type TaskItem = {
  id: string;
  title: string;
  deadline: string;
  description: string;
};

const TASKS: TaskItem[] = [
  {
    id: "1",
    title: "Tugas 1 - Jurnal Mingguan",
    deadline: "19/12/2025",
    description:
      "Buatlah refleksi ibadah minggu ini (200–300 kata) dan unggah dalam format PDF/DOCX.",
  },
  {
    id: "2",
    title: "Tugas 2 - Siapakah Kristus",
    deadline: "05/01/2026",
    description:
      "Tuliskan esai singkat mengenai siapakah Kristus menurut pemahamanmu (min. 300 kata).",
  },
  {
    id: "3",
    title: "Tugas 3 - Refleksi Diri",
    deadline: "10/01/2026",
    description:
      "Tuliskan refleksi pribadi tentang perjalanan imanmu selama mengikuti kelas ini.",
  },
];

type TaskStatusMap = Record<string, "submitted" | "unanswered">;

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const task = TASKS.find((t) => t.id === id);

  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!task) {
      router.replace("/(main)/tugas");
    }
  }, [task, router]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setFileName(file.name ?? "File terpilih");
    } catch (e) {
      Alert.alert("Error", "Gagal memilih file.");
    }
  };

  const onSubmit = async () => {
    if (!fileName) {
      Alert.alert("Upload dulu", "Silakan upload file jawaban terlebih dahulu.");
      return;
    }

    try {
      setSubmitting(true);
      const current = await loadObject<TaskStatusMap>("task-status", {});
      const next: TaskStatusMap = { ...current, [id!]: "submitted" };
      await saveObject("task-status", next);

      Alert.alert("Berhasil", "Jawaban tugas berhasil dikirim.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (e) {
      Alert.alert("Error", "Gagal mengirim jawaban.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <MainScreenLayout title="Tugas" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.deadlineLabel}>Deadline: {task.deadline}</Text>

          <View style={styles.separator} />

          <Text style={styles.description}>{task.description}</Text>

          <Text style={styles.uploadLabel}>Upload Answer</Text>

          <Pressable style={styles.uploadBox} onPress={pickFile}>
            <View style={styles.uploadInner}>
              {/* bisa ganti dengan icon kamera/file dari assets */}
              <Text style={styles.uploadIcon}>📄</Text>
              <Text style={styles.uploadText}>
                {fileName ? fileName : "Drop File atau Klik di sini"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={onSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && Platform.OS === "ios" && { opacity: 0.7 },
            ]}
            disabled={submitting}
          >
            <Text style={styles.submitText}>
              {submitting ? "Submitting..." : "Submit"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const RADIUS = 14;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  taskTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#111827",
  },
  deadlineLabel: {
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#9CA3AF",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#111827",
    marginBottom: 16,
  },
  uploadLabel: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: "#111827",
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  uploadInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadIcon: {
    fontSize: 26,
    color: "#0B8A8B",
  },
  uploadText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#0EA5A6",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});