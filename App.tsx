import React from 'react';
import { initialWeddingData } from './data/defaultWeddingData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScratchCard } from './components/ScratchCard';
import { Countdown } from './components/Countdown';
import { FamilyDetails } from './components/FamilyDetails';
import { EventsSchedule } from './components/EventsSchedule';
import { VenueLocation } from './components/VenueLocation';
import { Footer } from './components/Footer';

const noop = () => {};

export default function App() {
  const weddingData = initialWeddingData;

  const scrollToScratch = () => {
    const el = document.getElementById('reveal-date');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen text-[#2C1810] relative"
      style={{
        backgroundColor: weddingData.theme.colors.creamBg,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <Navbar weddingData={weddingData} onOpenCustomizer={noop} />
      <main className="relative">
        <Hero weddingData={weddingData} onOpenCustomizer={noop} onScrollToScratch={scrollToScratch} />
        <ScratchCard weddingData={weddingData} />
        <Countdown weddingData={weddingData} />
        <EventsSchedule weddingData={weddingData} onOpenCustomizer={noop} />
        <FamilyDetails weddingData={weddingData} onOpenCustomizer={noop} />
        <VenueLocation weddingData={weddingData} onOpenCustomizer={noop} />
      </main>
      <Footer weddingData={weddingData} onOpenCustomizer={noop} />
    </div>
  );
}
