// import Home from "./pages/Home";
// import Cursor from "./components/CustomCursor";

// export default function App() {
//   return <Home />;
// }



import Home from "./pages/Home";
import Cursor from "./components/CustomCursor";

export default function App() {
  return (
    <>
      {/* Global custom cursor */}
      <Cursor />

      {/* App content */}
      <Home />
    </>
  );
}
