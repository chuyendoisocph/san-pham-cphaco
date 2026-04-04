import CircularCarousel from "@/components/CircularCarousel";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "var(--gradient-theme)",
      }}
    >
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl ambient-blob" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl ambient-blob animate-delay-2" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 animate-in-up animate-delay-1">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo CPHA"
            className="h-14 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
    
          </h1>
        </div>
        {/* <a
          href="/admin"
          className="text-sm text-foreground/70 hover:text-foreground transition-colors underline"
        >
          Quản trị
        </a> */}
      </header>

      {/* Carousel */}
      <main className="relative z-10 flex-1 flex flex-col flex-nowrap items-center justify-center animate-in-up animate-delay-2 pt-6">
        <div className="text-center mb-6 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground drop-shadow-md">
            CÁC GÓI HUYỆT MỘ ĐƠN - ĐÔI
          </h2>
          <p className="text-xl md:text-2xl font-medium text-foreground/90 mt-2 drop-shadow-sm">
            Hoa Viên Nghĩa Trang Bình Dương - Nơi Cuộc Sống Vĩnh Hằng
          </p>
        </div>
        <CircularCarousel />
      </main>
    </div>
  );
};

export default Index;
