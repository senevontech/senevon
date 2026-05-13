import { Suspense, lazy } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero4";
import DeferredMount from "../components/performance/DeferredMount";

const ChainGrids = lazy(() => import("../components/chaingrid2"));
const Products = lazy(() => import("../components/production"));
const AboutUs = lazy(() => import("../components/aboutUs"));
const OurWorks = lazy(() => import("../components/ourWorks"));
const Careers = lazy(() => import("../components/careers"));
const Tools = lazy(() => import("../components/Tools"));
const Testimonial = lazy(() => import("../components/Testimonial"));
const Subs = lazy(() => import("../pages/subs"));
const Footer = lazy(() => import("../components/Footer"));

function SectionFallback({ minHeight = 380 }) {
  return <div aria-hidden="true" style={{ minHeight: `${minHeight}px` }} />;
}

function LazySection({ children, minHeight = 380, rootMargin = "400px" }) {
  return (
    <DeferredMount
      minHeight={minHeight}
      rootMargin={rootMargin}
      fallback={<SectionFallback minHeight={minHeight} />}
    >
      <Suspense fallback={<SectionFallback minHeight={minHeight} />}>{children}</Suspense>
    </DeferredMount>
  );
}

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />

      <LazySection minHeight={640}>
        <ChainGrids />
      </LazySection>

      <LazySection minHeight={560}>
        <Products />
      </LazySection>

      <LazySection minHeight={620}>
        <AboutUs />
      </LazySection>

      <LazySection minHeight={620}>
        <OurWorks />
      </LazySection>

      <section id="careers">
        <LazySection minHeight={680}>
          <Careers />
        </LazySection>
      </section>

      <LazySection minHeight={620}>
        <Tools />
      </LazySection>

      <LazySection minHeight={640}>
        <Testimonial />
      </LazySection>

      <LazySection minHeight={420}>
        <Subs />
      </LazySection>

      <LazySection minHeight={280} rootMargin="250px">
        <Footer />
      </LazySection>
    </div>
  );
}
