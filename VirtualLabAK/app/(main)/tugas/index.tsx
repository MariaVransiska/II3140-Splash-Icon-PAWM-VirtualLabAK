import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { useRouter } from "expo-router";
import { loadObject } from "@/utils/storage";

type TaskItem = {
  id: string;
  title: string;
  deadline: string;
  status: "submitted" | "unanswered";
};

type TaskStatusMap = Record<string, "submitted" | "unanswered">;

const TASKS: TaskItem[] = [
  {
    id: "1",
    title: "Tugas 1 - Jurnal Mingguan",
    deadline: "19/12/2025",
    status: "submitted",
  },
  {
    id: "2",
    title: "Tugas 2 - Siapakah Kristus",
    deadline: "05/01/2026",
    status: "unanswered",
  },
  {
    id: "3",
    title: "Tugas 3 - Refleksi Diri",
    deadline: "10/01/2026",
    status: "unanswered",
  },
];

export default function TugasListScreen() {
    const router = useRouter();
    const [statusMap, setStatusMap] = useState<TaskStatusMap>({});
  
    useEffect(() => {
      loadObject<TaskStatusMap>("task-status", {}).then(setStatusMap);
    }, []);
  
    const openDetail = (task: TaskItem) => {
      router.push(`/(main)/tugas/${task.id}`);
    };
  
    const getStatus = (id: string): "submitted" | "unanswered" =>
      statusMap[id] ?? "unanswered";
  
    return (
      <MainScreenLayout title="Tugas" showBack>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          >
          {TASKS.map((task) => {
            const status = getStatus(task.id);
            return (
              <Pressable
                key={task.id}
                style={styles.card}
                onPress={() => openDetail(task)}
              >
                {/* kolom teks kiri: judul + deadline */}
                <View style={styles.textCol}>
                  <Text style={styles.title}>{task.title}</Text>
                  <Text style={styles.deadline}>
                    Deadline: {task.deadline}
                  </Text>
                </View>

                {/* pill status kanan */}
                <View
                  style={[
                    styles.statusPill,
                    status === "submitted"
                      ? styles.statusSubmitted
                      : styles.statusUnanswered,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === "submitted"
                        ? styles.statusTextSubmitted
                        : styles.statusTextUnanswered,
                    ]}
                  >
                    {status === "submitted" ? "Submitted" : "Unanswered"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </MainScreenLayout>
    );
  }

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  deadline: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusSubmitted: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7",
  },
  statusUnanswered: {
    borderColor: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextSubmitted: {
    color: "#166534",
  },
  statusTextUnanswered: {
    color: "#B91C1C",
  },
});