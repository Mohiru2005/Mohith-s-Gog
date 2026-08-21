import { motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  MessageCircle,
  Github,
  Shield,
  Globe,
  Terminal,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageBackground from "@/components/backgrounds/ImageBackground";
import Squares from "@/components/backgrounds/Squares/Squares";

const CONTACT = {
  email: "catimbanggabriel@gmail.com",
  linkedin: "https://www.linkedin.com/in/gabrielcatimbang/",
  messenger: "https://m.me/gab.cat30",
  github: "https://github.com/gab-cat/games-of-the-generals",
} as const;

export function MaintenancePage() {
  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/30">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="flex h-full w-full">
        <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden border-r border-zinc-800">
          <div className="absolute inset-0 z-0">
            <ImageBackground overlayOpacity={0.7} />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>

          <div className="absolute top-8 left-8 w-64 h-64 border-l border-t border-white/10 rounded-tl-lg z-10 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-64 h-64 border-r border-b border-white/10 rounded-br-lg z-10 pointer-events-none" />

          <div className="z-10 space-y-6 mt-32">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-500/90 backdrop-blur-sm flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-white/10">
                <Command className="w-5 h-5 text-zinc-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight uppercase font-display text-white drop-shadow-md">
                  Games of the Generals
                </span>
                <span className="text-[10px] font-mono text-amber-500 tracking-[0.2em] uppercase">
                  Tactical Command System
                </span>
              </div>
            </div>

            <div className="space-y-4 max-w-lg">
              <h1 className="text-5xl font-semibold tracking-tight uppercase text-white leading-[1.1] font-display drop-shadow-lg">
                <span className="text-white/80">Dominate the</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-rose-400">
                  Battlefield
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />
              <p className="text-zinc-300 text-lg leading-relaxed font-light border-l-2 border-amber-500/50 pl-6 bg-gradient-to-r from-zinc-900/50 to-transparent p-2 backdrop-blur-sm rounded-r-sm">
                Engage in high-stakes tactical warfare where information is your
                greatest weapon. Outthink. Outmaneuver. Outlast.
              </p>
            </div>
          </div>

          <div className="z-10 grid gap-5 max-w-md">
            {[
              {
                icon: Shield,
                title: "Fog of War",
                desc: "Hidden ranks require calculated strategic risks.",
              },
              {
                icon: Globe,
                title: "Global Operations",
                desc: "Real-time conflict across multiple theaters.",
              },
              {
                icon: Terminal,
                title: "Battle Analytics",
                desc: "Advanced telemetry for post-mission analysis.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex gap-4 items-center group p-3 rounded-md hover:bg-white/5 transition-all cursor-default border border-transparent hover:border-white/5"
              >
                <div className="h-10 w-10 flex-shrink-0 bg-zinc-950/50 border border-white/10 flex items-center justify-center rounded-sm group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-all shadow-lg backdrop-blur-md">
                  <feature.icon className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider group-hover:text-amber-500 transition-colors mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-snug font-sans group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative bg-zinc-950 p-6 px-0 sm:p-12 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-zinc-700/50 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-zinc-700/50 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-zinc-900/50 rounded-full opacity-40" />
            <Squares
              direction="diagonal"
              speed={0.2}
              borderColor="#27272a"
              squareSize={50}
              hoverFillColor="#3f3f46"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950/80" />
          </div>

          <div className="w-full max-w-[420px] relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-8 rounded-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />

              <div className="mb-6 space-y-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                  Currently offline
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  The game is taking a pause
                </h2>
              </div>

              <div className="space-y-4 text-zinc-400 text-sm leading-relaxed text-center lg:text-left">
                <p>
                  Hi — I&apos;m Gabriel. I built this so people could play Game
                  of the Generals online with friends. Keeping the servers
                  running has become too expensive for me to cover on my own,
                  so the site is offline for now.
                </p>
                <p>
                  If you&apos;d like to help keep it alive, I&apos;d really
                  appreciate it. Send me a note anytime.
                </p>
              </div>

              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {CONTACT.email}
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <Button
                  asChild
                  variant="outline"
                  className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white text-zinc-300 rounded-sm font-mono text-xs h-10 gap-2 transition-all"
                >
                  <a
                    href={CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                    GITHUB
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white text-zinc-300 rounded-sm font-mono text-xs h-10 gap-2 transition-all"
                >
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4" />
                    LINKEDIN
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white text-zinc-300 rounded-sm font-mono text-xs h-10 gap-2 transition-all"
                >
                  <a
                    href={CONTACT.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    MESSENGER
                  </a>
                </Button>
              </div>

              <p className="mt-6 text-center text-xs text-zinc-500">
                Thank you for playing.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
