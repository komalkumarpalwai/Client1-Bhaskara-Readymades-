import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Read from Google Translate cookie or localStorage
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      return match[1];
    }
    return localStorage.getItem('bhaskara_app_lang') || 'en';
  });

  const [isTranslateReady, setIsTranslateReady] = useState(false);

  useEffect(() => {
    // Initialize Google Translate Script
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,te',
            autoDisplay: false
          },
          'google_translate_element'
        );
        setIsTranslateReady(true);
      } catch (e) {
        console.warn('Google Translate initialization error:', e);
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      setIsTranslateReady(true);
    }
  }, []);

  const changeLanguage = (langCode) => {
    try {
      const googleTransCookie = `/en/${langCode}`;
      
      // Set the googtrans cookie on current domain and root path
      document.cookie = `googtrans=${googleTransCookie}; path=/;`;
      document.cookie = `googtrans=${googleTransCookie}; domain=.${window.location.hostname}; path=/;`;

      // Save preference
      localStorage.setItem('bhaskara_app_lang', langCode);
      setCurrentLanguage(langCode);

      // Trigger Google Translate select element if present
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
      } else {
        // Reload to let Google Translate apply full-page DOM translation
        window.location.reload();
      }
    } catch (err) {
      console.error('Error changing language:', err);
    }
  };

  const toggleLanguage = () => {
    const target = currentLanguage === 'en' ? 'te' : 'en';
    changeLanguage(target);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, toggleLanguage, isTranslateReady }}>
      {/* Hidden container where Google Translate Element attaches */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
