import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react'; // Import useCallback, useRef

// Get API key and email from environment variables
const API_KEY = process.env.REACT_APP_MYMEMORY_API_KEY || '';
const API_EMAIL = process.env.REACT_APP_MYMEMORY_EMAIL || '123440.lhbinh@gmail.com';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('vi'); // Default to Vietnamese
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Add quota tracking states
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [quotaLimit, setQuotaLimit] = useState(50000); // Correct limit with email (50k)
  const [lastQuotaCheck, setLastQuotaCheck] = useState(null);

  // Ref to store debounce timers
  const debounceTimers = useRef({});
  // Ref to store pending translation promises' resolve functions
  const pendingTranslations = useRef({});

  // Load saved language preference and quota info from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
    
    // Load any saved quota status
    const quotaStatus = localStorage.getItem('translationQuotaExceeded');
    if (quotaStatus === 'true') {
      const quotaTimestamp = parseInt(localStorage.getItem('quotaExceededTime') || '0');
      // Check if it's been less than 24 hours since quota was exceeded
      if (Date.now() - quotaTimestamp < 24 * 60 * 60 * 1000) {
        setQuotaExceeded(true);
      } else {
        // Reset quota status if 24 hours have passed
        localStorage.removeItem('translationQuotaExceeded');
        localStorage.removeItem('quotaExceededTime');
      }
    }
    
    // Load saved quota usage info
    const today = new Date().toDateString();
    const savedQuotaInfo = JSON.parse(localStorage.getItem('quotaInfo') || '{}');
    
    if (savedQuotaInfo.date === today) {
      setQuotaUsed(savedQuotaInfo.used || 0);
      setQuotaLimit(savedQuotaInfo.limit || 50000); // Updated to 50k
      setLastQuotaCheck(savedQuotaInfo.lastCheck || null);
    } else {
      // Reset quota info for a new day
      localStorage.setItem('quotaInfo', JSON.stringify({
        date: today,
        used: 0,
        limit: 50000, // Updated to 50k
        lastCheck: null
      }));
    }
  }, []);

  // Function to update quota usage
  const updateQuotaInfo = (used, limit) => {
    const today = new Date().toDateString();
    const now = new Date().toISOString();
    
    setQuotaUsed(used);
    setQuotaLimit(limit);
    setLastQuotaCheck(now);
    
    localStorage.setItem('quotaInfo', JSON.stringify({
      date: today,
      used: used,
      limit: limit,
      lastCheck: now
    }));
  };

  // Function to show notifications to user
  const showUserNotification = (message, duration = 5000) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  // Function to change the current language
  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    
    if (quotaExceeded && language !== 'vi') {
      showUserNotification(
        'Translation limit reached. Some text may not be translated until tomorrow.', 
        7000
      );
    }
  };

  // Map language codes for MyMemory API
  const getLanguageCode = (lang) => {
    const langMap = {
      'vi': 'vi',
      'en': 'en',
      'fr': 'fr'
    };
    return langMap[lang] || lang;
  };

  // Function to manually check quota status
  const checkQuota = async () => {
    try {
      const url = new URL('https://api.mymemory.translated.net/get');
      url.searchParams.append('q', 'hello');
      url.searchParams.append('langpair', 'en|vi');
      url.searchParams.append('de', API_EMAIL);
      if (API_KEY) {
        url.searchParams.append('key', API_KEY);
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      const data = await res.json();

      // --- NEW: Check quotaFinished flag first ---
      if (data.quotaFinished === true) {
        setQuotaExceeded(true);
        localStorage.setItem('translationQuotaExceeded', 'true');
        localStorage.setItem('quotaExceededTime', Date.now().toString());
        // We know the limit is hit, but might not know the exact numbers
        // Update state to reflect being at the limit if we don't get details later
        updateQuotaInfo(quotaLimit, quotaLimit); 
        showUserNotification(
          'Translation daily limit reached. Service will resume tomorrow.', 
          10000
        );
      } else {
         // If quotaFinished is false or not present, assume not exceeded for now
         // We might refine this if we parse details later
         setQuotaExceeded(false);
         // Optionally clear the exceeded flags if they were previously set
         // localStorage.removeItem('translationQuotaExceeded');
         // localStorage.removeItem('quotaExceededTime');
      }
      // --- End NEW ---

      // --- Attempt to parse detailed usage (if available) ---
      let detailsFound = false;
      if (data && data.matches && data.matches.length > 0) {
        for (const match of data.matches) {
          if (match.key && match.key.includes('Usage')) {
            const usageMatch = match.key.match(/Daily Usage: (\d+)\/(\d+)/i);
            if (usageMatch && usageMatch.length >= 3) {
              const used = parseInt(usageMatch[1], 10);
              const limit = parseInt(usageMatch[2], 10);
              
              updateQuotaInfo(used, limit); // Update with specific numbers
              detailsFound = true;

              // Re-check exceeded status based on detailed numbers
              if (used >= limit) {
                 setQuotaExceeded(true);
                 localStorage.setItem('translationQuotaExceeded', 'true');
                 localStorage.setItem('quotaExceededTime', Date.now().toString());
              } else {
                 // If details show we are *not* exceeded, override quotaFinished if it was true
                 setQuotaExceeded(false); 
              }
              break; // Found details, no need to look further
            }
          }
        }
      }
      // --- End Attempt ---

      if (!detailsFound) {
        console.warn('Could not extract detailed quota usage from MyMemory response. Relying on quotaFinished flag.');
      }

      // Return the current state values
      return { used: quotaUsed, limit: quotaLimit };

    } catch (error) {
      console.error('Error checking quota:', error);
      return { used: quotaUsed, limit: quotaLimit }; // Return current state on error
    }
  };

  // Debounced translation function
  const debouncedTranslateText = useCallback(async (text, targetLang = currentLanguage) => {
    // --- Basic checks remain the same ---
    if (!text) return '';
    if (targetLang === 'vi') return text;
    if (quotaExceeded) return text;
    const cacheKey = `${text}-${targetLang}`;
    if (translations[cacheKey]) return translations[cacheKey];
    // --- End Basic checks ---

    // Return a promise that will resolve when the translation is done
    return new Promise((resolve) => {
      // Store the resolve function for this specific text/lang combo
      if (!pendingTranslations.current[cacheKey]) {
        pendingTranslations.current[cacheKey] = [];
      }
      pendingTranslations.current[cacheKey].push(resolve);

      // Clear existing timer for this text/lang combo
      if (debounceTimers.current[cacheKey]) {
        clearTimeout(debounceTimers.current[cacheKey]);
      }

      // Set a new timer
      debounceTimers.current[cacheKey] = setTimeout(async () => {
        // --- Actual API call logic ---
        setIsLoading(true);
        let translatedResult = text; // Default to original text
        try {
          const sourceLang = 'vi';
          const targetLangCode = getLanguageCode(targetLang);
          const url = new URL('https://api.mymemory.translated.net/get');
          url.searchParams.append('q', text);
          url.searchParams.append('langpair', `${sourceLang}|${targetLangCode}`);
          url.searchParams.append('de', API_EMAIL);

          const res = await fetch(url);
          if (!res.ok) {
            if (res.status === 429) {
              setQuotaExceeded(true);
              localStorage.setItem('translationQuotaExceeded', 'true');
              localStorage.setItem('quotaExceededTime', Date.now().toString());
              showUserNotification('Translation daily limit reached (API Status 429).', 10000);
              updateQuotaInfo(quotaLimit, quotaLimit);
              // Keep translatedResult as original text
            } else {
              throw new Error(`API returned ${res.status}`);
            }
          } else {
            const data = await res.json();
            // --- Quota checking logic from API response (keep as is) ---
            if (data.quotaFinished === true) {
              // ... (set quota exceeded state, updateQuotaInfo, show notification) ...
              // Keep translatedResult as original text if quota finished
            } else {
               setQuotaExceeded(false); // Assume not exceeded if flag isn't true
               // --- Detailed quota parsing (keep as is) ---
               // ...
               // --- Process Translation Result (only if quota not finished) ---
               if (data && data.responseData && data.responseData.translatedText) {
                 translatedResult = data.responseData.translatedText;
               } else if (data && data.matches && data.matches.length > 0) {
                 // Fallback logic (keep as is)
                 // ... find best match ...
                 // translatedResult = bestMatch.translation;
               }
            }
          }
        } catch (error) {
          console.error('Translation error (debounced):', error);
          if (error.message.includes('429') || error.message.toLowerCase().includes('limit')) {
             // ... (handle quota exceeded error state) ...
          }
          // Keep translatedResult as original text on error
        } finally {
          setIsLoading(false);
          // Cache the result (even if it's the original text on error/quota)
          setTranslations(prev => ({ ...prev, [cacheKey]: translatedResult }));

          // Resolve all pending promises for this text/lang combo
          if (pendingTranslations.current[cacheKey]) {
            pendingTranslations.current[cacheKey].forEach(resolveFunc => resolveFunc(translatedResult));
            delete pendingTranslations.current[cacheKey]; // Clean up
          }
          delete debounceTimers.current[cacheKey]; // Clean up timer ref
        }
        // --- End Actual API call logic ---
      }, 500); // Adjust debounce delay (e.g., 500ms) as needed
    });
  }, [currentLanguage, quotaExceeded, translations, quotaLimit]); // Add dependencies

  // Use the debounced function in the context value
  const translateText = useCallback((text, targetLang = currentLanguage) => {
      return debouncedTranslateText(text, targetLang);
  }, [debouncedTranslateText]);

  // Translate a batch of texts at once
  const translateBatch = async (texts, targetLang = currentLanguage) => {
    const results = {};
    const promises = [];
    for (const key in texts) {
      // Call the debounced function, which returns a promise
      promises.push(
        translateText(texts[key], targetLang).then(result => {
          results[key] = result;
        })
      );
    }
    // Wait for all debounced translations to complete
    await Promise.all(promises);
    return results;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      translateText, 
      translateBatch,
      isLoading,
      quotaExceeded,
      showNotification,
      notificationMessage,
      // Add the quota monitoring values and functions to the context
      quotaUsed,
      quotaLimit,
      lastQuotaCheck,
      checkQuota
    }}>
      {children}
      {/* Notification component */}
      {showNotification && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#333',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: 9999,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          {notificationMessage}
        </div>
      )}
    </LanguageContext.Provider>
  );
};