// ── Cơ sở dữ liệu thuốc phổ biến tại Việt Nam ────────────────────────
export const MEDICINE_DB = [
  // Giảm đau / Hạ sốt
  { name: "Paracetamol", group: "Giảm đau - Hạ sốt", common_dose: "500mg",
    instruction: "Sau ăn", max_per_day: 4,
    warning: "Không dùng quá 4g/ngày. Tránh dùng chung với rượu bia.",
    interactions: ["Warfarin", "Rượu bia"],
    symptoms: ["đau đầu","nhức đầu","sốt","đau răng","đau cơ","đau khớp","đau họng","hạ sốt","giảm đau","đau lưng","đau bụng kinh"] },

  { name: "Paracetamol 650mg", group: "Giảm đau - Hạ sốt", common_dose: "650mg",
    instruction: "Sau ăn", max_per_day: 3,
    warning: "Không dùng quá 4g/ngày.",
    interactions: ["Warfarin"],
    symptoms: ["đau đầu","sốt cao","đau cơ","hạ sốt","giảm đau"] },

  { name: "Ibuprofen", group: "Giảm đau - Kháng viêm", common_dose: "400mg",
    instruction: "Sau ăn no", max_per_day: 3,
    warning: "Không dùng khi loét dạ dày, suy thận. Tránh dùng lúc đói.",
    interactions: ["Aspirin","Warfarin","ACE inhibitors"],
    symptoms: ["đau đầu","sốt","đau cơ","viêm khớp","đau bụng kinh","đau răng","kháng viêm","đau lưng","sưng viêm","đau họng"] },

  { name: "Aspirin", group: "Giảm đau - Kháng viêm", common_dose: "81mg",
    instruction: "Sau ăn", max_per_day: 1,
    warning: "Không dùng cho trẻ dưới 16 tuổi. Nguy cơ xuất huyết.",
    interactions: ["Ibuprofen","Warfarin","Clopidogrel"],
    symptoms: ["đau đầu","sốt","tim mạch","ngăn đông máu","kháng viêm","đau cơ"] },

  { name: "Diclofenac", group: "Kháng viêm", common_dose: "50mg",
    instruction: "Sau ăn", max_per_day: 3,
    warning: "Không dùng khi loét dạ dày, bệnh tim mạch.",
    interactions: ["Aspirin","Warfarin","Lithium"],
    symptoms: ["viêm khớp","đau lưng","đau cơ","sưng viêm","kháng viêm","đau sau phẫu thuật","thoái hóa khớp"] },

  { name: "Meloxicam", group: "Kháng viêm", common_dose: "7.5mg",
    instruction: "Sau ăn", max_per_day: 1,
    warning: "Không dùng khi loét dạ dày, suy thận.",
    interactions: ["Aspirin","Warfarin"],
    symptoms: ["viêm khớp","thoái hóa khớp","đau lưng","sưng viêm","kháng viêm"] },

  // Kháng sinh
  { name: "Amoxicillin", group: "Kháng sinh", common_dose: "500mg",
    instruction: "Trước hoặc sau ăn", max_per_day: 3,
    warning: "Dị ứng penicillin cần thông báo bác sĩ. Uống đủ liều.",
    interactions: ["Warfarin","Methotrexate"],
    symptoms: ["nhiễm khuẩn","viêm họng","viêm phổi","nhiễm trùng tai","viêm xoang","nhiễm trùng đường tiết niệu","nhiễm trùng da","viêm amidan"] },

  { name: "Augmentin 625mg", group: "Kháng sinh", common_dose: "625mg",
    instruction: "Đầu bữa ăn", max_per_day: 3,
    warning: "Có thể gây tiêu chảy, buồn nôn.",
    interactions: ["Warfarin","Methotrexate"],
    symptoms: ["nhiễm khuẩn kháng thuốc","viêm phổi","viêm xoang","nhiễm trùng da","nhiễm trùng đường tiết niệu","viêm tai"] },

  { name: "Azithromycin", group: "Kháng sinh", common_dose: "500mg",
    instruction: "Trước ăn 1 giờ hoặc sau ăn 2 giờ", max_per_day: 1,
    warning: "Uống 1 lần/ngày trong 3-5 ngày.",
    interactions: ["Antacid","Warfarin"],
    symptoms: ["viêm phổi","viêm họng","viêm xoang","nhiễm khuẩn hô hấp","nhiễm trùng da"] },

  { name: "Ciprofloxacin", group: "Kháng sinh", common_dose: "500mg",
    instruction: "Trước ăn 1 giờ hoặc sau ăn 2 giờ", max_per_day: 2,
    warning: "Tránh dùng với sữa và antacid. Uống nhiều nước.",
    interactions: ["Antacid","Calcium","Warfarin","Theophylline"],
    symptoms: ["nhiễm trùng đường tiết niệu","nhiễm khuẩn đường ruột","tiêu chảy do vi khuẩn","nhiễm khuẩn hô hấp"] },

  { name: "Metronidazole", group: "Kháng sinh", common_dose: "500mg",
    instruction: "Sau ăn", max_per_day: 3,
    warning: "Tuyệt đối không uống rượu trong và sau khi dùng 48 giờ.",
    interactions: ["Rượu bia","Warfarin","Lithium"],
    symptoms: ["nhiễm ký sinh trùng","viêm âm đạo","nhiễm trùng răng lợi","tiêu chảy do vi khuẩn","loét dạ dày HP"] },

  { name: "Doxycycline", group: "Kháng sinh", common_dose: "100mg",
    instruction: "Sau ăn, uống nhiều nước", max_per_day: 2,
    warning: "Tránh tiếp xúc ánh nắng. Không dùng với sữa, antacid.",
    interactions: ["Antacid","Calcium","Iron","Warfarin"],
    symptoms: ["mụn trứng cá","nhiễm khuẩn hô hấp","nhiễm trùng da","viêm phổi không điển hình"] },

  // Dạ dày
  { name: "Omeprazole", group: "Dạ dày - Giảm acid", common_dose: "20mg",
    instruction: "Trước ăn 30 phút", max_per_day: 1,
    warning: "Dùng dài hạn có thể thiếu Mg, B12.",
    interactions: ["Clopidogrel","Methotrexate"],
    symptoms: ["trào ngược dạ dày","ợ chua","đau dạ dày","loét dạ dày","viêm thực quản","đầy hơi","buồn nôn do acid"] },

  { name: "Pantoprazole", group: "Dạ dày - Giảm acid", common_dose: "40mg",
    instruction: "Trước ăn 30 phút", max_per_day: 1,
    warning: "Không nghiền hoặc nhai viên thuốc.",
    interactions: ["Methotrexate"],
    symptoms: ["trào ngược dạ dày","loét dạ dày","ợ chua","đau dạ dày","viêm thực quản"] },

  { name: "Domperidone", group: "Dạ dày - Chống nôn", common_dose: "10mg",
    instruction: "Trước ăn 15-30 phút", max_per_day: 3,
    warning: "Không dùng quá 1 tuần liên tục.",
    interactions: ["Ketoconazole","Erythromycin"],
    symptoms: ["buồn nôn","nôn mửa","đầy bụng","chậm tiêu","khó tiêu","ăn không tiêu"] },

  { name: "Phosphalugel", group: "Dạ dày - Antacid", common_dose: "1 gói",
    instruction: "Trước ăn 30 phút hoặc khi đau", max_per_day: 3,
    warning: "Không dùng chung với các thuốc khác (cách 2 giờ).",
    interactions: ["Ciprofloxacin","Doxycycline"],
    symptoms: ["ợ chua","đau dạ dày","nóng rát dạ dày","acid dạ dày","đầy hơi"] },

  { name: "Smecta", group: "Dạ dày - Tiêu chảy", common_dose: "1 gói",
    instruction: "Pha với nước, uống sau ăn", max_per_day: 3,
    warning: "Uống cách thuốc khác ít nhất 2 giờ.",
    interactions: [],
    symptoms: ["tiêu chảy","đau bụng tiêu chảy","đi ngoài","phân lỏng","rối loạn tiêu hóa","đau bụng"] },

  { name: "Loperamide", group: "Dạ dày - Tiêu chảy", common_dose: "2mg",
    instruction: "Sau mỗi lần tiêu chảy", max_per_day: 4,
    warning: "Không dùng khi tiêu chảy do nhiễm khuẩn có sốt.",
    interactions: [],
    symptoms: ["tiêu chảy cấp","đi ngoài nhiều lần","phân lỏng","tiêu chảy du lịch"] },

  { name: "Oresol", group: "Bù nước - Điện giải", common_dose: "1 gói/200ml",
    instruction: "Pha đúng tỉ lệ, uống từ từ", max_per_day: 10,
    warning: "Pha đúng lượng nước theo hướng dẫn.",
    interactions: [],
    symptoms: ["tiêu chảy","mất nước","nôn mửa","sốt cao mất nước","điện giải"] },

  // Huyết áp / Tim mạch
  { name: "Amlodipine", group: "Huyết áp", common_dose: "5mg",
    instruction: "Bất kỳ lúc nào trong ngày", max_per_day: 1,
    warning: "Không ngừng thuốc đột ngột.",
    interactions: ["Simvastatin","Cyclosporine"],
    symptoms: ["huyết áp cao","tăng huyết áp","đau thắt ngực","tim mạch","huyết áp"] },

  { name: "Losartan", group: "Huyết áp", common_dose: "50mg",
    instruction: "Bất kỳ lúc nào", max_per_day: 1,
    warning: "Theo dõi kali máu. Không dùng khi mang thai.",
    interactions: ["Potassium","NSAIDs","Lithium"],
    symptoms: ["huyết áp cao","tăng huyết áp","tim mạch","suy tim","bảo vệ thận tiểu đường"] },

  { name: "Metformin", group: "Tiểu đường", common_dose: "500mg",
    instruction: "Trong hoặc sau bữa ăn", max_per_day: 3,
    warning: "Ngừng trước chụp CT có cản quang 48 giờ.",
    interactions: ["Alcohol","Contrast dye"],
    symptoms: ["tiểu đường type 2","đường huyết cao","kháng insulin","béo phì tiểu đường"] },

  { name: "Atorvastatin", group: "Mỡ máu", common_dose: "20mg",
    instruction: "Buổi tối", max_per_day: 1,
    warning: "Báo ngay nếu đau cơ bất thường.",
    interactions: ["Warfarin","Erythromycin","Cyclosporine"],
    symptoms: ["mỡ máu cao","cholesterol cao","phòng ngừa tim mạch","triglyceride cao"] },

  { name: "Simvastatin", group: "Mỡ máu", common_dose: "20mg",
    instruction: "Buổi tối", max_per_day: 1,
    warning: "Không ăn bưởi khi dùng thuốc.",
    interactions: ["Amlodipine","Warfarin","Erythromycin"],
    symptoms: ["mỡ máu cao","cholesterol cao","phòng ngừa tim mạch"] },

  // Hô hấp
  { name: "Salbutamol", group: "Hô hấp - Giãn phế quản", common_dose: "2mg",
    instruction: "Khi cần hoặc theo chỉ định", max_per_day: 4,
    warning: "Có thể gây hồi hộp, run tay.",
    interactions: ["Beta-blockers"],
    symptoms: ["hen suyễn","khó thở","co thắt phế quản","thở khò khè","viêm phế quản"] },

  { name: "Cetirizine", group: "Dị ứng", common_dose: "10mg",
    instruction: "Buổi tối", max_per_day: 1,
    warning: "Có thể gây buồn ngủ nhẹ.",
    interactions: [],
    symptoms: ["dị ứng","viêm mũi dị ứng","nổi mề đay","ngứa mắt","hắt hơi","chảy nước mũi"] },

  { name: "Loratadine", group: "Dị ứng", common_dose: "10mg",
    instruction: "Bất kỳ lúc nào", max_per_day: 1,
    warning: "Ít gây buồn ngủ hơn thuốc kháng histamine thế hệ cũ.",
    interactions: [],
    symptoms: ["dị ứng","viêm mũi dị ứng","nổi mề đay","ngứa da","hắt hơi"] },

  { name: "Bromhexine", group: "Hô hấp - Long đờm", common_dose: "8mg",
    instruction: "Sau ăn", max_per_day: 3,
    warning: "Uống nhiều nước khi dùng thuốc.",
    interactions: [],
    symptoms: ["ho có đờm","đờm đặc","viêm phế quản","viêm phổi","khó khạc đờm"] },

  { name: "Acetylcysteine", group: "Hô hấp - Long đờm", common_dose: "200mg",
    instruction: "Sau ăn", max_per_day: 3,
    warning: "Có mùi khó chịu là bình thường.",
    interactions: [],
    symptoms: ["ho có đờm","đờm đặc","viêm phế quản mạn","khó khạc đờm"] },

  // Vitamin / Khoáng chất
  { name: "Vitamin C 500mg", group: "Vitamin - Khoáng chất", common_dose: "500mg",
    instruction: "Sau ăn", max_per_day: 2,
    warning: "Liều cao có thể gây sỏi thận.",
    interactions: [],
    symptoms: ["thiếu vitamin C","tăng sức đề kháng","mệt mỏi","cảm cúm","chảy máu chân răng"] },

  { name: "Vitamin D3 1000IU", group: "Vitamin - Khoáng chất", common_dose: "1000IU",
    instruction: "Sau bữa ăn có chất béo", max_per_day: 1,
    warning: "Không tự ý dùng liều cao.",
    interactions: [],
    symptoms: ["thiếu vitamin D","loãng xương","còi xương","yếu xương","thiếu nắng"] },

  { name: "Canxi D3", group: "Vitamin - Khoáng chất", common_dose: "1 viên",
    instruction: "Sau bữa ăn", max_per_day: 2,
    warning: "Cách thuốc kháng sinh ít nhất 2 giờ.",
    interactions: ["Ciprofloxacin","Doxycycline","Iron"],
    symptoms: ["loãng xương","thiếu canxi","chuột rút","yếu xương","đau xương","mang thai"] },

  { name: "Sắt Ferro", group: "Vitamin - Khoáng chất", common_dose: "325mg",
    instruction: "Lúc đói hoặc trước ăn 30 phút", max_per_day: 1,
    warning: "Có thể gây táo bón, phân đen là bình thường.",
    interactions: ["Calcium","Antacid","Ciprofloxacin"],
    symptoms: ["thiếu máu thiếu sắt","mệt mỏi","da xanh","thiếu máu","mang thai thiếu sắt"] },

  // Thần kinh / Giấc ngủ
  { name: "Melatonin", group: "Giấc ngủ", common_dose: "3mg",
    instruction: "30 phút trước khi ngủ", max_per_day: 1,
    warning: "Không lái xe sau khi uống.",
    interactions: [],
    symptoms: ["mất ngủ","khó ngủ","rối loạn giấc ngủ","lệch múi giờ","ngủ không sâu"] },

  // Da liễu / TMH
  { name: "Strepsils", group: "Tai Mũi Họng", common_dose: "1 viên ngậm",
    instruction: "Ngậm tan từ từ", max_per_day: 8,
    warning: "Không nuốt nguyên viên.",
    interactions: [],
    symptoms: ["đau họng","viêm họng","khó nuốt","họng khô rát","viêm amidan nhẹ"] },

  { name: "Cetirizine nhỏ mắt", group: "Tai Mũi Họng", common_dose: "1-2 giọt",
    instruction: "Nhỏ 1-2 giọt mỗi mắt", max_per_day: 4,
    warning: "Không chạm đầu lọ vào mắt.",
    interactions: [],
    symptoms: ["ngứa mắt","đỏ mắt","dị ứng mắt","viêm kết mạc dị ứng"] },

  { name: "Hydrocortisone cream", group: "Da liễu", common_dose: "Thoa mỏng",
    instruction: "Thoa 1-2 lần/ngày", max_per_day: 2,
    warning: "Không dùng dài hạn. Không bôi lên mặt kéo dài.",
    interactions: [],
    symptoms: ["viêm da","ngứa da","phát ban","chàm","dị ứng da","mẩn đỏ","côn trùng cắn"] },

  { name: "Albendazole", group: "Chống ký sinh trùng", common_dose: "400mg",
    instruction: "Sau ăn có chất béo", max_per_day: 1,
    warning: "Không dùng cho phụ nữ mang thai.",
    interactions: [],
    symptoms: ["giun sán","nhiễm giun","giun đũa","giun kim","giun móc","tẩy giun"] },
];

export const SCHEDULE_MAP = {
  1: ['07:00'],
  2: ['07:00', '21:00'],
  3: ['07:00', '13:00', '20:00'],
  4: ['07:00', '11:00', '16:00', '21:00'],
};

export function searchMedicines(query, limit = 8) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MEDICINE_DB.filter(m => m.name.toLowerCase().includes(q)).slice(0, limit);
}

export function searchBySymptom(query, limit = 10) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const keywords = q.split(' ').filter(k => k.length >= 2);
  const scored = [];
  for (const med of MEDICINE_DB) {
    const symptoms = med.symptoms.map(s => s.toLowerCase());
    let score = 0;
    for (const sym of symptoms) {
      if (q.includes(sym) || sym.includes(q)) score += 10;
      else for (const kw of keywords) { if (sym.includes(kw)) score += 3; }
    }
    const group = med.group.toLowerCase();
    if (group.includes(q) || keywords.some(kw => kw.length >= 3 && group.includes(kw))) score += 5;
    if (score > 0) scored.push({ score, med });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.med);
}

export function checkInteractions(medicineNames) {
  const warnings = [];
  for (const name of medicineNames) {
    const med = MEDICINE_DB.find(m => m.name === name);
    if (!med) continue;
    for (const interaction of med.interactions) {
      for (const other of medicineNames) {
        if (other === name) continue;
        if (interaction.toLowerCase().includes(other.toLowerCase()) ||
            other.toLowerCase().includes(interaction.toLowerCase())) {
          const pair = `⚠️ ${name} + ${other}: tương tác — kiểm tra với dược sĩ`;
          if (!warnings.includes(pair)) warnings.push(pair);
        }
      }
    }
  }
  return warnings;
}

export const QUICK_TAGS = [
  'đau đầu','sốt','ho khan','ho có đờm','đau họng','nghẹt mũi',
  'tiêu chảy','buồn nôn','đau dạ dày','ợ chua','mất ngủ','dị ứng',
  'ngứa da','đau lưng','viêm khớp','mệt mỏi','huyết áp cao',
  'mỡ máu','tiểu đường','tê tay chân','giun sán','chuột rút','thiếu máu',
];
