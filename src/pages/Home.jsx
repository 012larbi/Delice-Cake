import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import FeaturedCake from '../components/FeaturedCake';
import Features from '../components/Features';
import NewProducts from '../components/NewProducts';
import Testimonials from '../components/Testimonials';
import OrderCTA from '../components/OrderCTA';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Products />
      <FeaturedCake />
      <Features />
      <NewProducts />
      <Testimonials />
      <OrderCTA />
      <Contact />
    </main>
  );
}
