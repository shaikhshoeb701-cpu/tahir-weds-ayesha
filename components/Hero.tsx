import React from 'react';
import { Calendar, CalendarPlus, MapPin, Sparkles } from 'lucide-react';
import { WeddingData } from '../types';
import { createGoogleCalendarUrl } from '../utils/calendar';
import { CrescentStar, Lantern, MehrabFrame, OrnateDivider } from './IslamicDecor';

interface HeroProps {
  weddingData: WeddingData;
  onOpenCustomizer: () => void;
  onScrollToScratch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ weddingData, onScrollToScratch }) => {
  const { colors, enableBismillah, bismillahText, enableIslamicVerse, verseTextArabic, verseTranslation, verseReference } = weddingData.theme;

  return (
    <section className="relative pt-48 pb-16 md:pt-48 md:pb-24 overflow-hidden flex flex-col items-center justify-center text-center px-4 page-pattern">
      {/* soft glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${colors.creamBg} 10%, transparent 75%)` }}
      />

      {/* hanging lanterns */}
      <div className="absolute top-0 left-[4%] sm:left-[8%] z-0"><Lantern chain={90} size={42} /></div>
      <div className="absolute top-0 left-[18%] hidden md:block z-0"><Lantern chain={40} size={34} color={colors.primaryMaroon} /></div>
      <div className="absolute top-0 right-[18%] hidden md:block z-0"><Lantern chain={40} size={34} color={colors.primaryMaroon} /></div>
      <div className="absolute top-0 right-[4%] sm:right-[8%] z-0"><Lantern chain={90} size={42} /></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Bismillah */}
        {enableBismillah && (
          <div className="mb-6 flex flex-col items-center">
            <span
              className="text-3xl sm:text-4xl md:text-5xl text-center select-none leading-relaxed"
              style={{ fontFamily: "'Amiri', serif", color: colors.primaryMaroon }}
            >
              {bismillahText}
            </span>
            <span className="text-xs sm:text-sm italic text-stone-500 mt-1">
              In the name of Allah, the Most Gracious, the Most Merciful
            </span>
            <OrnateDivider className="mt-3" color={colors.accentGold} />
          </div>
        )}

        {/* Quranic verse */}
        {enableIslamicVerse && (
          <div className="max-w-2xl mx-auto mb-10 px-4">
            <p className="text-xl sm:text-2xl leading-loose text-stone-700 mb-2" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
              {verseTextArabic}
            </p>
            <p className="text-sm sm:text-base text-stone-600 italic leading-relaxed max-w-xl mx-auto">{verseTranslation}</p>
            <p className="text-[11px] uppercase tracking-widest mt-1.5 font-semibold" style={{ color: colors.accentGold }}>
              {verseReference}
            </p>
          </div>
        )}

        {/* Names inside a mehrab arch */}
        <MehrabFrame className="max-w-md mx-auto px-6 pt-16 pb-10" color={colors.accentGold}>
          <CrescentStar size={30} color={colors.accentGold} className="mx-auto mb-3" />
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-stone-500 font-medium mb-2">
            Together with their families
            <br />
            invite you to the Nikkah of
          </p>

          <h1 className="leading-none my-2" style={{ fontFamily: "'Great Vibes', cursive", color: colors.primaryMaroon }}>
            <span className="block text-6xl sm:text-7xl">{weddingData.groom.callingName}</span>
            <span className="block text-3xl sm:text-4xl my-1" style={{ color: colors.accentGold }}>
              weds
            </span>
            <span className="block text-6xl sm:text-7xl">Dr. {weddingData.bride.callingName}</span>
          </h1>

          <p className="text-sm sm:text-base tracking-wide text-stone-700 mt-4">
            {weddingData.groom.fullName}
            <span className="mx-2" style={{ color: colors.accentGold }}>✦</span>
            {weddingData.bride.fullName}
          </p>
          <p className="text-xs sm:text-sm text-stone-500 mt-3 max-w-sm mx-auto italic">{weddingData.heroSubtitle}</p>
        </MehrabFrame>

        {/* Date & venue */}
        <div
          className="mt-8 p-6 rounded-2xl border max-w-xl mx-auto shadow-sm bg-white/70"
          style={{ borderColor: `${colors.accentGold}60` }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-around gap-5 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5" style={{ backgroundColor: `${colors.primaryMaroon}15`, color: colors.primaryMaroon }}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Nikkah</span>
              <span className="text-lg font-semibold text-stone-900 mt-0.5">
                {new Date(weddingData.weddingDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}
              </span>
              <span className="text-xs text-stone-600">Exact date revealed below ✨</span>
            </div>

            <div className="hidden sm:block w-[1px] h-14" style={{ backgroundColor: `${colors.accentGold}70` }} />

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5" style={{ backgroundColor: `${colors.primaryMaroon}15`, color: colors.primaryMaroon }}>
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Venue</span>
              <span className="text-lg font-semibold text-stone-900 mt-0.5">{weddingData.venueName}</span>
              <span className="text-xs text-stone-600">{weddingData.venueCity}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onScrollToScratch}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            style={{ backgroundColor: colors.primaryMaroon, color: '#FBF1D8', border: `1px solid ${colors.accentGold}` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.goldShimmer }} />
            <span>Reveal Nikkah Date</span>
          </button>
          <a
            href={createGoogleCalendarUrl(weddingData)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all hover:-translate-y-0.5 active:scale-95"
            style={{ borderColor: colors.accentGold, color: colors.primaryMaroon, backgroundColor: '#ffffffaa' }}
          >
            <CalendarPlus className="w-4 h-4" style={{ color: colors.accentGold }} />
            <span>Add to Calendar</span>
          </a>
        </div>

        <div className="mt-6 text-xs uppercase tracking-widest font-medium" style={{ color: colors.accentGold }}>
          {weddingData.heroHashtag}
        </div>
      </div>
    </section>
  );
};
