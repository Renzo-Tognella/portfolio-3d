import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experiencia } from "@/components/Experiencia";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { GlobalBackground } from "@/components/GlobalBackground";

export default function Home() {
  return (
    <>
      <GlobalBackground />
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Experiencia />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
