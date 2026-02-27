# 📱 MedPro Mobile — Hướng dẫn cài đặt & Build APK

## Tổng quan

MedPro Mobile là bản Android của app nhắc uống thuốc, được viết bằng **React Native**.  
Thông báo dùng **@notifee/react-native** với Android AlarmManager — hoạt động chính xác ngay cả khi điện thoại ở chế độ tiết kiệm pin.

---

## Bước 1 — Cài đặt môi trường (làm 1 lần duy nhất)

### 1.1 Cài Node.js
Tải tại: https://nodejs.org → chọn bản **LTS (20.x)**  
Sau khi cài, mở Command Prompt kiểm tra:
```
node --version   # phải ra v18 hoặc v20
npm --version
```

### 1.2 Cài Java JDK 17
Tải tại: https://adoptium.net → chọn **Temurin 17 (LTS)**  
Sau khi cài, kiểm tra:
```
java --version   # phải ra 17.x
```

### 1.3 Cài Android Studio
Tải tại: https://developer.android.com/studio  
Sau khi cài xong, mở Android Studio:
1. Vào **More Actions → SDK Manager**
2. Tab **SDK Platforms**: tick **Android 14 (API 34)**
3. Tab **SDK Tools**: tick **Android SDK Build-Tools 34**
4. Nhấn **Apply → OK**

### 1.4 Cài đặt biến môi trường
Mở **Control Panel → System → Advanced → Environment Variables**:

Tạo biến mới trong **System variables**:
```
ANDROID_HOME = C:\Users\TenBan\AppData\Local\Android\Sdk
```

Thêm vào **Path**:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

Kiểm tra:
```
adb --version   # phải ra android debug bridge
```

---

## Bước 2 — Cài các thư viện của project

Giải nén file **MedProMobile.zip** vào thư mục bất kỳ (VD: `C:\Projects\MedProMobile`)

Mở Command Prompt, trỏ vào thư mục đó:
```
cd C:\Projects\MedProMobile
npm install
```
*(Chờ 3-5 phút để tải thư viện)*

---

## Bước 3 — Build file APK

### 3.1 Tạo keystore (chữ ký app — làm 1 lần)
```
cd android
keytool -genkey -v -keystore medpro-release.keystore -alias medpro -keyalg RSA -keysize 2048 -validity 10000
```
Nhập mật khẩu và thông tin theo yêu cầu. **Giữ file .keystore cẩn thận!**

### 3.2 Cấu hình signing
Mở file `android/gradle.properties`, thêm vào cuối:
```
MYAPP_RELEASE_STORE_FILE=medpro-release.keystore
MYAPP_RELEASE_KEY_ALIAS=medpro
MYAPP_RELEASE_STORE_PASSWORD=matkhau_ban_vua_dat
MYAPP_RELEASE_KEY_PASSWORD=matkhau_ban_vua_dat
```

Mở `android/app/build.gradle`, tìm phần `buildTypes` và thêm signing:
```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_RELEASE_STORE_FILE)
        storePassword MYAPP_RELEASE_STORE_PASSWORD
        keyAlias MYAPP_RELEASE_KEY_ALIAS
        keyPassword MYAPP_RELEASE_KEY_PASSWORD
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        ...
    }
}
```

### 3.3 Build APK
```
cd android
./gradlew assembleRelease
```
*(Lần đầu mất 10-15 phút)*

File APK nằm tại:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Bước 4 — Cài APK lên điện thoại

### Cách 1: Cài qua USB
1. Bật **Chế độ nhà phát triển** trên điện thoại:  
   Vào **Cài đặt → Giới thiệu → Số bản dựng** → nhấn 7 lần
2. Bật **USB debugging**
3. Cắm USB vào máy tính
4. Chạy:
```
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Cách 2: Copy file APK
Copy file `app-release.apk` sang điện thoại qua USB/Bluetooth,  
rồi mở file trên điện thoại để cài (cần bật "Cho phép nguồn không xác định").

---

## Bước 5 — Cấu hình điện thoại để thông báo hoạt động tốt

Đây là bước **quan trọng nhất** để nhắc thuốc đúng giờ:

### 5.1 Tắt tối ưu hóa pin cho MedPro
**Cài đặt → Ứng dụng → MedPro → Pin → Không hạn chế**  
*(Tên menu khác nhau tùy hãng điện thoại)*

### 5.2 Cho phép chạy nền
**Cài đặt → Ứng dụng → MedPro → Dữ liệu di động & Wifi → Cho phép hoạt động nền**

### 5.3 Theo hãng điện thoại:
| Hãng | Thao tác thêm |
|------|--------------|
| Samsung | Cài đặt → Bảo trì thiết bị → Pin → Ứng dụng ngủ → Xóa MedPro khỏi danh sách |
| Xiaomi/MIUI | Cài đặt → Ứng dụng → MedPro → Bật "Tự khởi động" |
| Oppo/ColorOS | Cài đặt → Quản lý pin → MedPro → Bật "Chạy nền" |
| Huawei | Cài đặt → Ứng dụng → MedPro → Khởi chạy ứng dụng → Tắt "Tự động" → Bật cả 3 mục |

---

## Cấu trúc project

```
MedProMobile/
├── App.js                          # Entry point, navigation, notification handlers
├── src/
│   ├── data/
│   │   └── medicineDb.js           # 60+ thuốc phổ biến VN + search functions
│   ├── hooks/
│   │   └── useAppContext.js        # Global state (medicines, taken, theme)
│   ├── screens/
│   │   ├── HomeScreen.js           # Trang chủ: lịch hôm nay + danh sách thuốc
│   │   ├── AddMedicineScreen.js    # Thêm thuốc mới
│   │   ├── SymptomSearchScreen.js  # Tìm thuốc theo triệu chứng
│   │   ├── EditTimesScreen.js      # Chỉnh giờ uống
│   │   ├── SettingsScreen.js       # Cài đặt + cảnh báo tương tác
│   │   └── TutorialScreen.js       # Hướng dẫn từng bước
│   └── utils/
│       ├── notificationService.js  # Quản lý thông báo (Notifee + AlarmManager)
│       ├── storage.js              # AsyncStorage helpers
│       └── theme.js                # Dark/Light theme colors
└── android/
    └── app/src/main/
        └── AndroidManifest.xml     # Permissions: SCHEDULE_EXACT_ALARM, BOOT_COMPLETED
```

---

## Tính năng đã có

| Tính năng | Trạng thái |
|-----------|-----------|
| Danh sách thuốc | ✅ |
| Thêm thuốc (theo tên) | ✅ |
| Tìm thuốc theo triệu chứng | ✅ |
| Lịch uống thuốc hôm nay | ✅ |
| Đánh dấu đã uống | ✅ |
| Chỉnh giờ uống tùy chỉnh | ✅ |
| Thông báo đúng giờ (AlarmManager) | ✅ |
| Nút "✅ Đã uống" trên thông báo | ✅ |
| Snooze 10 phút | ✅ |
| Thông báo kể cả khi app đóng | ✅ |
| Tự khởi động lại alarm sau reboot | ✅ |
| Cảnh báo tương tác thuốc | ✅ |
| Chế độ sáng / tối | ✅ |
| Hướng dẫn từng bước (stepper) | ✅ |
| Lưu dữ liệu offline | ✅ |
| Cỡ chữ lớn (cho người cao tuổi) | ✅ |

---

## Lưu ý khi gặp lỗi

**Lỗi `JAVA_HOME`:**  
Thêm `JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x.x` vào biến môi trường

**Lỗi `SDK location not found`:**  
Tạo file `android/local.properties`:
```
sdk.dir=C:\\Users\\TenBan\\AppData\\Local\\Android\\Sdk
```

**Build lỗi Gradle:**
```
cd android && ./gradlew clean
cd .. && npm start -- --reset-cache
```

**Thông báo không hiện:**  
→ Kiểm tra lại bước 5 (tắt tối ưu pin) theo từng hãng điện thoại

---

*MedPro Mobile — Offline · Miễn phí · Bảo mật dữ liệu*
