import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";

type ProgressData = {
  averageScore: number; // 0–100
  quizCompleted: number;
  quizTotal: number;
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  journalsWritten: number;
  journalsTarget: number;
};

const MOCK_PROGRESS: ProgressData = {
  averageScore: 87,
  quizCompleted: 2,
  quizTotal: 3,
  assignmentsSubmitted: 2,
  assignmentsTotal: 3,
  journalsWritten: 6,
  journalsTarget: 8,
};

const LAST_ACTIVITY = [
  {
    id: "a1",
    type: "Tugas",
    title: "Tugas 1 - Jurnal Mingguan",
    status: "Submitted",
    date: "19/12/2025",
  },
  {
    id: "q1",
    type: "Quiz",
    title: "Kuis 1 - Siapakah Kristus",
    status: "Selesai",
    date: "20/12/2025",
  },
  {
    id: "j1",
    type: "Journal",
    title: "Catatan Ibadah Minggu",
    status: "Disimpan",
    date: "21/12/2025",
  },
];

function toPercent(done: number, total: number) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export default function ProgressScreen() {
  const p = MOCK_PROGRESS;

  const quizPercent = toPercent(p.quizCompleted, p.quizTotal);
  const tugasPercent = toPercent(p.assignmentsSubmitted, p.assignmentsTotal);
  const jurnalPercent = toPercent(p.journalsWritten, p.journalsTarget);

  return (
    <MainScreenLayout title="Progress" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Kartu ringkasan nilai */}
        <View style={styles.cardSummary}>
          <Text style={styles.summaryLabel}>Rata-rata Nilai</Text>
          <Text style={styles.summaryScore}>{p.averageScore}</Text>
          <Text style={styles.summarySub}>
            Berdasarkan nilai tugas &amp; quiz yang sudah kamu kerjakan
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

          <View style={styles.progressRow}>
            <View style={styles.progressLabelCol}>
              <Text style={styles.progressTitle}>Journal</Text>
              <Text style={styles.progressSub}>
                {p.journalsWritten}/{p.journalsTarget} entri
              </Text>
            </View>
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${jurnalPercent}%`, backgroundColor: "#F97316" },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{jurnalPercent}%</Text>
            </View>
          </View>
        </View>

        {/* Aktivitas terakhir */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
          {LAST_ACTIVITY.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>
                  {item.type} · {item.title}
                </Text>
                <Text style={styles.activityMeta}>
                  {item.status} · {item.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
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
  activityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 8,
    marginTop: 5,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  activityMeta: {
    fontSize: 11,
    color: "#6B7280",
  },
});