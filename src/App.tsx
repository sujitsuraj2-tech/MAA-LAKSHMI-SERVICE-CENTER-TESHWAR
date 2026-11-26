import Header from './components/Header';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import WorkshopShowcase from './components/WorkshopShowcase';
import ContactSection from './components/ContactSection';
import ShopOwnerSection from './components/ShopOwnerSection';
import QrCodeSection from './components/QrCodeSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesGrid />
        <WorkshopShowcase />
        <ContactSection />
        <ShopOwnerSection />
        <QrCodeSection />
      </main>
      <Footer />
    </div>
  );
}
