import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

type DailyVerse = {
  ref: string;
  text: string;
};

const DAILY_VERSES: DailyVerse[] = [
  {
    ref: "Matius 11:28",
    text:
      "Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu.",
  },
  {
    ref: "Yohanes 3:16",
    text:
      "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
  },
  {
    ref: "Mazmur 23:1",
    text: "Tuhan adalah gembalaku, takkan kekurangan aku.",
  },
  {
    ref: "Filipi 4:13",
    text: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",
  },
  {
    ref: "Yeremia 29:11",
    text:
      "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
  },
];

function getTodayVerse(): DailyVerse {
  const today = new Date();
  const dayIndex = today.getDate(); 
  const idx = dayIndex % DAILY_VERSES.length;
  return DAILY_VERSES[idx];
}

export default function HomeTab() {
  const router = useRouter();
  const todayVerse = getTodayVerse();

  return (
    <LinearGradient
      colors={["#0EA5A6", "#FFFFFF", "#0EA5A6"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={styles.safe}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.topHeader}>
          <View style={styles.headerLogoCircle}>
            <Image
              source={require("@/assets/images/Icon Final VirtualLabAK.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            <View style={styles.cardSmall}>
              <Text style={styles.cardTitle}>Overview Materi:</Text>
              <Text style={styles.cardSubtitle}>Siapakah Kristus</Text>
              <Text style={styles.cardHint}>Overview materi minggu ini:</Text>
              <View style={styles.overviewImageWrapper}>
                <Image
                  source={require("@/assets/images/Gambar Materi.png")}
                  style={styles.overviewImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.cardSmall}>
              <Text style={styles.cardTitle}>Ayat Alkitab Harian</Text>
              <View style={styles.verseWrapper}>
                <Text style={styles.verseText}>
                  {todayVerse.ref} {"\n"}
                  <Text style={styles.verseBody}>{todayVerse.text}</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Assignments */}
          <View style={styles.assignmentCard}>
            <Text style={styles.assignmentTitle}>Assignments This Week:</Text>

            <View style={styles.assignmentDivider} />

            <View style={styles.assignmentList}>
              {[
                "Quiz 1: Pengenalan Kristus",
                "Quiz 2: Ajaran Yesus",
                "Tugas 1: Ringkasan kotbah",
                "Tugas 2: Refleksi pribadi",
                "Tugas 3: Catatan kelas minggu ini",
              ].map((item) => (
                <View style={styles.assignmentRow} key={item}>
                  <Image
                    source={require("@/assets/images/on.png")}
                    style={styles.checkIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.assignmentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.mainMenuWrapper}>
            <Text style={styles.mainMenuText}>Main Menu</Text>
          </View>

          <View style={styles.menuGrid}>
            {[
              {
                label: "Materi & Video",
                route: "/(main)/materi" as const,
              },
              {
                label: "Tugas",
                route: "/(main)/tugas" as const,
              },
              {
                label: "Quiz",
                route: "/(main)/quiz" as const,
              },
              {
                label: "Progress",
                route: "/(main)/progress" as const,
              },
            ].map((item) => (
              <LinearGradient
                key={item.label}
                colors={["#0B8A8B", "#15B9BB", "#0B8A8B"]}
                locations={[0, 0.62, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.menuCard}
              >
                <Pressable
                  style={styles.menuPressable}
                  onPress={() => router.push(item.route)}
                >
                  <Image
                    style={styles.menuIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.menuText}>{item.label}</Text>
                </Pressable>
              </LinearGradient>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const RADIUS = 14;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 30,
  },
  headerLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0EA5A6",
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    marginLeft: 10,
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },

  content: {
    paddingBottom: 40,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  cardSmall: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: "#111827",
    textAlign: "center",
  },
  cardSubtitle: {
    fontFamily: "Poppins_600Regular",
    fontSize: 13,
    color: "#111827",
    marginBottom: 2,
  },
  cardHint: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  overviewImageWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  overviewImage: {
    width: "100%",
    height: 80,
  },

  verseWrapper: {
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  verseText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
  verseBody: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#111827",
  },

  assignmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 5,
  },
  assignmentTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  assignmentDivider: {
    height: 1,
    backgroundColor: "#111827",
    marginBottom: 10,
  },
  assignmentList: {
    paddingBottom: 4,
  },
  assignmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  assignmentText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#111827",
    flexShrink: 1,
  },
  mainMenuWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },
  mainMenuText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#005E5F",
  },
  centerSeparatorWrapper: {
    alignItems: "center",
    marginVertical: 14,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 15,
    marginBottom: 8,
  },
  menuCard: {
    width: "48%",
    borderRadius: 20,
  },
  menuPressable: {
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
  menuText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
  },
});