import { WeddingData, WeddingEvent } from '../types';

const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

function gcal(title: string, start: Date, hours: number, details: string, location: string): string {
  const end = new Date(start.getTime() + hours * 3600000);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
    '&dates=' + fmt(start) + '/' + fmt(end) + '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(location);
}

export function createGoogleCalendarUrl(w: WeddingData): string {
  return gcal(w.groom.callingName + ' & ' + w.bride.callingName + ' Nikkah', new Date(w.weddingDate), 2, w.weddingTime, w.venueName + ', ' + w.venueAddress);
}

export function createEventCalendarUrl(w: WeddingData, e: WeddingEvent): string {
  if (!e.startIso) return createGoogleCalendarUrl(w);
  return gcal(e.title + ' - ' + w.groom.callingName + ' & ' + w.bride.callingName, new Date(e.startIso), e.durationHours || 3, e.date + ', ' + e.time, e.venueName + ', ' + e.venueAddress);
}

export function downloadIcsFile(w: WeddingData) {
  window.open(createGoogleCalendarUrl(w), '_blank');
}
