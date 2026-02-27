import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useApp } from '../hooks/useAppContext';
import { FS } from '../utils/theme';

const STEPS = [
  {
    icon: '👋',
    title: 'Chào mừng đến MedPro!',
    subtitle: 'Ứng dụng nhắc nhở uống thuốc miễn phí, chạy offline, bảo mật hoàn toàn.',
    body: 'MedPro giúp bạn:\n\n  💊  Quản lý danh sách thuốc cần uống\n  ⏰  Nhắc nhở đúng giờ mỗi ngày\n  ✅  Theo dõi đã uống hay chưa\n  🔔  Thông báo ngay cả khi tắt màn hình',
    tip: null,
  },
  {
    icon: '➕',
    title: 'Bước 1 — Thêm thuốc',
    subtitle: 'Thêm các loại thuốc bạn đang dùng vào danh sách.',
    body: 'Có 2 cách thêm thuốc:\n\n  1️⃣  Nhấn nút  ＋ Thêm thuốc  rồi gõ tên\n      (VD: Paracetamol, Amoxicillin...)\n\n  2️⃣  Nhấn  🔎 Tìm theo triệu chứng\n      Gõ triệu chứng như "đau đầu", "sốt"\n      để tìm thuốc phù hợp',
    tip: '💡 Có sẵn hơn 60 loại thuốc phổ biến tại Việt Nam',
  },
  {
    icon: '⏰',
    title: 'Bước 2 — Đặt giờ uống',
    subtitle: 'Mỗi thuốc sẽ có giờ uống được gợi ý tự động.',
    body: 'Giờ uống tự động theo số lần/ngày:\n\n  🕖  1 lần/ngày  →  07:00\n  🕖🕘  2 lần/ngày  →  07:00, 21:00\n  🕖🕑🕗  3 lần/ngày  →  07:00, 13:00, 20:00\n\nĐể đổi giờ:\n  Nhấn biểu tượng ⏰ cạnh tên thuốc\n  rồi chỉnh từng khung giờ tùy thích',
    tip: '💡 Bạn có thể thêm hoặc xóa khung giờ tùy ý',
  },
  {
    icon: '✅',
    title: 'Bước 3 — Đánh dấu đã uống',
    subtitle: 'Xác nhận đã uống để theo dõi hằng ngày.',
    body: 'Khi đến giờ uống thuốc:\n\n  🔔  Điện thoại rung và phát thông báo\n  📢  Hiện tên thuốc, giờ uống, liều lượng\n  ⚡  Có nút  ✅ Đã uống  ngay trên thông báo\n\nHoặc mở app và nhấn:\n  ✓ Đã uống  trong lịch uống thuốc',
    tip: '💡 Nhấn "⏰ Nhắc lại 10 phút" nếu chưa uống được ngay',
  },
  {
    icon: '🔔',
    title: 'Bước 4 — Thông báo chính xác',
    subtitle: 'Nhắc nhở đúng giờ, ngay cả khi tắt màn hình.',
    body: 'MedPro dùng Android Alarm Manager:\n\n  ✅  Hoạt động ngay cả khi tiết kiệm pin\n  ✅  Không bị hệ thống tắt ngầm\n  ✅  Thông báo kể cả khi đóng app\n\nLưu ý quan trọng:\n  Khi app yêu cầu quyền thông báo\n  → Nhấn "Cho phép" để nhận nhắc nhở\n  → Tắt "Tối ưu hóa pin" cho MedPro',
    tip: '💡 Vào Cài đặt → Ứng dụng → MedPro → Pin → Không hạn chế',
  },
];

export default function TutorialScreen({ navigation, route }) {
  const { markTutorialShown, colors } = useApp();
  const [current, setCurrent] = useState(0);
  const isFromSettings = route.params?.fromSettings || false;

  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await markTutorialShown();
      if (isFromSettings) navigation.goBack();
      else navigation.replace('Main');
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(c => c - 1);
    else if (isFromSettings) navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.dark }]}>
      {/* Progress dots */}
      <View style={[styles.dotBar, { backgroundColor: colors.panel }]}>
        {STEPS.map((_, i) => (
          <React.Fragment key={i}>
            <View style={[
              styles.dot,
              {
                backgroundColor: i < current ? colors.success
                  : i === current ? colors.accent
                  : colors.card,
                borderColor: i < current ? colors.success
                  : i === current ? colors.accent
                  : colors.border,
              },
            ]}>
              <Text style={[
                styles.dotText,
                { color: i <= current ? 'white' : colors.muted },
              ]}>
                {i < current ? '✓' : String(i + 1)}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[
                styles.dotLine,
                { backgroundColor: i < current ? colors.success : colors.border },
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Card content */}
      <View style={[styles.card, { backgroundColor: colors.panel }]}>
        <Text style={styles.iconLarge}>{step.icon}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{step.title}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{step.subtitle}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.body, { color: colors.text }]}>{step.body}</Text>

        {step.tip && (
          <View style={[styles.tipBox, { backgroundColor: colors.tagHover, borderColor: colors.accent }]}>
            <Text style={[styles.tipText, { color: colors.accent }]}>{step.tip}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.dark, borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={handleBack}
          style={[
            styles.backBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
            current === 0 && !isFromSettings && { opacity: 0 },
          ]}
          activeOpacity={0.8}
          disabled={current === 0 && !isFromSettings}
        >
          <Text style={[styles.backBtnText, { color: colors.muted }]}>← Quay lại</Text>
        </TouchableOpacity>

        <Text style={[styles.stepCount, { color: colors.muted }]}>
          {current + 1} / {STEPS.length}
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextBtn,
            { backgroundColor: isLast ? colors.success : colors.accent },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? '✓ Bắt đầu!' : 'Tiếp theo →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Dots
  dotBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
  },
  dot: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2,
  },
  dotText: { fontSize: FS.detail, fontWeight: '800' },
  dotLine: { flex: 1, height: 2, marginHorizontal: 4, maxWidth: 40 },

  // Card
  card: {
    flex: 1, paddingHorizontal: 28, paddingVertical: 24,
  },
  iconLarge: {
    fontSize: 60, textAlign: 'center', marginBottom: 16,
  },
  title: {
    fontSize: FS.title + 2, fontWeight: '900',
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: FS.detail, textAlign: 'center',
    lineHeight: 22, marginBottom: 20,
  },
  divider: { height: 1, marginBottom: 20 },
  body: {
    fontSize: FS.body, lineHeight: 28,
  },
  tipBox: {
    borderWidth: 1, borderRadius: 12,
    padding: 14, marginTop: 20,
  },
  tipText: { fontSize: FS.detail, lineHeight: 22 },

  // Footer
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1,
  },
  backBtn: {
    borderRadius: 12, borderWidth: 1.5,
    paddingHorizontal: 18, paddingVertical: 14,
  },
  backBtnText: { fontSize: FS.body, fontWeight: '600' },
  stepCount: { fontSize: FS.detail },
  nextBtn: {
    borderRadius: 12,
    paddingHorizontal: 22, paddingVertical: 14,
  },
  nextBtnText: { color: 'white', fontSize: FS.body, fontWeight: '700' },
});
