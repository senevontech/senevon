import Hero from "../components/Hero";
// import About from "../components/About";
// import Hero2 from "../components/hero2";
import Header from "../components/Header";
import ChainGrids from "../components/ChainGrids";
import Products from "../components/production";
import AboutUs from "../components/aboutUs";
import OurWorks from "../components/ourWorks";
import Careers from "../components/careers";
import Tools from "../components/Tools"

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      
      <ChainGrids />
      <Products />
      <AboutUs />
      <OurWorks />
      <Careers />
      <Tools />

      {/* <Hero2 /> */}
      {/* <About /> */}
    </div>
  );
}
