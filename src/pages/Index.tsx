import { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { MeshGradient } from "@/components/waitlist";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

type TileConfig = {
  text: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
  videoUrl: string | null;
  videoName: string | null;
  bgColor: string;
  textColor: string;
};

const defaultTile = (): TileConfig => ({
  text: "",
  fontSize: 32,
  bold: false,
  italic: false,
  align: "center",
  videoUrl: null,
  videoName: null,
  bgColor: "rgba(255, 255, 255, 0.15)",
  textColor: "#ffffff",
});

const PRESET_TEXT_COLORS = [
  "#ffffff", "#000000", "#3b82f6", "#10b981",
  "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899",
];

const PRESET_COLORS = [
  "rgba(255, 255, 255, 0.15)",
  "rgba(59, 130, 246, 0.4)",
  "rgba(16, 185, 129, 0.4)",
  "rgba(239, 68, 68, 0.4)",
  "rgba(245, 158, 11, 0.4)",
  "rgba(139, 92, 246, 0.4)",
  "rgba(236, 72, 153, 0.4)",
  "rgba(0, 0, 0, 0.35)",
];

const STORAGE_KEY = "tiles_config";
const COUNT_KEY = "tiles_count";
const TILE_COUNTS = [6, 8, 10];

const loadTileCount = (): number => {
  const saved = localStorage.getItem(COUNT_KEY);
  const n = saved ? parseInt(saved) : 6;
  return TILE_COUNTS.includes(n) ? n : 6;
};

const loadTiles = (count: number): TileConfig[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as TileConfig[];
      const result = parsed.map((t) => ({ ...defaultTile(), ...t, videoUrl: null, videoName: null }));
      while (result.length < count) result.push(defaultTile());
      return result.slice(0, count);
    }
  } catch (e) {
    console.error(e);
  }
  return Array.from({ length: count }, defaultTile);
};

const Index = () => {
  const [tileCount, setTileCount] = useState<number>(loadTileCount);
  const [tiles, setTiles] = useState<TileConfig[]>(() => loadTiles(loadTileCount()));
  const [selected, setSelected] = useState<number>(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch (e) {
        console.error(e);
      }
    };
    requestWakeLock();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release();
    };
  }, []);

  useEffect(() => {
    const toSave = tiles.map((t) => ({ ...t, videoUrl: null, videoName: null }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [tiles]);

  const handleCountChange = (count: number) => {
    setTileCount(count);
    localStorage.setItem(COUNT_KEY, String(count));
    setTiles((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array.from({ length: count - prev.length }, defaultTile)];
      }
      return prev.slice(0, count);
    });
    setSelected((s) => (s >= count ? count - 1 : s));
  };

  const update = (index: number, patch: Partial<TileConfig>) => {
    setTiles((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update(selected, { videoUrl: url, videoName: file.name });
    e.target.value = "";
  };

  const handleTileClick = (t: TileConfig) => {
    if (t.videoUrl) setPlayingVideo(t.videoUrl);
  };

  const tile = tiles[selected];

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="antialiased bg-slate-1 w-screen h-screen overflow-hidden touch-none select-none">
        <MeshGradient
          colors={["#001c80", "#1ac7ff", "#04ffb1", "#ff1ff1"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoSelect}
        />

        <Sheet>
          <SheetTrigger asChild>
            <button
              className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full text-white transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Icon name="Settings" size={18} />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[360px] flex flex-col gap-6 overflow-y-auto pb-10">
            <SheetHeader>
              <SheetTitle className="text-xl">Настройки карточек</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium">Количество карточек</p>
              <div className="flex gap-2">
                {TILE_COUNTS.map((c) => (
                  <Button
                    key={c}
                    size="lg"
                    variant={tileCount === c ? "default" : "outline"}
                    onClick={() => handleCountChange(c)}
                    className="flex-1 h-12 text-base"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base text-muted-foreground font-medium">Выберите карточку</p>
              <div className="grid grid-cols-3 gap-2">
                {tiles.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`rounded-xl py-3 px-2 text-sm border transition-all truncate ${
                      selected === i
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {t.text ? t.text.slice(0, 10) : `Карточка ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Текст</label>
              <textarea
                value={tile.text}
                onChange={(e) => update(selected, { text: e.target.value })}
                placeholder="Введите текст..."
                rows={4}
                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-medium">Размер текста: {tile.fontSize}px</label>
              <Slider
                min={12}
                max={96}
                step={2}
                value={[tile.fontSize]}
                onValueChange={([v]) => update(selected, { fontSize: v })}
                className="py-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Стиль</label>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant={tile.bold ? "default" : "outline"}
                  onClick={() => update(selected, { bold: !tile.bold })}
                  className="font-bold text-lg w-14 h-12"
                >
                  B
                </Button>
                <Button
                  size="lg"
                  variant={tile.italic ? "default" : "outline"}
                  onClick={() => update(selected, { italic: !tile.italic })}
                  className="italic text-lg w-14 h-12"
                >
                  I
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Выравнивание</label>
              <div className="flex gap-3">
                {(["left", "center", "right"] as const).map((a) => (
                  <Button
                    key={a}
                    size="lg"
                    variant={tile.align === a ? "default" : "outline"}
                    onClick={() => update(selected, { align: a })}
                    className="w-14 h-12"
                  >
                    <Icon
                      name={a === "left" ? "AlignLeft" : a === "center" ? "AlignCenter" : "AlignRight"}
                      size={20}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Цвет текста</label>
              <div className="flex flex-wrap gap-3">
                {PRESET_TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => update(selected, { textColor: color })}
                    className="w-11 h-11 rounded-xl border-2 transition-all active:scale-95"
                    style={{
                      background: color,
                      borderColor: tile.textColor === color ? "hsl(var(--primary))" : "hsl(var(--border))",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Цвет фона</label>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => update(selected, { bgColor: color })}
                    className="w-11 h-11 rounded-xl border-2 transition-all active:scale-95"
                    style={{
                      background: color,
                      borderColor: tile.bgColor === color ? "hsl(var(--primary))" : "transparent",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Видео</label>
              {tile.videoName ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3">
                    <Icon name="Video" size={18} className="text-primary shrink-0" />
                    <span className="truncate text-sm text-muted-foreground">{tile.videoName}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="lg" variant="outline" className="flex-1 h-12" onClick={() => fileInputRef.current?.click()}>
                      Заменить
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 w-12" onClick={() => update(selected, { videoUrl: null, videoName: null })}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 flex items-center gap-2 text-base"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="Upload" size={18} />
                  Выбрать видео
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative z-[1] flex w-screen h-screen items-center justify-center p-[5vw]">
          <div className={`grid gap-[2vw] w-full h-full ${tileCount === 6 ? "grid-cols-3" : tileCount === 8 ? "grid-cols-4" : "grid-cols-5"}`}>
            {tiles.map((t, i) => (
              <div
                key={i}
                onClick={() => handleTileClick(t)}
                className={`rounded-3xl flex items-center justify-center p-6 transition-all ${
                  t.videoUrl ? "cursor-pointer active:scale-[0.97]" : ""
                }`}
                style={{
                  background: t.bgColor,
                  backdropFilter: "blur(12px)",
                  border: t.videoUrl
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.25)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {t.text ? (
                    <span
                      style={{
                        fontSize: t.fontSize,
                        fontWeight: t.bold ? "bold" : "normal",
                        fontStyle: t.italic ? "italic" : "normal",
                        textAlign: t.align,
                        color: t.textColor,
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                        width: "100%",
                      }}
                    >
                      {t.text}
                    </span>
                  ) : (
                    <span className="text-white/30 text-lg">Карточка {i + 1}</span>
                  )}
                  {t.videoUrl && (
                    <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="Play" size={14} className="text-white ml-0.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={!!playingVideo && !showEndScreen} onOpenChange={(o) => !o && setPlayingVideo(null)}>
          <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl bg-black border-0">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black/60 text-white"
            >
              <Icon name="X" size={20} />
            </button>
            {playingVideo && (
              <video
                src={playingVideo}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[80vh]"
                onEnded={() => setShowEndScreen(true)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showEndScreen} onOpenChange={() => {}}>
          <DialogContent className="max-w-sm w-full rounded-3xl border-0 p-10 flex flex-col items-center gap-8 text-center [&>button]:hidden">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
              <Icon name="Shield" size={52} className="text-primary" />
            </div>
            <p className="text-2xl font-semibold leading-snug">Хотите защитить свой смартфон?</p>
            <div className="flex gap-4 w-full">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg"
                variant="outline"
                onClick={() => { setShowEndScreen(false); setPlayingVideo(null); }}
              >
                ДА
              </Button>
              <Button
                size="lg"
                className="flex-1 h-14 text-lg"
                onClick={() => { setShowEndScreen(false); setPlayingVideo(null); }}
              >
                Очень
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Index;