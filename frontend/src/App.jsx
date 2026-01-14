


// import Home from "./pages/Home";
// import Cursor from "./components/CustomCursor";
// import Products from "./pages/Products";

// export default function App() {
//   return (
//     <>
//       <Cursor />
//       <Home />
//       <Products />
//     </>
//   );
// }














import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import About from "./pages/About";
import FAQ from "./components/faq";
import Ecosystem from "./pages/EcoSystem";

// admin 
import AdminLogin from "./pages/adminLogin.jsx";
import Admin from "./pages/AdminDashboard";

import Cursor from "./components/CustomCursor";

export default function App() {
  return (
    <>
      {/* Global custom cursor */}
      <Cursor />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQs" element={<FAQ />} />
        <Route path="/ecosystem" element={<Ecosystem />} />

        {/* admin  */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Admin />} />

        {/* Optional: 404 fallback */}
        <Route
          path="*"
          element={
            <div className="grid min-h-screen place-items-center text-xl font-black">
              404 – Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
}
