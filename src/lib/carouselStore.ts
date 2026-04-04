import image1 from "@/assets/1.jpg";
import image2 from "@/assets/2.jpg";
import image3 from "@/assets/3.jpg";
import image4 from "@/assets/4.jpg";
import image5 from "@/assets/5.jpg";

export interface CarouselItem {
  id: string;
  title: string;
  image: string;
  link: string;
  status?: string;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  { id: "1", title: "GÓI CAO CẤP", image: image1, link: "https://docs.google.com/spreadsheets/d/1gH_jU_s6lUum9Gxe_-vsUpQVAsOlxrK6xBLFEnOIHU0", status: "" },
  { id: "2", title: "GÓI CAO CẤP", image: image2, link: "https://docs.google.com/spreadsheets/d/1SPbKyMrC-F8TV2RlYpbbBPaH0tJHtnwd9n9-fr6KbWc", status: "" },
  { id: "3", title: "GÓI TRANG TRỌNG", image: image3, link: "https://docs.google.com/spreadsheets/d/11Ovj2RiXLrxDGiRgeXnsNbt2K7OvdQjp4WTlkQDJC3Q/edit?usp=sharing", status: "" },
  { id: "4", title: "GÓI CAO CẤP", image: image4, link: "https://docs.google.com/spreadsheets/d/10YzOblpNjtrp4RxjnW0kRNx7INHqOcTm_FojQTAUvvo", status: "" },
  { id: "5", title: "GÓI TIÊU CHUẨN", image: image5, link: "https://docs.google.com/spreadsheets/d/13D10I1H5rV4xkLfCQdNiJ3VhYaDZe-ws8uwxXxJUl_Q/edit?usp=sharing", status: "" },
];

const STORAGE_KEY = "carousel_items_v2";

export function getItems(): CarouselItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
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
