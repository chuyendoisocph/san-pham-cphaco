import image1 from "@/assets/1.jpg";
import image2 from "@/assets/2.jpg";
import image3 from "@/assets/3.jpg";
import image4 from "@/assets/4.jpg";
import image5 from "@/assets/5.jpg";
import image6 from "@/assets/6.jpg";

export interface ZoneSpec {
  label: string;
  value: string;
}

export interface CarouselItem {
  id: string;
  /** Tên khu, vd "Song Thân" */
  name?: string;
  /** Hạng gói, vd "GÓI CAO CẤP" */
  title: string;
  /** Poster của khu */
  image: string;
  /** Link bảng giá; để trống nếu chưa có */
  link: string;
  /** Giá khởi điểm hiện cạnh tên khu, vd "Giá từ 350 triệu". Để trống thì không hiện. */
  priceFrom?: string;
  /** Nhãn nổi bật, vd "Đang mở bán". Khu đầu danh sách được ưu tiên hiển thị. */
  status?: string;

  // --- Thông tin lấy từ poster. Khi đổi poster, nhớ cập nhật các trường này. ---
  /** Loại khu, vd "Mộ đơn – đôi", "Mộ gia tộc" */
  kind?: string;
  /** Câu giới thiệu ngắn */
  tagline?: string;
  /** Thông tin nổi bật */
  highlights?: string[];
  /** Khu này phù hợp với ai */
  note?: string;
  /** Thông tin chung: diện tích, đường… */
  specs?: ZoneSpec[];
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: "6",
    name: "Phúc Mãn Linh Trang",
    title: "KHU MỘ GIA TỘC",
    image: image6,
    link: "https://docs.google.com/spreadsheets/d/18D0VVeUmdOZgY0G13Rh7ZXwB0WO5lVwWqUu3cysx_-Q/edit?gid=0#gid=0",
    status: "",
    kind: "Mộ gia tộc",
    tagline: "Đất quý bởi vị trí – Gia tộc quý bởi phúc đức – Nơi an nghỉ quý bởi nghĩa ân truyền đời",
    highlights: [
      "Vị trí tôn quý: trên trục chính hướng về Chùa Một Cột (thờ tượng Vua Cõng Phật).",
      "Không gian riêng biệt: khuôn viên 64 m², bố trí tối đa 10 phần mộ.",
      "Phúc ân tiếp nối: nơi nhiều thế hệ cùng an nghỉ, sum vầy.",
      "Giá trị hữu hạn: quỹ đất trên trục chính được quy hoạch, số lượng có hạn.",
    ],
    note: "Phù hợp với gia đình, dòng họ mong muốn quy tụ nhiều thế hệ về cùng một không gian an viên.",
    specs: [
      { label: "Khuôn viên", value: "64 m²" },
      { label: "Bố trí tối đa", value: "10 phần mộ" },
      { label: "Vị trí", value: "Trục chính vào Chùa Một Cột" },
    ],
  },
  {
    id: "1",
    name: "Song Thân",
    title: "GÓI CAO CẤP",
    image: image1,
    link: "https://docs.google.com/spreadsheets/d/1gH_jU_s6lUum9Gxe_-vsUpQVAsOlxrK6xBLFEnOIHU0",
    status: "",
    kind: "Mộ song thân",
    tagline: "Không gian gia tộc – Tôn vinh Song Thân – Kết nối nhiều thế hệ",
    highlights: [
      "Quy hoạch liền kề, đồng bộ kiến trúc, tạo nên quần thể đẳng cấp.",
      "Khu mộ song thân trong không gian nhà thờ họ tộc.",
      "Tích hợp không gian lưu cốt nhiều thế hệ, quy tụ gia đình.",
      "Vị trí trung tâm dự án, quỹ đất giá trị cao, giới hạn số lượng.",
    ],
    note: "Ưu tiên quý khách quan tâm thiết kế riêng biệt theo dấu ấn từng gia tộc.",
    specs: [
      { label: "Diện tích tiêu chuẩn", value: "66 m²" },
      { label: "An táng, lưu cốt tối đa", value: "10 phần" },
      { label: "Đường chính", value: "6 m" },
    ],
  },
  {
    id: "2",
    name: "Linh Hoa Tuệ Đàn",
    title: "GÓI CAO CẤP",
    image: image2,
    link: "https://docs.google.com/spreadsheets/d/1SPbKyMrC-F8TV2RlYpbbBPaH0tJHtnwd9n9-fr6KbWc",
    status: "",
    kind: "Mộ đơn – đôi",
    tagline: "Huyệt mộ chuẩn phong thuỷ – Đón vượng khí trọn đời",
    highlights: [
      "Dễ dàng tìm vị trí “Toạ cát – Hướng cát”.",
      "Trung tâm tổ chức lễ hội tâm linh lớn hằng năm.",
    ],
    note: "Ưu tiên khách hàng quan tâm chuyên sâu về chọn hướng huyệt mộ theo phong thuỷ.",
    specs: [
      { label: "Diện tích tiêu chuẩn", value: "10,87 m²/phần mộ" },
      { label: "Đường chính", value: "Đại lộ Vĩnh Hằng" },
      { label: "Đường nội khu", value: "5,2 m" },
      { label: "Đường giữa hai hàng mộ", value: "2 m" },
    ],
  },
  {
    id: "3",
    name: "Khu Đại Lộ Vĩnh Hằng",
    title: "GÓI TRANG TRỌNG",
    image: image3,
    link: "https://docs.google.com/spreadsheets/d/11Ovj2RiXLrxDGiRgeXnsNbt2K7OvdQjp4WTlkQDJC3Q/edit?usp=sharing",
    status: "",
    kind: "Mộ đơn – đôi",
    tagline: "Vị trí trung tâm – Dễ thăm viếng – Gần trọn tâm linh",
    highlights: [
      "Gần cổng chính Hoa Viên 200 m.",
      "Kề cận các công trình tâm linh giá trị cao, quy hoạch hợp lý.",
      "Di chuyển thuận tiện, dễ tìm, dễ đến.",
    ],
    note: "Ưu tiên quý khách quan tâm thuận tiện thăm viếng người thân.",
    specs: [
      { label: "Diện tích tiêu chuẩn", value: "11,63 m²/phần mộ" },
      { label: "Đường chính", value: "Trục thần đạo Đại Lộ Vĩnh Hằng" },
      { label: "Đường nội khu", value: "4 – 6 m" },
      { label: "Đường giữa hai hàng mộ", value: "2 m" },
    ],
  },
  {
    id: "4",
    name: "Trúc Lâm Bích Thuỷ",
    title: "GÓI CAO CẤP",
    image: image4,
    link: "https://docs.google.com/spreadsheets/d/10YzOblpNjtrp4RxjnW0kRNx7INHqOcTm_FojQTAUvvo",
    status: "",
    kind: "Mộ gia tộc",
    tagline: "Rừng tre xanh – Dòng suối biếc – Chốn về an lạc – Phúc trạch muôn đời",
    highlights: [
      "Đất cao thoáng, dốc nhẹ tự nhiên, toạ trên thế “Rồng cuộn Hổ ngồi”, phong thuỷ hướng sông tựa núi.",
      "Tượng Phật nhập Niết Bàn bề thế, ban phước lành, dẫn lối vãng sanh.",
      "Chốn an nghỉ uy nghi, mang lại vạn sự cát tường cho gia đạo.",
    ],
    note: "Ưu tiên quý khách quan tâm về cảnh quan sinh thái, suối mát rừng tre.",
    specs: [
      { label: "Diện tích tiêu chuẩn", value: "64 – 81 m²" },
      { label: "An táng tối đa", value: "10 phần mộ" },
      { label: "Đường chính", value: "Đường Thiên Thai" },
      { label: "Đường nội khu", value: "3,6 – 4,5 m" },
    ],
  },
  {
    id: "5",
    name: "Long Phụng Minh Đồ",
    title: "GÓI TIÊU CHUẨN",
    image: image5,
    link: "https://docs.google.com/spreadsheets/d/13D10I1H5rV4xkLfCQdNiJ3VhYaDZe-ws8uwxXxJUl_Q/edit?usp=sharing",
    status: "",
    kind: "Mộ đơn – đôi",
    tagline: "Thế đất Long – Phụng hội tụ, phong thuỷ cân bằng, cảnh quan xanh, yên tĩnh, dễ thăm viếng",
    highlights: [
      "Quy hoạch chuẩn, đất cao ráo, không ngập.",
      "Khu mộ đơn và mộ đôi, diện tích trung bình hợp lý.",
      "Giá tốt, phù hợp nhiều đối tượng khách hàng.",
      "Gần chùa Thiên Phước, thuận tiện hương khói.",
    ],
    note: "Ưu tiên quý khách quan tâm về vị trí gần chùa và mức giá tối ưu.",
    specs: [
      { label: "Diện tích tiêu chuẩn", value: "5,735 m²/phần mộ" },
      { label: "Đường chính", value: "Đường Minh Đạo, Minh Lộc" },
      { label: "Đường nội khu", value: "4,5 m" },
      { label: "Đường giữa hai hàng mộ", value: "2 m" },
    ],
  },
];

const STORAGE_KEY = "carousel_items_v2";

export function getItems(): CarouselItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed: CarouselItem[] = JSON.parse(stored);
      // Dữ liệu đã lưu (từ trang quản trị) có thể thiếu tên khu và thông tin poster:
      // lấy bù từ dữ liệu mặc định của khu cùng id.
      return parsed.map((item) => {
        const d = DEFAULT_ITEMS.find((x) => x.id === item.id);
        if (!d) return item;
        return {
          ...item,
          name: item.name ?? d.name,
          priceFrom: item.priceFrom ?? d.priceFrom,
          kind: item.kind ?? d.kind,
          tagline: item.tagline ?? d.tagline,
          highlights: item.highlights ?? d.highlights,
          note: item.note ?? d.note,
          specs: item.specs ?? d.specs,
        };
      });
    } catch {
      return DEFAULT_ITEMS;
    }
  }
  return DEFAULT_ITEMS;
}

export function saveItems(items: CarouselItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addItem(item: Omit<CarouselItem, "id">) {
  const items = getItems();
  const newItem = { ...item, id: Date.now().toString() };
  items.push(newItem);
  saveItems(items);
  return items;
}

export function removeItem(id: string) {
  const items = getItems().filter((i) => i.id !== id);
  saveItems(items);
  return items;
}

export function updateItem(id: string, updates: Partial<CarouselItem>) {
  const items = getItems().map((i) => (i.id === id ? { ...i, ...updates } : i));
  saveItems(items);
  return items;
}
