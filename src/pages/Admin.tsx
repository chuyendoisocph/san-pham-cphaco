import { useState, useEffect } from "react";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { getItems, saveItems, addItem, removeItem, type CarouselItem } from "@/lib/carouselStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getItems());
  }, []);

  const handleAdd = () => {
    if (!title || !image || !link) return;
    const updated = addItem({ title, image, link, status: status || undefined });
    setItems(updated);
    setTitle("");
    setImage("");
    setLink("");
    setStatus("");
  };

  const handleRemove = (id: string) => {
    const updated = removeItem(id);
    setItems(updated);
  };

  return (
    <div className="min-h-screen bg-popover text-popover-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-popover-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </button>

        <h1 className="text-3xl font-bold mb-8">Quản lý Carousel</h1>

        {/* Add form */}
        <div className="rounded-xl border border-border p-6 mb-8 space-y-4 bg-card">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Thêm mục mới
          </h2>
          <Input
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="URL hình ảnh"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Input
            placeholder="Link đích (https://...)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Input
            placeholder="Trạng thái (vd: Sắp diễn ra)"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Button onClick={handleAdd} className="w-full">
            Thêm
          </Button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border p-4 bg-card"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-sm text-muted-foreground truncate">{item.link}</p>
                {item.status && (
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                )}
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-destructive hover:text-destructive/80 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
