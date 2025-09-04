import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./routes/home/Home";
import { TacticalEditor } from "./routes/tactical_editor/TacticalEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tacticalEditor" element={<TacticalEditor />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
