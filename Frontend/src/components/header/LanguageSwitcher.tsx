import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LANGUAGES: {
  code: string;
  key: "english" | "finnish" | "spanish";
  dir: "ltr" | "rtl";
  flag: string; // Added emoji flags for better visual
}[] = [
  { code: "en", key: "english", dir: "ltr", flag: "🇬🇧" },
  { code: "fi", key: "finnish", dir: "ltr", flag: "🇫🇮" },
  { code: "es", key: "spanish", dir: "ltr", flag: "🇪🇸" },
];

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation("header");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = async (lng: string) => {
    await i18n.changeLanguage(lng);
    const selectedLang = LANGUAGES.find((l) => l.code === lng);
    document.documentElement.dir = selectedLang?.dir || "ltr";
    document.documentElement.lang = lng;
    setIsOpen(false);
  };

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="lang-container" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        className={`lang-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <span className="lang-code">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="lang-menu">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                className={`lang-option ${
                  i18n.language === lang.code ? "active" : ""
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="option-label">{t(lang.key)}</span>
                {i18n.language === lang.code && (
                  <span className="check-mark">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
