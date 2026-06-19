import { translations } from "./translations.js";

const STORAGE_KEY = "hlegal-lang";
const DEFAULT_LANG = "uk";

function getByPath(obj, path) {
  return path.split(".").reduce((value, key) => value?.[key], obj);
}

export function getLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) return saved;

  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");
  if (queryLang && translations[queryLang]) return queryLang;

  return DEFAULT_LANG;
}

function setActiveLangLinks(lang) {
  document.querySelectorAll("[data-lang-item]").forEach((item) => {
    const isActive = item.dataset.langItem === lang;
    item.classList.toggle("active", isActive);
    item.classList.toggle("active--dark", isActive);
  });

  document.querySelectorAll("[data-lang]").forEach((link) => {
    link.classList.toggle("active", link.dataset.lang === lang);
    link.classList.toggle("active-lang", link.dataset.lang === lang);
  });
}

function applyTextNodes(lang) {
  const dict = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = getByPath(dict, node.dataset.i18n);
    if (typeof value === "string") node.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const value = getByPath(dict, node.dataset.i18nPlaceholder);
    if (typeof value === "string") node.placeholder = value;
  });

  document.querySelectorAll("[data-i18n-list]").forEach((node) => {
    const list = getByPath(dict, node.dataset.i18nList);
    if (!Array.isArray(list)) return;

    const items = node.querySelectorAll("[data-i18n-list-item]");
    items.forEach((item, index) => {
      if (list[index]) item.textContent = list[index];
    });
  });

  document.querySelectorAll("[data-i18n-cards]").forEach((node) => {
    const cards = getByPath(dict, node.dataset.i18nCards);
    if (!Array.isArray(cards)) return;

    node.querySelectorAll("[data-i18n-card]").forEach((card, index) => {
      const data = cards[index];
      if (!data) return;

      const title = card.querySelector("[data-i18n-card-title]");
      const text = card.querySelector("[data-i18n-card-text]");
      if (title) title.textContent = data.title;
      if (text) text.textContent = data.text;
    });
  });

  document.querySelectorAll("[data-i18n-publications]").forEach((node) => {
    const items = getByPath(dict, node.dataset.i18nPublications);
    if (!Array.isArray(items)) return;

    node.querySelectorAll("[data-i18n-publication]").forEach((pub, index) => {
      const data = items[index];
      if (!data) return;

      const title = pub.querySelector("[data-i18n-publication-title]");
      const date = pub.querySelector("[data-i18n-publication-date]");
      const desc = pub.querySelector("[data-i18n-publication-desc]");
      if (title) title.textContent = data.title;
      if (date) date.textContent = data.date;
      if (desc) desc.textContent = data.description;
    });
  });
}

function applyMeta(lang) {
  const page = document.body.dataset.page;
  if (!page) return;

  const title = getByPath(translations[lang], `meta.${page}`);
  if (title) document.title = title;
}

export function applyTranslations(lang = getLang()) {
  if (!translations[lang]) lang = DEFAULT_LANG;

  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  applyTextNodes(lang);
  applyMeta(lang);
  setActiveLangLinks(lang);
}

export function initI18n() {
  applyTranslations(getLang());

  document.querySelectorAll("[data-lang]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      applyTranslations(link.dataset.lang);
    });
  });
}
