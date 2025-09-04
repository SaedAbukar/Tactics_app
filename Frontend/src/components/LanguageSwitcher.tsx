import { useTranslation } from "react-i18next";

const LANGUAGES: {
  code: string;
  key: "english" | "finnish" | "spanish";
  dir: "ltr" | "rtl";
}[] = [
  { code: "en", key: "english", dir: "ltr" },
  { code: "fi", key: "finnish", dir: "ltr" },
  { code: "es", key: "spanish", dir: "ltr" },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation("header");

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    document.documentElement.dir =
      LANGUAGES.find((l) => l.code === lng)?.dir || "ltr";
    document.documentElement.lang = lng;
  };

  return (
    <div>
      <label htmlFor="lang-select" style={{ marginRight: 8 }}>
        {t("language")}
      </label>
      <select
        id="lang-select"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {t(l.key)}
          </option>
        ))}
      </select>
    </div>
  );
}
