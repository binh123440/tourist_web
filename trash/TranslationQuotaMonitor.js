import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './TranslationQuotaMonitor.css';
import TranslatedText from './TranslatedText';

const TranslationQuotaMonitor = () => {
  const { 
    currentLanguage,
    quotaUsed, 
    quotaLimit, 
    lastQuotaCheck,
    checkQuota,
    quotaExceeded
  } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkError, setCheckError] = useState(null);
  
  // Format the last check time
  const formatLastCheck = () => {
    if (!lastQuotaCheck) return 'Never checked';
    
    const lastCheck = new Date(lastQuotaCheck);
    const now = new Date();
    const diffMs = now - lastCheck;
    
    // If less than a minute ago
    if (diffMs < 60000) {
      return 'Just now';
    }
    
    // If less than an hour ago
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // If less than a day ago
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Format as date and time
    return lastCheck.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Calculate percentage used
  const percentUsed = quotaLimit > 0 ? Math.min(100, Math.round((quotaUsed / quotaLimit) * 100)) : 0;
  
  // Determine status color
  const getStatusColor = () => {
    if (quotaExceeded) return '#e53935'; // Red
    if (percentUsed > 90) return '#e53935'; // Red
    if (percentUsed > 75) return '#f57c00'; // Orange
    if (percentUsed > 50) return '#fdd835'; // Yellow
    return '#43a047'; // Green
  };
  
  // Handle refresh quota
  const handleRefreshQuota = async () => {
    setIsLoading(true);
    setCheckError(null);
    
    try {
      if (typeof checkQuota === 'function') {
        const result = await checkQuota();
        if (!result) {
          setCheckError('Could not retrieve quota information');
        }
      } else {
        console.warn('checkQuota function is not available in LanguageContext');
        setCheckError('Quota checking functionality not available');
      }
    } catch (error) {
      setCheckError(error.message || 'Failed to check translation quota');
      console.error('Error checking quota:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check quota on initial render and periodically
  useEffect(() => {
    // Don't check if we're in Vietnamese mode
    if (currentLanguage === 'vi') return;
    
    const checkInitialQuota = async () => {
      // Check if we haven't checked in the last hour or if we've never checked
      const shouldCheck = !lastQuotaCheck || 
                         (new Date() - new Date(lastQuotaCheck)) > 60 * 60 * 1000;
      
      if (shouldCheck && typeof checkQuota === 'function') {
        setIsLoading(true);
        try {
          await checkQuota();
        } catch (error) {
          console.error('Error in initial quota check:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkInitialQuota();
    
    // Set up periodic check every 2 hours
    let intervalId;
    if (typeof checkQuota === 'function') {
      intervalId = setInterval(async () => {
        try {
          await checkQuota();
        } catch (error) {
          console.error('Error in periodic quota check:', error);
        }
      }, 2 * 60 * 60 * 1000); // Every 2 hours
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkQuota, lastQuotaCheck, currentLanguage]);
  
  // Skip rendering if we're using Vietnamese (no translations needed)
  if (currentLanguage === 'vi') return null;
  
  return (
    <div className={`translation-quota-monitor ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="quota-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="quota-indicator">
          <div 
            className="quota-status-circle" 
            style={{ backgroundColor: getStatusColor() }}
            title={quotaExceeded ? 'Quota exceeded' : `${percentUsed}% used`}
          ></div>
          <TranslatedText tag="span">Hạn mức dịch</TranslatedText>
        </div>
        <button className="toggle-btn" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      {isExpanded && (
        <div className="quota-details">
          <div className="quota-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${percentUsed}%`,
                  backgroundColor: getStatusColor()
                }}
                role="progressbar"
                aria-valuenow={percentUsed}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="progress-text">
              <span>{quotaUsed} / {quotaLimit} <TranslatedText>từ</TranslatedText></span>
              <span>{percentUsed}%</span>
            </div>
          </div>
          
          <div className="quota-info">
            <p className="last-checked">
              <TranslatedText>Kiểm tra lần cuối</TranslatedText>: {formatLastCheck()}
            </p>
            
            {quotaExceeded ? (
              <p className="quota-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <TranslatedText>
                  Đã đạt giới hạn dịch hàng ngày. Dịch vụ sẽ được khôi phục vào ngày mai.
                </TranslatedText>
              </p>
            ) : (
              <p className="quota-remaining">
                <i className="fas fa-info-circle"></i>
                <TranslatedText>Còn lại</TranslatedText>: {quotaLimit - quotaUsed} <TranslatedText>từ hôm nay</TranslatedText>.
              </p>
            )}
            
            {checkError && (
              <p className="quota-error">
                <i className="fas fa-exclamation-circle"></i>
                {checkError}
              </p>
            )}
          </div>
          
          <button 
            className="refresh-btn" 
            onClick={handleRefreshQuota}
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-sync-alt"></i>
            )}
            <TranslatedText>Làm mới</TranslatedText>
          </button>
          
          <div className="quota-footnote">
            <p>
              <TranslatedText>
                Được cung cấp bởi MyMemory API - Giới hạn 50,000 từ/ngày
              </TranslatedText>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationQuotaMonitor;