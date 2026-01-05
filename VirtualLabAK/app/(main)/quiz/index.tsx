import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { useRouter } from "expo-router";
import { loadObject } from "@/utils/storage";

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
  
    useEffect(() => {
      loadObject<QuizStatusMap>("quiz-result", {}).then(setResultMap);
    }, []);
  
    const isDone = (id: string) => !!resultMap[id];
  
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
          {QUIZZES.map((quiz) => {
            const done = isDone(quiz.id);
  
            return (
              <Pressable
                key={quiz.id}
                onPress={() => goToQuiz(quiz)}
                style={[
                  styles.card,
                  !quiz.opened && styles.cardLocked,
                ]}
              >
                <View
                  style={[
                    styles.circle,
                    quiz.opened ? styles.circleOpened : styles.circleLocked,
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
                          ? styles.statusOpen
                          : styles.statusClosed
                        : styles.statusClosed,
                    ]}
                  >
                    {!quiz.opened
                      ? "Belum dibuka"
                      : done
                      ? "Sudah dikerjakan"
                      : "Sudah dibuka"}
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
  circleLocked: {
    borderColor: "#111827",
  },
  innerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#16A34A",
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
  },
  statusOpen: {
    color: "#16A34A",
  },
  statusClosed: {
    color: "#DC2626",
  },
});