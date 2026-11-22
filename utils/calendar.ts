import { WeddingData, WeddingEvent } from '../types';

const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

function gcalUrl(title: string, dates: string, details: string, location: string): string {
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
    encodeURIComponent(title) +
    '&dates=' + dates +
    '&details=' + encodeURIComponent(details) +
    (location ? '&location=' + encodeURIComponent(location) : '')
  );
}

function timed(start: Date, hours: number) {
  const end = new Date(start.getTime() + hours * 3600000);
  return fmt(start) + '/' + fmt(end);
}

function allDay(isoDate: string) {
  // isoDate like "2027-01-09" – Google expects an exclusive end date
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  const end = new Date(Date.UTC(y, m - 1, d + 1));
  const f = (x: Date) => x.toISOString().slice(0, 10).replace(/-/g, '');
  return f(start) + '/' + f(end);
}

const couple = (w: WeddingData) => w.groom.callingName + ' & Dr. ' + w.bride.callingName;

export function createGoogleCalendarUrl(w: WeddingData): string {
  return gcalUrl(
    'Nikkah – ' + couple(w),
    timed(new Date(w.weddingDate), 2),
    w.weddingDateFormatted + ', ' + w.weddingTime,
    w.venueName + ', ' + w.venueAddress,
  );
}

export function createEventCalendarUrl(w: WeddingData, e: WeddingEvent): string {
  if (!e.startIso) return createGoogleCalendarUrl(w);
  const location = [e.venueName, e.venueAddress].filter((x) => x && !/to be announced/i.test(x)).join(', ');
  return gcalUrl(
    e.title + ' – ' + couple(w),
    e.allDay ? allDay(e.startIso) : timed(new Date(e.startIso), e.durationHours || 3),
    e.date + (e.allDay ? '' : ', ' + e.time),
    location,
  );
}

export function downloadIcsFile(w: WeddingData) {
  window.open(createGoogleCalendarUrl(w), '_blank');
}
