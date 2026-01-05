import React, { useEffect, useState, useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { loadObject } from "@/utils/storage";
import { getQuizScores } from "@/lib/supabase";

type QuizItem = {
  id: string;
  title: string;
  opened: boolean;
};
type QuizStatusMap = Record<string, { score: number }>;

const QUIZZES: QuizItem[] = [
  {
    id: "1",
    title: "Kuis 1 - Siapakah Kristus",
    opened: true,
  },
  {
    id: "2",
    title: "Kuis 2 - Doktrin Keselamatan",
    opened: false,
  },
];

export default function QuizListScreen() {
  const router = useRouter();
  const [resultMap, setResultMap] = useState<QuizStatusMap>({});
  const [loading, setLoading] = useState(true);

  // Reload data setiap kali screen difokuskan
  useFocusEffect(
    useCallback(() => {
      loadQuizScores();
    }, [])
  );

  const loadQuizScores = async () => {
    try {
      console.log("📋 Loading quiz scores...");
      setLoading(true);

      // Get user session
      const session = await loadObject("userSession", null);
      
      if (!session || !session.userId) {
        console.log("⚠️ No session, using local storage");
        const localScores = await loadObject<QuizStatusMap>("quiz-result", {});
        setResultMap(localScores);
        return;
      }

      // Fetch from database
      const result = await getQuizScores(session.userId);
      
      if (result.success && result.scores) {
        // Convert scores array to status map
        const newResultMap: QuizStatusMap = {};
        result.scores.forEach((quizScore) => {
          newResultMap[quizScore.quizId] = { score: quizScore.score };
        });
        
        setResultMap(newResultMap);
        console.log("✅ Quiz scores loaded from database");
      } else {
        // Fallback to local storage
        console.log("⚠️ Database load failed, using local storage");
        const localScores = await loadObject<QuizStatusMap>("quiz-result", {});
        setResultMap(localScores);
      }
    } catch (error) {
      console.error("❌ Error loading quiz scores:", error);
      // Fallback to local storage
      const localScores = await loadObject<QuizStatusMap>("quiz-result", {});
      setResultMap(localScores);
    } finally {
      setLoading(false);
    }
  };
  
    const isDone = (id: string) => !!resultMap[id];
  
  const getScore = (id: string) => resultMap[id]?.score || null;

  const goToQuiz = (quiz: QuizItem) => {
    if (!quiz.opened) return;
    router.push(`/(main)/quiz/${quiz.id}`);
  };

  return (
    <MainScreenLayout title="Quiz" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0EA5A6" />
            <Text style={styles.loadingText}>Memuat kuis...</Text>
          </View>
        ) : (
          QUIZZES.map((quiz) => {
            const done = isDone(quiz.id);
            const score = getScore(quiz.id);

            return (
              <Pressable
                key={quiz.id}
                onPress={() => goToQuiz(quiz)}
                style={[
                  styles.card,
                  !quiz.opened && styles.cardLocked,
                  done && quiz.opened && styles.cardCompleted,
                ]}
              >
                <View
                  style={[
                    styles.circle,
                    quiz.opened ? (done ? styles.circleCompleted : styles.circleOpened) : styles.circleLocked,
                  ]}
                >
                  {done && <View style={styles.innerDot} />}
                </View>

                <View style={styles.textCol}>
                  <Text style={styles.title}>{quiz.title}</Text>
                  <Text
                    style={[
                      styles.status,
                      quiz.opened
                        ? done
                          ? styles.statusCompleted
                          : styles.statusOpen
                        : styles.statusClosed,
                    ]}
                  >
                    {!quiz.opened
                      ? "Belum dibuka"
                      : done
                      ? `Nilai Tertinggi: ${score}`
                      : "Sudah dibuka"}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardLocked: {
    borderWidth: 1,
    borderColor: "#F87171",
  },
  cardCompleted: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#16A34A",
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  circleOpened: {
    borderColor: "#16A34A",
  },
  circleCompleted: {
    borderColor: "#16A34A",
    backgroundColor: "#16A34A",
  },
  circleLocked: {
    borderColor: "#111827",
  },
  innerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusOpen: {
    color: "#16A34A",
  },
  statusCompleted: {
    color: "#166534",
  },
  statusClosed: {
    color: "#DC2626",
  },
});