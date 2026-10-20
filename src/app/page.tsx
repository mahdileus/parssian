import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LotusExperience from "@/components/lotus/LotusExperience";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Investment from "@/components/sections/Investment";
import Contact from "@/components/sections/Contact";
import About from "@/components/sections/About";
import Group from "@/components/sections/Group";
import Faq from "@/components/sections/Faq";
import Renew from "@/components/sections/Renew";
import Properties from "@/components/sections/Properties";
import News from "@/components/sections/News";

export default function Home() {
  return (
    <>
      <Header />
      <LotusExperience />
      <main id="top" className="relative z-10">
        <Hero />
        <Services />
        <Investment />
        <About />
        <Properties />
        <Group />
        <Faq />
        <Contact />
        <Renew />
        <News />
      </main>
      <div className="relative z-10"><Footer /></div>
    </>
  );
}
