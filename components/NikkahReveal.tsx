import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CalendarPlus, Clock, MapPin } from 'lucide-react';
import { WeddingData } from '../types';
import { weddingAudio } from '../utils/audio';
import { createEventCalendarUrl, createGoogleCalendarUrl } from '../utils/calendar';
import { CrescentStar, OrnateDivider, Star8 } from './IslamicDecor';

interface NikkahRevealProps {
  weddingData: WeddingData;
}

/**
 * Replaces the old scratch card: a carved mehrab window with two jaali doors.
 * Tapping the crescent seal swings the doors open and reveals the Nikkah date.
 */
export const NikkahReveal: React.FC<NikkahRevealProps> = ({ weddingData }) => {
  const [open, setOpen] = useState(false);
  const { colors } = weddingData.theme;
  const d = new Date(weddingData.weddingDate);
  const day = d.toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });
  const dateNum = d.toLocaleDateString('en-IN', { day: 'numeric', timeZone: 'Asia/Kolkata' });
  const monthYear = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const nikkah = weddingData.events.find((e) => /nikk?ah/i.test(e.title));
  const hijri = nikkah?.date.match(/\(([^)]+AH)\)/)?.[1];

  const reveal = () => {
    if (open) return;
    setOpen(true);
    weddingAudio.playReveal();
    window.setTimeout(() => {
      const opts = {
        particleCount: 70,
        spread: 75,
        startVelocity: 38,
        ticks: 220,
        gravity: 0.8,
        scalar: 1.1,
        shapes: ['star', 'circle'] as confetti.Shape[],
        colors: ['#E6C873', '#C9A24A', '#FFFFFF', '#2E7D64'],
      };
      confetti({ ...opts, origin: { x: 0.2, y: 0.6 }, angle: 60 });
      confetti({ ...opts, origin: { x: 0.8, y: 0.6 }, angle: 120 });
    }, 650);
  };

  return (
    <section id="reveal-date" className="relative py-20 px-4 overflow-hidden islamic-pattern-dark" style={{ backgroundColor: colors.primaryMaroon }}>
      <div className="max-w-xl mx-auto text-center relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CrescentStar size={18} color={colors.goldShimmer} />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: colors.goldShimmer }}>
            Save the Date
          </span>
          <CrescentStar size={18} color={colors.goldShimmer} />
        </div>
        <h2 className="text-4xl sm:text-5xl text-[#FBF1D8] leading-tight" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {open ? 'Alhamdulillah!' : 'Open the doors to our Nikkah date'}
        </h2>
        <p className="text-sm text-[#E8DCC0]/80 mt-2 font-light">
          {open ? 'We would be honoured by your presence and duas' : 'Tap the golden seal'}
        </p>

        {/* The mehrab window */}
        <div className="reveal-arch relative mx-auto mt-10 w-[min(320px,86vw)] h-[400px]" style={{ perspective: '1200px' }}>
          {/* gold outer arch */}
          <div className="absolute -inset-2 arch-shape" style={{ background: `linear-gradient(160deg, ${colors.goldShimmer}, ${colors.accentGold} 45%, #8C6A23)` }} />

          {/* revealed content */}
          <div className="absolute inset-0 arch-shape bg-[#FBF7EE] flex flex-col items-center justify-center px-6 text-center islamic-pattern-light">
            <CrescentStar size={34} color={colors.accentGold} className={open ? 'reveal-pop' : 'opacity-0'} />
            <p className="text-4xl mt-1" style={{ fontFamily: "'Amiri', serif", color: colors.primaryMaroon }}>نِكَاح</p>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold mt-1" style={{ color: colors.accentGold }}>
              Inshallah
            </p>
            <p className="mt-3 text-lg font-semibold uppercase tracking-[0.2em]" style={{ color: colors.accentGold }}>{day}</p>
            <p className="text-7xl font-semibold leading-none" style={{ color: colors.primaryMaroon, fontFamily: "'Cormorant Garamond', serif" }}>
              {dateNum}
            </p>
            <p className="text-xl font-semibold tracking-wide" style={{ color: colors.primaryMaroon }}>{monthYear}</p>
            {hijri && <p className="text-sm italic text-stone-500 mt-0.5">{hijri}</p>}
            <OrnateDivider className="my-3" color={colors.accentGold} />
            <p className="text-sm text-stone-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: colors.accentGold }} />
              {weddingData.weddingTime}
            </p>
            <p className="text-sm text-stone-700 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: colors.accentGold }} />
              {weddingData.venueName}, {weddingData.venueCity}
            </p>
          </div>

          {/* doors */}
          <div className={`absolute inset-0 arch-shape overflow-hidden pointer-events-none`} style={{ transformStyle: 'preserve-3d' }}>
            <div className={`door-panel door-panel-l ${open ? 'door-open-l' : ''}`} style={{ backgroundColor: colors.darkMaroon }}>
              <div className="jaali" />
            </div>
            <div className={`door-panel door-panel-r ${open ? 'door-open-r' : ''}`} style={{ backgroundColor: colors.darkMaroon }}>
              <div className="jaali" />
            </div>
          </div>

          {/* seal */}
          {!open && (
            <button
              onClick={reveal}
              aria-label="Tap to reveal the Nikkah date"
              className="seal-btn absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer z-10"
            >
              <CrescentStar size={34} color="#4d3209" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#4d3209] mt-0.5">Tap</span>
            </button>
          )}
        </div>

        {/* Add to calendar */}
        <div className={`mt-10 transition-all duration-700 ${open ? 'opacity-100 translate-y-0' : 'opacity-60'}`}>
          <a
            href={createGoogleCalendarUrl(weddingData)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${colors.goldShimmer}, ${colors.accentGold})`, color: colors.darkMaroon }}
          >
            <CalendarPlus className="w-4 h-4" />
            Add Nikkah to your Calendar
          </a>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {weddingData.events
              .filter((e) => e !== nikkah)
              .map((e) => (
                <a
                  key={e.id}
                  href={createEventCalendarUrl(weddingData, e)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-[#E6C873]/50 text-[#FBF1D8] hover:bg-white/10 transition-colors"
                >
                  <Star8 size={12} color={colors.goldShimmer} />
                  + {e.title}
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
