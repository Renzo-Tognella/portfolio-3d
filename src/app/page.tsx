import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
