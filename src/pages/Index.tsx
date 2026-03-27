import { useState, useRef } from "react";
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
  fontSize: 24,
  bold: false,
  italic: false,
  align: "center",
  videoUrl: null,
  videoName: null,
  bgColor: "rgba(255, 255, 255, 0.15)",
  textColor: "#ffffff",
});

const PRESET_TEXT_COLORS = [
  "#ffffff",
  "#000000",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
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

const Index = () => {
  const [tiles, setTiles] = useState<TileConfig[]>(Array.from({ length: 6 }, defaultTile));
  const [selected, setSelected] = useState<number>(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <div className="antialiased bg-slate-1 w-screen h-screen overflow-hidden">
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
              className="fixed top-3 right-3 z-50 flex items-center justify-center w-7 h-7 rounded-full text-white transition-all"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Icon name="Settings" size={13} />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 flex flex-col gap-6 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Настройки карточек</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground font-medium">Выберите карточку</p>
              <div className="grid grid-cols-3 gap-2">
                {tiles.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`rounded-xl p-2 text-xs border transition-all truncate ${
                      selected === i
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {t.text ? t.text.slice(0, 10) : `Карточка ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Текст</label>
              <textarea
                value={tile.text}
                onChange={(e) => update(selected, { text: e.target.value })}
                placeholder="Введите текст..."
                rows={4}
                className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Размер текста: {tile.fontSize}px</label>
              <Slider
                min={12}
                max={72}
                step={2}
                value={[tile.fontSize]}
                onValueChange={([v]) => update(selected, { fontSize: v })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Стиль</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={tile.bold ? "default" : "outline"}
                  onClick={() => update(selected, { bold: !tile.bold })}
                  className="font-bold"
                >
                  B
                </Button>
                <Button
                  size="sm"
                  variant={tile.italic ? "default" : "outline"}
                  onClick={() => update(selected, { italic: !tile.italic })}
                  className="italic"
                >
                  I
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Выравнивание</label>
              <div className="flex gap-2">
                {(["left", "center", "right"] as const).map((a) => (
                  <Button
                    key={a}
                    size="sm"
                    variant={tile.align === a ? "default" : "outline"}
                    onClick={() => update(selected, { align: a })}
                  >
                    <Icon
                      name={a === "left" ? "AlignLeft" : a === "center" ? "AlignCenter" : "AlignRight"}
                      size={14}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Цвет текста</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => update(selected, { textColor: color })}
                    className="w-8 h-8 rounded-lg border-2 transition-all"
                    style={{
                      background: color,
                      borderColor: tile.textColor === color ? "hsl(var(--primary))" : "hsl(var(--border))",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Цвет фона</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => update(selected, { bgColor: color })}
                    className="w-8 h-8 rounded-lg border-2 transition-all"
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
              <label className="text-sm font-medium">Видео</label>
              {tile.videoName ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-sm">
                    <Icon name="Video" size={14} className="text-primary shrink-0" />
                    <span className="truncate text-xs text-muted-foreground">{tile.videoName}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                      Заменить
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => update(selected, { videoUrl: null, videoName: null })}>
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="Upload" size={14} />
                  Выбрать видео
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative z-[1] flex w-screen h-screen items-center justify-center p-[5vw]">
          <div className="grid grid-cols-3 gap-[2vw] w-full h-full">
            {tiles.map((t, i) => (
              <div
                key={i}
                onClick={() => handleTileClick(t)}
                className={`rounded-3xl flex items-center justify-center p-4 transition-all ${
                  t.videoUrl ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98]" : ""
                }`}
                style={{
                  background: t.bgColor,
                  backdropFilter: "blur(12px)",
                  border: t.videoUrl
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.25)",
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
                    <span className="text-white/30 text-sm">Карточка {i + 1}</span>
                  )}
                  {t.videoUrl && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Icon name="Play" size={10} className="text-white ml-0.5" />
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
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
            {playingVideo && (
              <video
                src={playingVideo}
                controls
                autoPlay
                className="w-full h-full max-h-[80vh]"
                onEnded={() => { setShowEndScreen(true); }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showEndScreen} onOpenChange={() => {}}>
          <DialogContent className="max-w-sm w-full rounded-3xl border-0 p-8 flex flex-col items-center gap-6 text-center [&>button]:hidden">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <Icon name="Shield" size={40} className="text-primary" />
            </div>
            <p className="text-xl font-semibold leading-snug">Хотите защитить свой смартфон?</p>
            <div className="flex gap-3 w-full">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => { setShowEndScreen(false); setPlayingVideo(null); }}
              >
                ДА
              </Button>
              <Button
                className="flex-1"
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