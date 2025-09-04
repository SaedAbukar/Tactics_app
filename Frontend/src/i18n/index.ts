import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const AVAILABLE_LANGUAGES = ["en", "fi", "es"] as const;
export type AppLanguage = (typeof AVAILABLE_LANGUAGES)[number];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: AVAILABLE_LANGUAGES as unknown as string[],
    ns: ["common"], // default namespace
    defaultNS: "common",
    debug: false,
    interpolation: { escapeValue: false },
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    react: { useSuspense: true },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
