import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { useFocusEffect } from "@react-navigation/native";
import { loadObject } from "@/utils/storage";
import { getQuizScores, getSubmittedAssignments } from "@/lib/supabase";

type QuizSummary = {
  id: string;
  title: string;
  score: number;
  completedAt: string;
};

type AssignmentSummary = {
  id: string;
  title: string;
  deadline: string;
  status: "submitted" | "pending";
  submittedAt?: string;
};

type ProgressData = {
  averageScore: number;
  quizCompleted: number;
  quizTotal: number;
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  quizzes: QuizSummary[];
  assignments: AssignmentSummary[];
};

// Data master untuk quiz
const QUIZ_LIST = [
  { id: "1", title: "Kuis 1 - Siapakah Kristus" },
  { id: "2", title: "Kuis 2 - Doktrin Keselamatan" },
];

// Data master untuk tugas
const ASSIGNMENT_LIST = [
  { id: "1", title: "Tugas 1 - Jurnal Mingguan", deadline: "19/12/2025" },
  { id: "2", title: "Tugas 2 - Siapakah Kristus", deadline: "05/01/2026" },
  { id: "3", title: "Tugas 3 - Refleksi Diri", deadline: "10/01/2026" },
];

function toPercent(done: number, total: number) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export default function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressData>({
    averageScore: 0,
    quizCompleted: 0,
    quizTotal: QUIZ_LIST.length,
    assignmentsSubmitted: 0,
    assignmentsTotal: ASSIGNMENT_LIST.length,
    quizzes: [],
    assignments: [],
  });

  // Reload data setiap kali screen difokuskan
  useFocusEffect(
    useCallback(() => {
      loadProgressData();
    }, [])
  );

  const loadProgressData = async () => {
    try {
      console.log("📊 Loading progress data...");
      setLoading(true);

      // Get user session
      const session = await loadObject("userSession", null);
      
      if (!session || !session.userId) {
        console.log("⚠️ No session, cannot load progress");
        setLoading(false);
        return;
      }

      // Load quiz scores
      const quizResult = await getQuizScores(session.userId);
      const quizzes: QuizSummary[] = [];
      let totalScore = 0;
      
      if (quizResult.success && quizResult.scores) {
        quizResult.scores.forEach((score) => {
          quizzes.push({
            id: score.quizId,
            title: score.title,
            score: score.score,
            completedAt: new Date(score.completedAt).toLocaleDateString('id-ID'),
          });
          totalScore += score.score;
        });
      }

      const averageScore = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;

      // Load assignment submissions
      const assignmentResult = await getSubmittedAssignments(session.userId);
      const submittedIds = new Set<string>();
      
      if (assignmentResult.success && assignmentResult.submissions) {
        assignmentResult.submissions.forEach((sub) => {
          // In database, assignment ID is stored in "title" field
          const assignmentId = sub.title; // "1", "2", "3", etc.
          submittedIds.add(assignmentId);
        });
      }

      // Build assignment summary
      const assignments: AssignmentSummary[] = ASSIGNMENT_LIST.map((assignment) => {
        const isSubmitted = submittedIds.has(assignment.id);
        const submission = assignmentResult.submissions?.find(
          (sub) => sub.title === assignment.id // Check by "title" field
        );
        
        return {
          id: assignment.id,
          title: assignment.title,
          deadline: assignment.deadline,
          status: isSubmitted ? "submitted" : "pending",
          submittedAt: submission?.submittedAt 
            ? new Date(submission.submittedAt).toLocaleDateString('id-ID')
            : undefined,
        };
      });

      setProgress({
        averageScore,
        quizCompleted: quizzes.length,
        quizTotal: QUIZ_LIST.length,
        assignmentsSubmitted: submittedIds.size,
        assignmentsTotal: ASSIGNMENT_LIST.length,
        quizzes,
        assignments,
      });

      console.log("✅ Progress data loaded successfully");
    } catch (error) {
      console.error("❌ Error loading progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const p = progress;
  const quizPercent = toPercent(p.quizCompleted, p.quizTotal);
  const tugasPercent = toPercent(p.assignmentsSubmitted, p.assignmentsTotal);

  if (loading) {
    return (
      <MainScreenLayout title="Progress" showBack>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>Memuat progress...</Text>
        </View>
      </MainScreenLayout>
    );
  }

  return (
    <MainScreenLayout title="Progress" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Kartu ringkasan nilai */}
        <View style={styles.cardSummary}>
          <Text style={styles.summaryLabel}>Rata-rata Nilai Kuis</Text>
          <Text style={styles.summaryScore}>{p.averageScore}</Text>
          <Text style={styles.summarySub}>
            Berdasarkan {p.quizCompleted} kuis yang sudah kamu kerjakan
          </Text>
        </View>

        {/* Progress bar section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ringkasan Progress</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressLabelCol}>
              <Text style={styles.progressTitle}>Tugas</Text>
              <Text style={styles.progressSub}>
                {p.assignmentsSubmitted}/{p.assignmentsTotal} submitted
              </Text>
            </View>
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${tugasPercent}%`, backgroundColor: "#0EA5E9" },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{tugasPercent}%</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressLabelCol}>
              <Text style={styles.progressTitle}>Quiz</Text>
              <Text style={styles.progressSub}>
                {p.quizCompleted}/{p.quizTotal} selesai
              </Text>
            </View>
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${quizPercent}%`, backgroundColor: "#22C55E" },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{quizPercent}%</Text>
            </View>
          </View>
        </View>

        {/* Resume Quiz */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resume Quiz</Text>
          {p.quizzes.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada quiz yang dikerjakan</Text>
          ) : (
            p.quizzes.map((quiz) => (
              <View key={quiz.id} style={styles.itemRow}>
                <View style={styles.itemDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{quiz.title}</Text>
                  <Text style={styles.itemMeta}>
                    Nilai: {quiz.score} · {quiz.completedAt}
                  </Text>
                </View>
                <View style={styles.scoreChip}>
                  <Text style={styles.scoreChipText}>{quiz.score}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Resume Tugas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resume Tugas</Text>
          
          {/* Tugas yang sudah dikerjakan */}
          <Text style={styles.subSectionTitle}>Sudah Dikerjakan</Text>
          {p.assignments.filter((a) => a.status === "submitted").length === 0 ? (
            <Text style={styles.emptyText}>Belum ada tugas yang dikerjakan</Text>
          ) : (
            p.assignments
              .filter((a) => a.status === "submitted")
              .map((assignment) => (
                <View key={assignment.id} style={styles.itemRow}>
                  <View style={[styles.itemDot, { backgroundColor: "#22C55E" }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{assignment.title}</Text>
                    <Text style={styles.itemMeta}>
                      Submitted: {assignment.submittedAt} · Deadline: {assignment.deadline}
                    </Text>
                  </View>
                  <View style={styles.statusChipSubmitted}>
                    <Text style={styles.statusChipTextSubmitted}>✓</Text>
                  </View>
                </View>
              ))
          )}

          {/* Tugas yang belum dikerjakan */}
          <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>Belum Dikerjakan</Text>
          {p.assignments.filter((a) => a.status === "pending").length === 0 ? (
            <Text style={styles.emptyText}>Semua tugas sudah dikerjakan! 🎉</Text>
          ) : (
            p.assignments
              .filter((a) => a.status === "pending")
              .map((assignment) => (
                <View key={assignment.id} style={styles.itemRow}>
                  <View style={[styles.itemDot, { backgroundColor: "#EF4444" }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{assignment.title}</Text>
                    <Text style={styles.itemMeta}>
                      Deadline: {assignment.deadline}
                    </Text>
                  </View>
                  <View style={styles.statusChipPending}>
                    <Text style={styles.statusChipTextPending}>!</Text>
                  </View>
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  cardSummary: {
    backgroundColor: "#0EA5E9",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#ECFEFF",
    marginBottom: 2,
  },
  summaryScore: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  summarySub: {
    fontSize: 12,
    color: "#E0F2FE",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabelCol: {
    width: 110,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  progressSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  progressBarWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressBarFill: {
    height: 10,
    borderRadius: 999,
  },
  progressPercent: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 2,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0EA5E9",
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 11,
    color: "#6B7280",
  },
  scoreChip: {
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  scoreChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E40AF",
  },
  statusChipSubmitted: {
    backgroundColor: "#DCFCE7",
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  statusChipTextSubmitted: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16A34A",
  },
  statusChipPending: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  statusChipTextPending: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  emptyText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 8,
  },
});