import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToHash from "./utils/ScrollToHash";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Services = lazy(() => import("./pages/Services"));
const DesignStudioPage = lazy(() => import("./pages/services/DesignStudioPage"));
const EngineeringPage = lazy(() => import("./pages/services/EngineeringPage"));
const ConsultancyPage = lazy(() => import("./pages/services/ConsultancyPage"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./components/faq"));
const Ecosystem = lazy(() => import("./pages/EcoSystem"));
const AdminLogin = lazy(() => import("./pages/supabaseLogin"));
const Admin = lazy(() => import("./pages/supabaseDashboard"));

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center text-sm font-semibold text-black/60">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/design-studio" element={<DesignStudioPage />} />
          <Route path="/services/engineering" element={<EngineeringPage />} />
          <Route path="/services/consultancy" element={<ConsultancyPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route
            path="*"
            element={
              <div className="grid min-h-screen place-items-center text-xl font-black">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
