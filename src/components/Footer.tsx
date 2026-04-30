/**
 * Animated scrolling footer with studio credits
 */

const studios = [
  'MorStudio', 'Maicrosoft', 'FnStudio', 'GreenPixel Studio',
  'VoidForge', 'BlackGlass Studio', 'NeonFrame', 'DarkMint',
  'HexaCore', 'GlassCode', 'NightSignal Studio', 'MorStudio',
  'Maicrosoft', 'FnStudio', 'GreenPixel Studio', 'VoidForge',
  'BlackGlass Studio', 'NeonFrame', 'DarkMint', 'HexaCore',
  'GlassCode', 'NightSignal Studio'
];

export default function Footer() {
  return (
    <footer className="relative border-t border-green-900/40 bg-black/80 backdrop-blur-sm overflow-hidden py-3">
      {/* Glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div className="flex items-center gap-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {studios.map((studio, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6">
              <span className="text-green-500/30 text-xs">◆</span>
              <span className="text-gray-500 text-xs font-mono tracking-widest hover:text-green-400 transition-colors duration-300 cursor-default">
                {studio}
              </span>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {studios.map((studio, i) => (
            <span key={`dup-${i}`} className="inline-flex items-center gap-2 px-6">
              <span className="text-green-500/30 text-xs">◆</span>
              <span className="text-gray-500 text-xs font-mono tracking-widest hover:text-green-400 transition-colors duration-300 cursor-default">
                {studio}
              </span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
