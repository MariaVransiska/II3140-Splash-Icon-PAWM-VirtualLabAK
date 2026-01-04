import React, { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { MainScreenLayout } from "@/components/MainScreenLayout";

type MateriItem = {
  id: string;
  title: string;
  pdfUrl?: string;
  videoUrl?: string;
  image?: any;
};

const MATERI_LIST: MateriItem[] = [
    {
      id: "1",
      title: "Pertemuan 1 - Siapakah Kristus",
      pdfUrl: "https://contoh.com/materi/01-Siapakah-Kristus.pdf",
      videoUrl: "https://youtube.com/",
      image: require("@/assets/images/Gambar Materi.png"),
    },
    {
      id: "2",
      title: "Pertemuan 2 - Doktrin Keselamatan",
      pdfUrl: "https://contoh.com/materi/02-Doktrin-Keselamatan.pdf",
      videoUrl: "https://youtube.com/",
      image: require("@/assets/images/Gambar Materi.png"),
    },
    {
      id: "3",
      title: "Pertemuan 3 - Iman",
      pdfUrl: "https://contoh.com/materi/03-Iman.pdf",
      videoUrl: "https://youtube.com/",
      image: require("@/assets/images/Gambar Materi.png"),
    },
    {
      id: "4",
      title: "Pertemuan 4 - Doktrin Tritunggal",
      pdfUrl: "https://contoh.com/materi/04-Doktrin-Tritunggal.pdf",
      videoUrl: "https://youtube.com/",
      image: require("@/assets/images/Gambar Materi.png"),
    },
    {
      id: "5",
      title: "Pertemuan 5 - Kekudusan",
      pdfUrl: "https://contoh.com/materi/05-Kekudusan.pdf",
      videoUrl: "https://youtube.com/",
      image: require("@/assets/images/Gambar Materi.png"),
    },
  ];

export default function MateriIndexScreen() {
  const [openedId, setOpenedId] = useState<string | null>("1");

  const toggleItem = (id: string) => {
    setOpenedId((prev) => (prev === id ? null : id));
  };

  const openLink = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(console.warn);
  };

  return (
    <MainScreenLayout title="Materi & Video" showBack>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {MATERI_LIST.map((item) => {
          const opened = openedId === item.id;

          return (
            <View key={item.id} style={styles.cardWrapper}>
              <Pressable
                style={[styles.cardHeader, opened && styles.cardHeaderOpened]}
                onPress={() => toggleItem(item.id)}
              >
                <Text style={styles.icon}>{opened ? "▾" : "▶"}</Text>
                <Text style={styles.title}>{item.title}</Text>
              </Pressable>

              {opened && (
                <View style={styles.contentBox}>
                  {item.pdfUrl && (
                    <Pressable onPress={() => openLink(item.pdfUrl)}>
                      <Text style={styles.link}>Download PDF</Text>
                    </Pressable>
                  )}

                  {item.image && (
                    <Image
                      source={item.image}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}

                  {item.videoUrl && (
                    <Pressable onPress={() => openLink(item.videoUrl)}>
                      <Text style={styles.link}>
                        Video Pembelajaran : {"<Link YouTube>"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
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
  cardWrapper: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
  cardHeaderOpened: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  contentBox: {
    backgroundColor: "#E0F2F1",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  link: {
    color: "#0EA5E9",
    fontSize: 13,
    marginBottom: 8,
    textDecorationLine: "underline",
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
});