import React, { useEffect, useState } from 'react';
import { WeddingData } from '../types';
import { weddingAudio } from '../utils/audio';
import { CrescentStar, Lantern } from './IslamicDecor';

interface OpeningGateProps {
  weddingData: WeddingData;
}

/**
 * Full-screen "Tap to open" gate: two carved mehrab doors with a gold seal.
 * The tap is also the browser's required user gesture, so the music starts here.
 */
export const OpeningGate: React.FC<OpeningGateProps> = ({ weddingData }) => {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const { groom, bride, theme } = weddingData;

  useEffect(() => {
    document.body.style.overflow = gone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [gone]);

  const open = () => {
    if (opening) return;
    setOpening(true);
    weddingAudio.startAmbientMusic();
    window.setTimeout(() => setGone(true), 1700);
  };

  if (gone) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Tap to open the invitation"
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      className={`gate fixed inset-0 z-[100] cursor-pointer select-none ${opening ? 'gate-open' : ''}`}
    >
      <div className="gate-door gate-door-l islamic-pattern-dark" />
      <div className="gate-door gate-door-r islamic-pattern-dark" />

      {/* lanterns */}
      <div className="gate-fade absolute top-0 left-[8%]"><Lantern chain={70} size={40} /></div>
      <div className="gate-fade absolute top-0 left-[24%] hidden sm:block"><Lantern chain={30} size={32} /></div>
      <div className="gate-fade absolute top-0 right-[24%] hidden sm:block"><Lantern chain={30} size={32} /></div>
      <div className="gate-fade absolute top-0 right-[8%]"><Lantern chain={70} size={40} /></div>

      <div className="gate-fade absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="text-3xl sm:text-4xl mb-1" style={{ fontFamily: "'Amiri', serif", color: theme.colors.goldShimmer }}>
          {theme.bismillahText}
        </p>
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#E8DCC0]/80 mb-10">Assalamu Alaikum</p>

        <div className="gate-seal relative w-36 h-36 rounded-full flex items-center justify-center">
          <span className="absolute inset-2.5 rounded-full border border-dashed border-[#5a3c10]/50" />
          <span
            className="text-6xl leading-none pt-2"
            style={{ fontFamily: "'Great Vibes', cursive", color: '#4d3209', textShadow: '0 1px 0 rgba(255,255,255,.4)' }}
          >
            {groom.callingName.charAt(0)}
            {bride.callingName.charAt(0)}
          </span>
          <CrescentStar size={22} color="#4d3209" className="absolute top-4 opacity-70" />
        </div>

        <h1 className="mt-8 text-5xl sm:text-6xl text-[#FBF1D8]" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {groom.callingName} &amp; Dr. {bride.callingName}
        </h1>
        <p className="mt-3 text-sm tracking-[0.3em] uppercase text-[#E6C873]">Nikkah Invitation</p>

        <p className="mt-12 text-xs tracking-[0.35em] uppercase text-[#E8DCC0] gate-tap">Tap to open</p>
        <p className="mt-2 text-[10px] tracking-widest uppercase text-[#E8DCC0]/50">🔊 with sound</p>
      </div>
    </div>
  );
};
