
// import About from "../components/About";
// import Hero2 from "../components/hero2";
import Header from "../components/Header";
import Hero from "../components/Hero4";
// import ChainGrids from "../components/ChainGrids";
import ChainGrids from "../components/chaingrid2";
import Products from "../components/production";
import AboutUs from "../components/aboutUs";
import OurWorks from "../components/ourWorks";
import Careers from "../components/careers";
import Tools from "../components/Tools";
import Footer from "../components/Footer";



export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      
      <ChainGrids />
      <Products />
      <AboutUs />
      <OurWorks />

      {/* <Careers /> */}
      <section id="careers">
        <Careers />
      </section>

      <Tools />
      <Footer />

      {/* <Hero2 /> */}
      {/* <About /> */}
    </div>
  );
}
