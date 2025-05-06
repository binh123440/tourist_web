import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Text = ({ translationKey, tag = 'span', children, ...props }) => {
  const { t } = useLanguage();
  const Component = tag;

  // Lấy nội dung dịch
  const content = translationKey
    ? t(translationKey)
    : (typeof children === 'string' ? t(children) : children);

  // Truyền toàn bộ props (bao gồm className, style, ...)
  return <Component {...props}>{content}</Component>;
};

export default Text;