import { useState } from "react";
import { ThemeProvider } from "next-themes";
import {
  WaitlistForm,
  WaitlistWrapper,
  MeshGradient,
} from "@/components/waitlist";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  const handleSubmit = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    console.log("Submitting email:", email);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12">
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
        <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen items-center justify-center">
          <div className="px-5 gap-8 flex flex-col">
            <main className="flex justify-center">
              <WaitlistWrapper
                logo={{
                  src: "/logo.svg",
                  alt: "Launchpad",
                }}
                copyright="При поддержке"
                copyrightLink={{ text: "Ваша компания", href: "#" }}
                showThemeSwitcher={true}
              >
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 whitespace-pre-wrap text-pretty">
                    Лист ожидания
                  </h1>
                  <p className="text-slate-10 tracking-tight text-pretty">
                    Узнайте первыми о запуске. Получите ранний доступ и
                    эксклюзивные обновления.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 w-full">
                  <Button
                    onClick={() => setVideoOpen(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2 rounded-xl py-5 text-base font-medium border-slate-6 hover:bg-slate-3 transition-all"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-12 text-slate-1">
                      <Icon name="Play" size={14} className="ml-0.5" />
                    </span>
                    Смотреть демо
                  </Button>
                </div>

                <div className="px-1 flex flex-col w-full self-stretch">
                  <WaitlistForm
                    onSubmit={handleSubmit}
                    placeholder="Введите email"
                    buttonCopy={{
                      idle: "Записаться",
                      loading: "Отправка...",
                      success: "Готово!",
                    }}
                  />
                </div>
              </WaitlistWrapper>
            </main>
          </div>
        </div>
      </div>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden rounded-2xl bg-black border-0">
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Демо продукта"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default Index;
