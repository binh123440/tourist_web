import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import parse from 'html-react-parser';

const TranslatedText = ({ 
  children, 
  tag = 'span',
  className = '', 
  style = {},
  ...props 
}) => {
  const { translateText, currentLanguage } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState(children);

  useEffect(() => {
    // Skip if not a string or in Vietnamese (original language)
    if (typeof children !== 'string' || currentLanguage === 'vi') {
      setTranslatedContent(children);
      return;
    }

    const translateTextWithHtml = async () => {
      try {
        // Same placeholder approach as above
        const placeholders = [];
        let index = 0;
        
        const textWithPlaceholders = children.replace(/<[^>]+>|<\/[^>]+>/g, match => {
          const placeholder = `__HTML_${index}__`;
          placeholders[index] = match;
          index++;
          return placeholder;
        });
        
        const translatedWithPlaceholders = await translateText(textWithPlaceholders);
        
        const restoredHtml = translatedWithPlaceholders.replace(/__HTML_(\d+)__/g, (match, index) => {
          return placeholders[parseInt(index)];
        });
        
        setTranslatedContent(restoredHtml);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedContent(children);
      }
    };
    
    translateTextWithHtml();
  }, [children, currentLanguage, translateText]);

  const Tag = tag;
  
  // Use the parser instead of dangerouslySetInnerHTML
  return (
    <Tag className={className} style={style} {...props}>
      {typeof translatedContent === 'string' ? parse(translatedContent) : translatedContent}
    </Tag>
  );
};

export default TranslatedText;