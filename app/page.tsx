// import { Hero } from '@/components/landing/hero';
// import { LandingNav } from '@/components/landing/landing-nav';
import {
  ExampleFindings,
  Features,
  HowItWorks,
  LandingCTA,
  LandingFooter,
  Networks,
  Stats,
} from '@/components/landing/sections';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      {/* <LandingNav /> */}
      <main>
        {/* <Hero /> */}
        <Stats />
        <Features />
        <HowItWorks />
        <Networks />
        <ExampleFindings />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
