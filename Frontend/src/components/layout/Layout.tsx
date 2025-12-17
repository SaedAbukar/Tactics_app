import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Layout.css"; // Import the new CSS

const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
