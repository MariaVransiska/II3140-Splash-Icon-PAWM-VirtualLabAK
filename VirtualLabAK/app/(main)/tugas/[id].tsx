import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { saveObject, loadObject } from "@/utils/storage";

type TaskStatusMap = Record<string, "submitted" | "unanswered">;
type TaskDetail = {
  id: string;
  title: string;
  deadline: string;
  instruction: string;
};

const TASK_DETAILS: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Tugas 1 - Jurnal Mingguan",
    deadline: "19/12/2025",
    instruction:
      "Buatlah refleksi ibadah minggu ini (200–300 kata) dan unggah dalam format PDF/DOCX.",
  },
  "2": {
    id: "2",
    title: "Tugas 2 - Siapakah Kristus",
    deadline: "05/01/2026",
    instruction:
      "Jelaskan konsep Kristologi dasar menurut pemahamanmu, disertai minimal satu ayat pendukung.",
  },
  "3": {
    id: "3",
    title: "Tugas 3 - Refleksi Diri",
    deadline: "10/01/2026",
    instruction:
      "Tuliskan refleksi pribadi tentang perjalanan imanmu selama satu semester ini.",
  },
};

export default function TugasDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const taskId = id ?? "1";
  
    const task = TASK_DETAILS[taskId] ?? TASK_DETAILS["1"];
  
    const onPickFile = () => {
      console.log("pick file");
    };
  
    const onSubmit = async () => {
      const current = await loadObject<TaskStatusMap>("task-status", {});
      const next: TaskStatusMap = { ...current, [taskId]: "submitted" };
      await saveObject("task-status", next);
      console.log("submit tugas:", taskId);
    };

  return (
    <MainScreenLayout title="Tugas" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.deadline}>
            Deadline: {task.deadline}
          </Text>

          <Text style={styles.instruction}>{task.instruction}</Text>

          <Text style={styles.sectionLabel}>Upload Answer</Text>

          <Pressable style={styles.uploadBox} onPress={onPickFile}>
            <Ionicons name="camera-outline" size={32} color="#00A89B" />
            <Text style={styles.uploadText}>
              Drop File atau Klik di sini
            </Text>
          </Pressable>

          <Pressable style={styles.submitBtn} onPress={onSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  deadline: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 18,
    borderColor: "#D1D5DB",
    paddingVertical: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  submitBtn: {
    borderRadius: 16,
    backgroundColor: "#00A89B",
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});