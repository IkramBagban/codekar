import { useState } from 'react';
import { Vortex } from '@/components/ui/vortex';
import { Sparkles } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';

function App() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating code for:', prompt);
    // TODO: Implement code generation
  };

  return (
  <div className="w-full min-h-screen overflow-hidden bg-black text-white">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-4 md:px-8 lg:px-10 py-6 w-full h-full"
        containerClassName="h-screen"
        particleCount={700}
        baseHue={230}
        baseSpeed={0.12}
        rangeSpeed={2.4}
        rangeY={900}
        alphaMultiplier={0.25}
      >
        {/* Header */}
        {/* <header className="absolute top-0 left-0 right-0 z-30">
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="relative rounded-xl bg-zinc-900/80 border border-zinc-800 p-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <span className="text-xl font-semibold tracking-tight text-zinc-100">CodeKar</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-zinc-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-zinc-300 hover:text-white transition-colors">Pricing</a>
              <a href="https://github.com" target="_blank" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" />
                Star
              </a>
              <button className="px-4 py-2 rounded-lg bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800 transition-colors">
                Sign in
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Get started
              </button>
            </nav>
          </div>
        </header> */}

        {/* Hero Section */}
        <section className="relative z-20 w-full">
          {/* toned-down backdrop (removed heavy glow) */}

          <div className="mx-auto max-w-5xl text-center px-6 flex flex-col items-center gap-8">
            {/* Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-800">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-zinc-300">Next‑gen AI builder</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-zinc-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Build remarkable apps
              <br />
              <span className="text-zinc-300 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">by chatting with AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-zinc-300 max-w-2xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              Describe what you want. We generate production‑ready code with live preview and instant deploys.
            </p>

            {/* Prompt Input (Vanish) */}
            <div className="w-full max-w-3xl">
              <PlaceholdersAndVanishInput
                placeholders={[
                  'Ask CodeKar to create an internal tool…',
                  'Build me a SaaS landing page with pricing and FAQs…',
                  'Create a blog with MDX, tags and search…',
                ]}
                onChange={(e) => setPrompt(e.target.value)}
                onSubmit={(e) => handleSubmit(e)}
              />
              {/* prompt examples */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
                <span className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">Admin dashboard with charts</span>
                <span className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">SaaS landing page</span>
                <span className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">Blog with MDX</span>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="px-4 py-2 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 text-zinc-300">⚡ Instant Preview</div>
              <div className="px-4 py-2 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 text-zinc-300">📝 Edit Code Live</div>
              <div className="px-4 py-2 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 text-zinc-300">🚀 One‑click Deploys</div>
            </div>
          </div>
        </section>
      </Vortex>
    </div>
  );
}

export default App;