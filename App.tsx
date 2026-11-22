import React from 'react';
import { initialWeddingData } from './data/defaultWeddingData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NikkahReveal } from './components/NikkahReveal';
import { OpeningGate } from './components/OpeningGate';
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
      className="min-h-screen text-[#1F2A24] relative"
      style={{
        backgroundColor: weddingData.theme.colors.creamBg,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <OpeningGate weddingData={weddingData} />
      <Navbar weddingData={weddingData} onOpenCustomizer={noop} />
      <main className="relative">
        <Hero weddingData={weddingData} onOpenCustomizer={noop} onScrollToScratch={scrollToScratch} />
        <NikkahReveal weddingData={weddingData} />
        <Countdown weddingData={weddingData} />
        <EventsSchedule weddingData={weddingData} onOpenCustomizer={noop} />
        <FamilyDetails weddingData={weddingData} onOpenCustomizer={noop} />
        <VenueLocation weddingData={weddingData} onOpenCustomizer={noop} />
      </main>
      <Footer weddingData={weddingData} onOpenCustomizer={noop} />
    </div>
  );
}
