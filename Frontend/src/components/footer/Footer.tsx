import { useTranslation } from "react-i18next";
import { Copyright } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation(["footer", "header"]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <Copyright size={14} className="copyright-icon" />
          <span>
            {currentYear} {t("appName", { ns: "header" })}
          </span>
        </div>

        {/* Beta Badge */}
        <span className="beta-badge">
          {t("beta", { defaultValue: "Beta" })}
        </span>
      </div>
    </footer>
  );
}
