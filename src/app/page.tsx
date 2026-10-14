import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LotusExperience from "@/components/lotus/LotusExperience";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Insights from "@/components/sections/Insights";
import About from "@/components/sections/About";
import Group from "@/components/sections/Group";
import Faq from "@/components/sections/Faq";
import Renew from "@/components/sections/Renew";

export default function Home() {
  return (
    <>
      <Header />
      <LotusExperience />
      <main id="top" className="relative z-10">
        <Hero />
        <Services />
        <Insights />
        <About />
        <Group />
        <Faq />
        <Renew />
      </main>
      <div className="relative z-10"><Footer /></div>
    </>
  );
}
