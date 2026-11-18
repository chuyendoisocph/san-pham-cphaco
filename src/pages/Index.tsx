import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, MessageCircle, Phone, X, ZoomIn, ZoomOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { getItems, type CarouselItem } from "@/lib/carouselStore";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/** Thời gian mỗi poster hiển thị khi poster máy tính tự chuyển */
const AUTO_MS = 6000;

const HOTLINE = "0818 555 444";
const HOTLINE_TEL = "tel:0818555444";
/** Số Zalo tư vấn, vd "0818555444". Để trống thì không hiện nút Zalo. */
const ZALO: string = "";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "GÓI CAO CẤP" -> "Gói cao cấp" */
const formatTier = (tier: string) => {
  const lower = tier.trim().toLocaleLowerCase("vi");
  return lower.charAt(0).toLocaleUpperCase("vi") + lower.slice(1);
};

const nameOf = (item: CarouselItem) => item.name ?? formatTier(item.title);

/** Nhãn phụ dưới tên khu: "Mộ đơn – đôi · Gói cao cấp" */
const labelOf = (item: CarouselItem) => {
  const tier = /^gói/i.test(item.title.trim()) ? formatTier(item.title) : null;
  return [item.kind, tier].filter(Boolean).join(" · ") || formatTier(item.title);
};

/** Link Google Sheets -> bản chỉ xem (không hiện thanh công cụ chỉnh sửa) */
const viewUrl = (link: string) => {
  const id = link.match(/docs\.google\.com\/spreadsheets\/d\/([\w-]+)/)?.[1];
  if (!id) return link;
  const gid = link.match(/[#?&]gid=(\d+)/)?.[1];
  return `https://docs.google.com/spreadsheets/d/${id}/htmlview${gid ? `?gid=${gid}` : ""}`;
};

/** Khoảng cách vòng tròn giữa hai vị trí trong danh sách */
const ringDistance = (a: number, b: number, n: number) => Math.min((a - b + n) % n, (b - a + n) % n);

/** Thông tin của khu lấy từ poster: câu giới thiệu, điểm nổi bật, thông số */
const ZoneDetails = ({ item }: { item: CarouselItem }) => (
  <>
    {item.tagline && (
      <p className="font-serif text-xl font-medium italic leading-snug text-foreground/80">{item.tagline}</p>
    )}
    {item.highlights && item.highlights.length > 0 && (
      <ul className="mt-4 space-y-2">
        {item.highlights.map((h) => (
          <li key={h} className="flex gap-3 text-[15px] leading-snug text-foreground/85">
            <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--gold))]" />
            {h}
          </li>
        ))}
      </ul>
    )}
    {item.note && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.note}</p>}
    {item.specs && item.specs.length > 0 && (
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4">
        {item.specs.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-primary">{s.value}</dd>
          </div>
        ))}
      </dl>
    )}
  </>
);

/** Tên khu, loại khu và giá khởi điểm (nếu có) */
const ZoneHeading = ({ item, size }: { item: CarouselItem; size: "sm" | "lg" }) => (
  <div className="min-w-0">
    <h2
      className={cn(
        "font-serif font-semibold leading-none tracking-[-0.01em] text-primary",
        size === "lg" ? "text-4xl" : "text-[1.75rem]",
      )}
    >
      {nameOf(item)}
    </h2>
    <p className="mt-1.5 text-sm text-muted-foreground">
      {labelOf(item)}
      {item.priceFrom && (
        <>
          <span aria-hidden="true"> · </span>
          <span className="font-semibold text-primary">{item.priceFrom}</span>
        </>
      )}
    </p>
  </div>
);

const btnBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] px-5 text-sm font-semibold transition-[background-color,transform,box-shadow] active:scale-[0.98]";
const btnPrimary = "bg-primary text-primary-foreground hover:bg-[hsl(219_60%_24%)]";
const btnOutline =
  "bg-card text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)] hover:shadow-[inset_0_0_0_1px_hsl(var(--primary))]";

/** Mở bảng giá; khu chưa có bảng giá thì mời gọi hotline hỏi giá */
const PriceButton = ({ item, className }: { item: CarouselItem; className?: string }) =>
  item.link ? (
    <a href={viewUrl(item.link)} target="_blank" rel="noopener noreferrer" className={cn(btnBase, btnPrimary, className)}>
      Xem bảng giá <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  ) : (
    <a href={HOTLINE_TEL} className={cn(btnBase, btnPrimary, className)}>
      <Phone className="h-4 w-4 text-[hsl(var(--gold))]" aria-hidden="true" /> Hỏi giá qua hotline
    </a>
  );

const ZaloButton = ({ className }: { className?: string }) =>
  ZALO ? (
    <a
      href={`https://zalo.me/${ZALO.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(btnBase, btnOutline, className)}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" /> Nhắn Zalo
    </a>
  ) : null;

const Index = () => {
  const [items] = useState(() => getItems());
  const n = items.length;
  /** Khu đang chọn: luôn bắt đầu ở khu đầu tiên (Phúc Mãn Linh Trang) */
  const [activeIndex, setActiveIndex] = useState(0);
  const [preview, setPreview] = useState<CarouselItem | null>(null);
  const [zoomed, setZoomed] = useState(false);

  // Poster máy tính tự xoay khi khách chưa làm gì. Phần thông tin bên phải không đổi theo.
  // Khách chạm, bấm, gõ phím hay cuộn là dừng hẳn và poster quay về khu đang chọn.
  const [posterIndex, setPosterIndex] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [posterHover, setPosterHover] = useState(false);
  const rotating = !interacted && !posterHover && preview === null && n > 1 && !prefersReducedMotion();
  const shownPoster = interacted ? activeIndex : posterIndex;

  useEffect(() => {
    if (interacted) return;
    const stop = () => setInteracted(true);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, stop));
  }, [interacted]);

  useEffect(() => {
    if (!rotating) return;
    const t = window.setTimeout(() => setPosterIndex((i) => (i + 1) % n), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [posterIndex, rotating, n]);

  /** Khách chọn khu */
  const pick = (i: number) => {
    setActiveIndex(((i % n) + n) % n);
    setInteracted(true);
  };

  /** Phím mũi tên / Home / End trong danh sách khu */
  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? i + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? i - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    const target = ((next % n) + n) % n;
    pick(target);
    (e.currentTarget.parentElement?.children[target] as HTMLElement | undefined)?.focus();
  };

  // Chỉ tải poster gần khu đang xem (và những poster đã từng xem)
  const loaded = useRef(new Set<number>());
  const shouldLoad = (i: number, center: number) => {
    if (ringDistance(i, center, n) <= 1) loaded.current.add(i);
    return loaded.current.has(i);
  };

  // Điện thoại: vuốt ngang trên poster để đổi khu
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 40) {
      swiped.current = true;
      pick(activeIndex + (dx < 0 ? 1 : -1));
    }
  };

  const openPreview = (item: CarouselItem) => {
    setZoomed(false);
    setPreview(item);
  };

  // Phóng to: cuộn ảnh về giữa
  const viewerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !zoomed) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = 0;
  }, [zoomed]);

  const active = items[activeIndex] ?? items[0];
  const posterItem = items[shownPoster] ?? items[0];
  if (!active) return null;

  return (
    <div className="min-h-dvh bg-background lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* ---------- Máy tính: poster ---------- */}
      <section
        aria-label="Poster khu mộ"
        className="relative hidden p-4 lg:block"
        onMouseEnter={() => setPosterHover(true)}
        onMouseLeave={() => setPosterHover(false)}
      >
        <div className="relative h-full overflow-hidden rounded-[calc(var(--radius)+6px)] bg-primary">
          {items.map((item, i) => {
            const isShown = i === shownPoster;
            if (!shouldLoad(i, shownPoster)) return null;
            return (
              <div
                key={item.id}
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-out",
                  isShown ? "opacity-100" : "opacity-0",
                )}
              >
                {/* Nền: chính poster được phóng to và làm mờ, phủ lớp navy */}
                <img src={item.image} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
                <div className="absolute inset-0 bg-[hsl(var(--primary)/0.5)]" />
                <div className="absolute inset-0 grid place-items-center p-6 pb-16 [container-type:size] xl:p-8 xl:pb-16">
                  <img
                    src={item.image}
                    alt=""
                    className={cn(
                      "aspect-[4/5] h-[min(100cqh,125cqw)] w-auto rounded-[var(--radius)] object-cover shadow-[0_28px_60px_-18px_rgb(8_18_40/0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isShown ? "scale-100" : "scale-[0.97]",
                    )}
                  />
                </div>
              </div>
            );
          })}

          {/* Bấm vào poster để phóng to */}
          <button
            type="button"
            // Giữ đúng poster khách vừa bấm, trước khi việc tự xoay dừng lại
            onPointerDown={() => !interacted && setActiveIndex(posterIndex)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !interacted && setActiveIndex(posterIndex)}
            onClick={() => {
              pick(shownPoster);
              openPreview(posterItem);
            }}
            aria-label={`Phóng to poster ${nameOf(posterItem)}`}
            className="group absolute inset-0 cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--gold))]"
          >
            <span className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[hsl(220_50%_10%/0.55)] px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors group-hover:bg-[hsl(220_50%_10%/0.75)]">
              <Expand className="h-4 w-4 text-[hsl(var(--gold))]" aria-hidden="true" />
              {shownPoster === activeIndex ? "Bấm để phóng to" : `${nameOf(posterItem)} · bấm để xem`}
            </span>
          </button>

          {/* Thanh tiến trình tự chuyển */}
          {rotating && (
            <span
              key={posterIndex}
              aria-hidden="true"
              className="auto-progress pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[hsl(var(--gold))]"
              style={{ animationDuration: `${AUTO_MS}ms` }}
            />
          )}
        </div>
      </section>

      <main className="rise-in flex min-h-dvh flex-col px-5 pb-32 pt-4 sm:px-10 sm:pb-8 sm:pt-8 lg:min-h-0 lg:overflow-y-auto lg:px-14 lg:py-6 xl:px-16">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo CPHA Co." className="h-11 w-11 object-contain sm:h-12 sm:w-12" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Hoa Viên Nghĩa Trang Bình Dương</p>
              <p className="text-xs text-muted-foreground">Nơi cuộc sống vĩnh hằng</p>
            </div>
          </div>
          <a
            href={HOTLINE_TEL}
            className="hidden min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_6px_16px_-8px_hsl(var(--primary)/0.6)] transition-[background-color,transform] hover:bg-[hsl(219_60%_24%)] active:scale-[0.98] sm:inline-flex"
          >
            <Phone className="h-4 w-4 text-[hsl(var(--gold))]" aria-hidden="true" />
            <span className="[font-variant-numeric:tabular-nums]">{HOTLINE}</span>
          </a>
        </header>

        <div className="mt-6 sm:mt-12 lg:mt-5">
          <span aria-hidden="true" className="mb-3 block h-0.5 w-10 rounded-full bg-[hsl(var(--gold))] sm:mb-5 lg:mb-4" />
          <h1 className="font-serif text-[2.125rem] font-semibold leading-none tracking-[-0.01em] text-primary sm:text-6xl lg:text-[2.5rem]">
            Các khu mộ tiêu biểu
          </h1>
        </div>

        {/* ---------- Danh sách khu (dùng chung điện thoại và máy tính) ---------- */}
        <div
          role="tablist"
          aria-label="Các khu"
          className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 lg:mt-4 xl:grid-cols-3"
        >
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`khu-tab-${item.id}`}
                aria-selected={isActive}
                aria-controls="khu-dang-chon"
                tabIndex={isActive ? 0 : -1}
                onClick={() => pick(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "flex min-h-11 flex-col justify-center rounded-[var(--radius)] px-3 py-2 text-left outline-none transition-[background-color,box-shadow,color] duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:min-h-16 lg:px-4",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_hsl(var(--primary)/0.8)]"
                    : "bg-card text-foreground shadow-[0_0_0_1px_hsl(var(--border))] hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.45)]",
                )}
              >
                <span className="line-clamp-2 text-[13px] font-semibold leading-tight sm:text-sm lg:font-serif lg:text-lg lg:leading-[1.1]">
                  {nameOf(item)}
                </span>
                <span
                  className={cn(
                    "mt-0.5 hidden text-xs lg:block",
                    isActive ? "text-primary-foreground/75" : "text-muted-foreground",
                  )}
                >
                  {item.kind ?? labelOf(item)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---------- Khu đang chọn ---------- */}
        <section id="khu-dang-chon" role="tabpanel" aria-labelledby={`khu-tab-${active.id}`} className="mt-5 lg:mt-5">
          {/* Điện thoại: tên khu, poster vuốt được, thông tin */}
          <div className="lg:hidden">
            <div key={`m-${active.id}`} className="detail-in mb-3">
              <ZoneHeading item={active} size="sm" />
            </div>

            <div
              className="relative overflow-clip rounded-[calc(var(--radius)+4px)] bg-secondary shadow-[0_18px_40px_-20px_hsl(var(--primary)/0.45),0_0_0_1px_hsl(var(--border)/0.7)]"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [touch-action:pan-y]"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {items.map((item, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        // Không mở phóng to nếu vừa vuốt
                        if (swiped.current) {
                          swiped.current = false;
                          return;
                        }
                        openPreview(item);
                      }}
                      className="aspect-[4/5] w-full shrink-0 cursor-zoom-in"
                      aria-label={`Phóng to poster ${nameOf(item)}`}
                      aria-hidden={!isActive}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {shouldLoad(i, activeIndex) && (
                        <img
                          src={item.image}
                          alt=""
                          loading={isActive ? "eager" : "lazy"}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {n > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => pick(activeIndex - 1)}
                    aria-label="Khu trước"
                    className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur-sm transition active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => pick(activeIndex + 1)}
                    aria-label="Khu tiếp theo"
                    className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary shadow-md backdrop-blur-sm transition active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[hsl(220_50%_10%/0.55)] px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm [font-variant-numeric:tabular-nums]">
                {activeIndex + 1} / {n}
              </span>
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[hsl(220_50%_10%/0.55)] px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <Expand className="h-3.5 w-3.5 text-[hsl(var(--gold))]" aria-hidden="true" /> Chạm để phóng to
              </span>
            </div>

            <div key={`d-${active.id}`} className="detail-in pt-5">
              <div className="mb-5 hidden gap-2 sm:flex">
                <PriceButton item={active} className="flex-1" />
                <ZaloButton className="flex-1" />
              </div>
              <ZoneDetails item={active} />
              {ZALO && <ZaloButton className="mt-6 w-full sm:hidden" />}
            </div>
          </div>

          {/* Máy tính: thông tin khu đang chọn */}
          <div key={active.id} className="detail-in hidden border-t border-border pt-5 lg:block">
            <div className="mb-4 flex items-end justify-between gap-6">
              <ZoneHeading item={active} size="lg" />
              <div className="flex shrink-0 gap-2">
                <ZaloButton />
                <PriceButton item={active} className="px-6" />
              </div>
            </div>
            <ZoneDetails item={active} />
          </div>
        </section>

        <footer className="mt-auto pt-10 text-xs text-muted-foreground lg:pt-4">
          Công ty CP Đầu tư Xây dựng Chánh Phú Hòa
        </footer>
      </main>

      {/* Thanh cố định cuối màn hình (điện thoại): gọi hotline + bảng giá của khu đang chọn */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden">
        <a href={HOTLINE_TEL} aria-label={`Gọi hotline ${HOTLINE}`} className={cn(btnBase, btnOutline, "min-h-12 px-2")}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span className="[font-variant-numeric:tabular-nums]">{HOTLINE}</span>
        </a>
        <PriceButton item={active} className="min-h-12 px-2" />
      </div>

      {/* Xem poster toàn màn hình */}
      <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="left-0 top-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 border-0 bg-[hsl(220_50%_7%/0.97)] p-0 text-white sm:rounded-none data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 [&>button:last-child]:hidden">
          {preview && (
            <>
              <div className="flex items-center justify-between gap-3 px-4 py-2 sm:px-6">
                <DialogTitle className="truncate font-serif text-2xl font-semibold text-white">{nameOf(preview)}</DialogTitle>
                <DialogDescription className="sr-only">
                  Poster giới thiệu khu {nameOf(preview)}. Bấm vào ảnh để phóng to hoặc thu nhỏ.
                </DialogDescription>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => setZoomed((z) => !z)}
                    aria-label={zoomed ? "Thu nhỏ" : "Phóng to"}
                    className="grid h-11 w-11 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {zoomed ? <ZoomOut className="h-5 w-5" aria-hidden="true" /> : <ZoomIn className="h-5 w-5" aria-hidden="true" />}
                  </button>
                  <DialogClose
                    aria-label="Đóng"
                    className="grid h-11 w-11 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </DialogClose>
                </div>
              </div>

              <div
                ref={viewerRef}
                className={cn("min-h-0 flex-1 overflow-auto", !zoomed && "grid place-items-center px-2 sm:px-6")}
              >
                <img
                  src={preview.image}
                  alt={`Poster khu ${nameOf(preview)}`}
                  onClick={() => setZoomed((z) => !z)}
                  className={cn(
                    "select-none",
                    zoomed
                      ? "mx-auto block w-[max(100%,1080px)] max-w-none cursor-zoom-out"
                      : "max-h-full max-w-full cursor-zoom-in rounded-[calc(var(--radius)-2px)] object-contain",
                  )}
                />
              </div>

              <div className="mx-auto flex w-full max-w-md gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <PriceButton item={preview} className="min-h-12 flex-1" />
                <ZaloButton className="min-h-12 flex-1" />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
