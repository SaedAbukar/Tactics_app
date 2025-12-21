import { useTranslation } from "react-i18next";
import { Copyright } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  // 1. Load both 'footer' and 'header' namespaces
  const { t } = useTranslation(["footer", "header"]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <Copyright size={14} className="copyright-icon" />
          <span>
            {currentYear} {/* 2. Access appName from the header namespace */}
            {t("appName", { ns: "header" })}
          </span>
        </div>
      </div>
    </footer>
  );
}
