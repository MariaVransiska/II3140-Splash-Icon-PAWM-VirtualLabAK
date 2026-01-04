import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MainScreenLayout } from "@/components/MainScreenLayout";
import { loadObject, saveObject } from "@/utils/storage";

type Question = {
  id: number;
  text: string;
  options: string[]; 
  correct: "A" | "B" | "C" | "D";
};

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Dalam Markus 8:29, pengakuan Petrus tentang Yesus adalah bahwa Yesus adalah ...",
    options: [
      "A. Nabi besar",
      "B. Guru moral yang baik",
      "C. Mesias",
      "D. Anak Daud",
    ],
    correct: "C",
  },
  {
    id: 2,
    text: "Menurut Alkitab, Yesus Kristus dipahami sebagai ...",
    options: [
      "A. Manusia biasa yang saleh",
      "B. Nabi terbesar dalam sejarah",
      "C. Lebih dari sekadar nabi, guru, dan manusia saleh",
      "D. Pemimpin politik Israel",
    ],
    correct: "C",
  },
];

type QuizResult = {
  [quizId: string]: {
    score: number; // 0–100
    answers: Record<number, "A" | "B" | "C" | "D">;
  };
};

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quizId = id ?? "1";

  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>(
    {}
  );
  const [score, setScore] = useState<number | null>(null);

  // load jawaban + skor lama kalau pernah dikerjakan
  useEffect(() => {
    loadObject<QuizResult>("quiz-result", {}).then((all) => {
      const prev = all[quizId];
      if (prev) {
        setAnswers(prev.answers);
        setScore(prev.score);
      }
    });
  }, [quizId]);

  const selectOption = (qId: number, option: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const onSubmit = async () => {
    // validasi: semua soal harus terjawab
    const unanswered = SAMPLE_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      Alert.alert(
        "Belum lengkap",
        "Masih ada soal yang belum dijawab."
      );
      return;
    }

    // hitung skor
    let correctCount = 0;
    SAMPLE_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount += 1;
    });
    const newScore = Math.round(
      (correctCount / SAMPLE_QUESTIONS.length) * 100
    );
    setScore(newScore);

    // simpan ke storage
    const all = await loadObject<QuizResult>("quiz-result", {});
    const next: QuizResult = {
      ...all,
      [quizId]: { score: newScore, answers },
    };
    await saveObject("quiz-result", next);

    Alert.alert("Quiz disimpan", `Skor kamu: ${newScore}`);
  };

  return (
    <MainScreenLayout title="Quiz" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
      >
        <View style={styles.card}>
          {SAMPLE_QUESTIONS.map((q) => (
            <View key={q.id} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {q.id}. {q.text}
              </Text>
              {q.options.map((opt) => {
                const letter = opt[0] as "A" | "B" | "C" | "D";
                const selected = answers[q.id] === letter;
                const correct = score !== null && letter === q.correct;

                return (
                  <Pressable
                    key={opt}
                    style={[
                      styles.optionRow,
                      selected && styles.optionSelected,
                    ]}
                    onPress={() => selectOption(q.id, letter)}
                  >
                    <View
                      style={[
                        styles.optionBullet,
                        selected && styles.optionBulletSelected,
                        correct && styles.optionBulletCorrect,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                        correct && styles.optionTextCorrect,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

          <Pressable style={styles.submitBtn} onPress={onSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>

          {score !== null && (
            <Text style={styles.scoreText}>Skor terakhir: {score}</Text>
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
  questionBlock: {
    marginBottom: 14,
  },
  questionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  optionBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    marginRight: 8,
    backgroundColor: "#ffffff",
  },
  optionBulletSelected: {
    backgroundColor: "#0EA5E9",
    borderColor: "#0EA5E9",
  },
  optionBulletCorrect: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  optionText: {
    fontSize: 13,
    color: "#111827",
  },
  optionSelected: {
    backgroundColor: "#E5F3FF",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  optionTextCorrect: {
    color: "#16A34A",
    fontWeight: "700",
  },
  submitBtn: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#00A89B",
    paddingVertical: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  scoreText: {
    marginTop: 8,
    fontSize: 13,
    color: "#111827",
  },
});