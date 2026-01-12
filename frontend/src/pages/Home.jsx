import Hero from "../components/Hero";
// import About from "../components/About";
// import Hero2 from "../components/hero2";
import ChainGrids from "../components/ChainGrids";
import Products from "../components/production";
import AboutUs from "../components/aboutUs";
import OurWorks from "../components/ourWorks";
import Careers from "../components/careers";

export default function Home() {
  return (
    <div>
      <Hero />
      
      <ChainGrids />
      <Products />
      <AboutUs />
      <OurWorks />
      <Careers />

      {/* <Hero2 /> */}
      {/* <About /> */}
    </div>
  );
}
