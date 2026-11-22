import React from 'react';
import { CalendarDays, CalendarPlus, Clock, MapPin, Navigation, Shirt } from 'lucide-react';
import { WeddingData, WeddingEvent } from '../types';
import { createEventCalendarUrl } from '../utils/calendar';
import { CrescentStar, OrnateDivider, Star8 } from './IslamicDecor';

interface EventsScheduleProps {
  weddingData: WeddingData;
  onOpenCustomizer: (initialTab?: string) => void;
}

const ARABIC: Record<string, string> = {
  nikkah: 'نِكَاح',
  walima: 'وَلِيمَة',
};

export const EventsSchedule: React.FC<EventsScheduleProps> = ({ weddingData }) => {
  const { events, theme } = weddingData;
  const { colors } = theme;

  return (
    <section id="events" className="py-20 px-4 relative page-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CrescentStar size={18} color={colors.accentGold} />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: colors.primaryMaroon }}>
              Wedding Functions
            </span>
            <CrescentStar size={18} color={colors.accentGold} />
          </div>
          <h2 className="text-5xl sm:text-6xl mb-2" style={{ fontFamily: "'Great Vibes', cursive", color: colors.primaryMaroon }}>
            Celebrations
          </h2>
          <OrnateDivider color={colors.accentGold} />
          <p className="text-sm sm:text-base text-stone-600 italic mt-3">
            Join us, Inshallah, for these blessed occasions and keep us in your duas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-sm md:max-w-none mx-auto">
          {events.map((event: WeddingEvent, idx: number) => {
            const isMain = /nikk?ah/i.test(event.title);
            const key = /nikk?ah/i.test(event.title) ? 'nikkah' : /walima/i.test(event.title) ? 'walima' : /haldi|mehndi/i.test(event.title) ? 'haldi' : '';
            const hasAddress = !!event.venueAddress;

            return (
              <div
                key={event.id || idx}
                className="arch-card relative bg-white border px-6 pt-16 pb-7 flex flex-col text-center shadow-sm transition-shadow hover:shadow-lg"
                style={{
                  borderColor: isMain ? colors.accentGold : `${colors.accentGold}66`,
                  boxShadow: isMain ? `0 0 0 3px ${colors.accentGold}33, 0 14px 40px rgba(20,70,58,.12)` : undefined,
                }}
              >
                <div className="absolute inset-[7px] arch-card border pointer-events-none" style={{ borderColor: `${colors.accentGold}40` }} />

                <Star8 size={26} color={colors.accentGold} className="mx-auto" />
                {key && ARABIC[key] && (
                  <p className="text-3xl mt-2" style={{ fontFamily: "'Amiri', serif", color: colors.accentGold }}>
                    {ARABIC[key]}
                  </p>
                )}
                <p className="text-xs italic text-stone-500 mt-1">Inshallah</p>
                <h3 className="text-3xl font-semibold mt-0.5" style={{ color: colors.primaryMaroon }}>
                  {event.title}
                </h3>
                <p className="text-sm italic mt-1" style={{ color: colors.accentGold }}>
                  {event.subtitle}
                </p>
                {isMain && (
                  <span className="mx-auto mt-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: colors.primaryMaroon }}>
                    Main Event
                  </span>
                )}

                <div className="mt-5 pt-5 border-t space-y-4 text-sm flex-1" style={{ borderColor: `${colors.accentGold}30` }}>
                  <div className="flex flex-col items-center">
                    <CalendarDays className="w-4 h-4 mb-1" style={{ color: colors.accentGold }} />
                    <span className="font-semibold text-stone-900">{event.date.replace(/\s*\(.*\)/, '')}</span>
                    {/\((.*)\)/.test(event.date) && <span className="text-xs italic text-stone-500">{event.date.match(/\((.*)\)/)?.[1]}</span>}
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="w-4 h-4 mb-1" style={{ color: colors.accentGold }} />
                    <span className="font-semibold text-stone-900">{event.time}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-4 h-4 mb-1" style={{ color: colors.accentGold }} />
                    <span className="font-semibold text-stone-900">{event.venueName}</span>
                    {hasAddress && <span className="text-xs text-stone-500 max-w-[240px]">{event.venueAddress}</span>}
                  </div>
                  {event.dressCode && (
                    <div className="flex flex-col items-center">
                      <Shirt className="w-4 h-4 mb-1" style={{ color: colors.accentGold }} />
                      <span className="font-medium text-stone-800">{event.dressCode}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {hasAddress && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venueName}, ${event.venueAddress}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: colors.primaryMaroon }}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Directions
                    </a>
                  )}
                  <a
                    href={createEventCalendarUrl(weddingData, event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: colors.primaryMaroon, color: colors.primaryMaroon }}
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Add to Calendar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
