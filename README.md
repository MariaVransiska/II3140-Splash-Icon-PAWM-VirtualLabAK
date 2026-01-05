# II3140-Splash-Icon-PAWM-VirtualLabAK

Tugas App Icon dan Splash Screen - II3140 Pengembangan Aplikasi Web dan Mobile

##  Anggota
- **18223119** - Maria Vransiska Pingkhan
- **18223136** - Geraldo Linggom Samuel T

##  Deskripsi
Virtual Lab Agama Kristen yang dibuat ini merupakan sebuah platform mobile app berbasis React Native yang dapat digunakan sebagai media pembelajaran interaktif untuk mendukung proses belajar mahasiswa TPB ITB dalam mata kuliah Agama Kristen.

File .apk terdapat pada folder ".APK"

### Fitur Aplikasi:
- 1. **Authentication** - Login & Register dengan database real
- 2. **Quiz Interaktif** - Soal & tracking scores
- 3. **Tugas/Assignment** - Submit dan monitor tugas
- 4. **Jurnal Rohani** - Catatan pribadi untuk refleksi
- 5. **Progress Tracking** - Monitor perkembangan belajar
- 6. **Profile Management** - Kelola data mahasiswa


---

##  Quick Start

```bash
# Clone repository
git clone https://github.com/MariaVransiska/II3140-Splash-Icon-PAWM-VirtualLabAK.git

# Navigate to project
cd II3140-Splash-Icon-PAWM-VirtualLabAK/VirtualLabAK

# Install dependencies
npm install

# Start dev server
npx expo start
```

**Run on device**: Press `a` (Android), `i` (iOS), atau scan QR code dengan Expo Go.

**Cara Build .apk dan Download Manual**
```bash
# Login pada link di bawah ini
https://expo.dev/

# Build menggunakan profile preview
eas build --platform android --profile preview

# Silahkan akses menu Deploy -> Builds pada expo dan download file .apk secara manual ke smartphone
---

##  Tech Stack

- **Frontend**: React Native, Expo SDK 54, TypeScript, Expo Router
- **Backend**: Supabase (PostgreSQL, RLS, Real-time)
- **State**: AsyncStorage, React Hooks
- **Security**: SHA256 password hashing (expo-crypto), Environment variables

---

## Backend Integration Status

- [x] Supabase client configured
- [x] Authentication (login/register) 
- [x] Profile management - **READY**
- [x] Quiz services - **READY**
- [x] Assignment services - **READY**  
- [x] Journal services - **READY**
- [x] Progress tracking - **READY**
- [x] Frontend integrated - **COMPLETE**



---

##  Main Dependencies

```json
{
  "@supabase/supabase-js": "^2.x.x",
  "expo": "~54.0.0",
  "expo-crypto": "~14.x.x",
  "expo-router": "~4.x.x",
  "react-native": "0.76.x"
}
```

---
 **Last Updated**: Jan 5, 2026 