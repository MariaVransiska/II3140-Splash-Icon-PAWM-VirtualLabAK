import React, { useEffect, useState, useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { loadObject } from "@/utils/storage";
import { getSubmittedAssignments } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    loadAssignmentStatus();
  }, []);

  // Reload data setiap kali screen difokuskan
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Screen focused, reloading assignments...");
      loadAssignmentStatus();
    }, [])
  );

  const loadAssignmentStatus = async () => {
    try {
      console.log("📋 Loading assignment status...");
      setLoading(true);

      // Get user session
      const session = await loadObject("userSession", null);
      
      if (!session || !session.userId) {
        console.log("⚠️ No session, using local storage");
        const localStatus = await loadObject<TaskStatusMap>("task-status", {});
        setStatusMap(localStatus);
        return;
      }

      // Fetch from database
      const result = await getSubmittedAssignments(session.userId);
      
      if (result.success && result.submissions) {
        // Convert submissions array to status map
        // Note: In the database, assignment ID is stored in "title" field
        const newStatusMap: TaskStatusMap = {};
        result.submissions.forEach((submission) => {
          const assignmentId = submission.title; // "1", "2", "3", etc.
          newStatusMap[assignmentId] = "submitted";
          console.log(`✅ Assignment ${assignmentId} marked as submitted`);
        });
        
        setStatusMap(newStatusMap);
        console.log("✅ Assignment status loaded from database:", newStatusMap);
      } else {
        // Fallback to local storage
        console.log("⚠️ Database load failed, using local storage");
        const localStatus = await loadObject<TaskStatusMap>("task-status", {});
        setStatusMap(localStatus);
        console.log("📦 Local status:", localStatus);
      }
    } catch (error) {
      console.error("❌ Error loading assignment status:", error);
      // Fallback to local storage
      const localStatus = await loadObject<TaskStatusMap>("task-status", {});
      setStatusMap(localStatus);
    } finally {
      setLoading(false);
    }
  };
  
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0EA5A6" />
            <Text style={styles.loadingText}>Memuat tugas...</Text>
          </View>
        ) : (
          TASKS.map((task) => {
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
                    {status === "submitted" ? "Answered" : "Unanswered"}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
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