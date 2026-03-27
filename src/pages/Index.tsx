import { ThemeProvider } from "next-themes";
import { MeshGradient } from "@/components/waitlist";
import Icon from "@/components/ui/icon";

const tiles = [
  { icon: "Zap" },
  { icon: "Globe" },
  { icon: "Layers" },
  { icon: "Shield" },
  { icon: "Star" },
  { icon: "Rocket" },
];

const Index = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="antialiased max-w-screen min-h-svh bg-slate-1">
        <MeshGradient
          colors={["#001c80", "#1ac7ff", "#04ffb1", "#ff1ff1"]}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="relative z-[1] flex min-h-screen items-center justify-center p-[10vw]">
          <div className="grid grid-cols-3 gap-[3vw] w-full h-full" style={{ aspectRatio: "3/2" }}>
            {tiles.map((tile, i) => (
              <div
                key={i}
                className="rounded-3xl flex items-center justify-center"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }}
              >
                <div className="w-[80%] h-[80%] flex items-center justify-center">
                  <Icon name={tile.icon} className="text-white w-[80%] h-[80%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;