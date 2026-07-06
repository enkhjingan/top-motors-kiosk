export function getStoredLanguage() {
  return localStorage.getItem('language') || 'eng';
}

export function setStoredLanguage(language) {
  localStorage.setItem('language', language);
}
