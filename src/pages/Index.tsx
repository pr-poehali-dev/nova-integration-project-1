import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { MeshGradient } from "@/components/waitlist";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";

type TileConfig = {
  text: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
};

const defaultTile = (): TileConfig => ({
  text: "",
  fontSize: 24,
  bold: false,
  italic: false,
  align: "center",
});

const Index = () => {
  const [tiles, setTiles] = useState<TileConfig[]>(Array.from({ length: 6 }, defaultTile));
  const [selected, setSelected] = useState<number>(0);

  const update = (index: number, patch: Partial<TileConfig>) => {
    setTiles((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };

  const tile = tiles[selected];

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="antialiased max-w-screen min-h-svh bg-slate-1">
        <MeshGradient
          colors={["#001c80", "#1ac7ff", "#04ffb1", "#ff1ff1"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}
        />

        <Sheet>
          <SheetTrigger asChild>
            <button
              className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Icon name="Settings" size={16} />
              Настройки
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
          </SheetContent>
        </Sheet>

        <div className="relative z-[1] flex min-h-screen items-center justify-center p-[10vw]">
          <div className="grid grid-cols-3 gap-[3vw] w-full" style={{ aspectRatio: "3/2" }}>
            {tiles.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl flex items-center justify-center p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }}
              >
                {t.text ? (
                  <span
                    style={{
                      fontSize: t.fontSize,
                      fontWeight: t.bold ? "bold" : "normal",
                      fontStyle: t.italic ? "italic" : "normal",
                      textAlign: t.align,
                      color: "white",
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
