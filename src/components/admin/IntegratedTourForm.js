import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import './IntegratedTourFormStyle.css';
import LexicalEditor from './LexicalEditor';

// Simple Language Tabs Component (Keep as is)
const LanguageTabs = ({ activeLang, setActiveLang }) => (
  <div className="language-tabs">
    <button
      type="button"
      className={`language-tab ${activeLang === 'vi' ? 'active' : ''}`}
      onClick={() => setActiveLang('vi')}
    >
      Tiếng Việt (VI)
    </button>
    <button
      type="button"
      className={`language-tab ${activeLang === 'en' ? 'active' : ''}`}
      onClick={() => setActiveLang('en')}
    >
      English (EN)
    </button>
    <button
      type="button"
      className={`language-tab ${activeLang === 'fr' ? 'active' : ''}`}
      onClick={() => setActiveLang('fr')}
    >
      Français (FR)
    </button>
  </div>
);

// Helper to get language object safely
const getLangObj = (obj, field) => ({
  vi: obj?.[field]?.vi || '',
  en: obj?.[field]?.en || '',
  fr: obj?.[field]?.fr || '',
});

// Helper to get language object for content items (which are already lang objects)
const getContentLangObj = (item) => ({
  vi: item?.vi || '',
  en: item?.en || '',
  fr: item?.fr || '',
});


const IntegratedTourForm = ({ tourData, onSubmit, onCancel }) => {

  const detailTitleInputRef = useRef(null);
  // --- Initial State (Keep as is) ---
  const initialTourState = {
    title: { vi: '', en: '', fr: '' },
    destination: { vi: '', en: '', fr: '' },
    date: '',
    image: '',
    description: { vi: '', en: '', fr: '' },
    link: ''
  };
  const initialDetailState = {
    title: { vi: '', en: '', fr: '' },
    intro: { vi: '', en: '', fr: '' },
    days: [],
    images: []
  };

  const [formData, setFormData] = useState({
    tour: { ...initialTourState },
    detail: { ...initialDetailState }
  });

  // --- Other States (Keep as is) ---
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basicInfo');
  // Removed dayCount state as formData.detail.days.length is sufficient
  const [destinations, setDestinations] = useState([]);
  const [tourImageFile, setTourImageFile] = useState(null);
  const [tourImagePreview, setTourImagePreview] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState({});
  const [galleryImagePreviews, setGalleryImagePreviews] = useState({});
  const tourImageInputRef = useRef(null);
  const galleryImageInputsRef = useRef({});
  const multipleImagesInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [autoId, setAutoId] = useState(
    tourData?.tour?.link?.split('-').pop() || Math.floor((new Date().getTime() / 1000) % 10000)
  );
  const [activeLang, setActiveLang] = useState('vi');

  // --- useEffects ---
  useEffect(() => {
    // Populate form data when tourData changes
    if (tourData) {
      setFormData({
        tour: {
          ...initialTourState,
          ...(tourData.tour || {}),
          title: getLangObj(tourData.tour, 'title'),
          destination: getLangObj(tourData.tour, 'destination'),
          description: getLangObj(tourData.tour, 'description'),
        },
        detail: {
          ...initialDetailState,
          ...(tourData.detail || {}),
          title: getLangObj(tourData.detail, 'title'),
          intro: getLangObj(tourData.detail, 'intro'),
          // Ensure days and content have the correct structure
          days: (tourData.detail?.days || []).map(day => ({
            ...day,
            title: getLangObj(day, 'title'),
            // Ensure content is an array and each item has the lang structure
            content: (day.content || []).map(item => getContentLangObj(item))
          })),
          images: (tourData.detail?.images || []).map(img => ({
            ...img,
            alt: getLangObj(img, 'alt')
          }))
        }
      });
      // Set previews
      if (tourData.tour?.image) setTourImagePreview(tourData.tour.image.startsWith('http') ? tourData.tour.image : `http://localhost:5000${tourData.tour.image}`);
      const initialGalleryPreviews = {};
      (tourData.detail?.images || []).forEach((img, index) => {
        if (img.image) initialGalleryPreviews[index] = img.image.startsWith('http') ? img.image : `http://localhost:5000${img.image}`;
      });
      setGalleryImagePreviews(initialGalleryPreviews);
    } else {
      // Reset form for new entry
      setFormData({
        tour: { ...initialTourState },
        detail: { ...initialDetailState }
      });
      setTourImagePreview(null);
      setGalleryImagePreviews({});
      setTourImageFile(null);
      setGalleryImageFiles({});
    }

    // Fetch or set destinations (Keep hardcoded example)
    const hardcodedDestinations = [
      { _id: '1', name: 'Việt Nam', name_en: 'Vietnam', name_fr: 'Vietnam' },
      { _id: '2', name: 'Bhutan', name_en: 'Bhutan', name_fr: 'Bhoutan' },
      { _id: '3', name: 'Pháp', name_en: 'France', name_fr: 'France' }
    ];
    setDestinations(hardcodedDestinations);

  }, [tourData]); // Rerun only when tourData changes

  // --- Slug Generation & Auto Link (Keep as is) ---
  const generateSlug = text => { /* ... existing slug logic ... */
    if (!text || typeof text !== 'string') return '';
    let str = text.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/[^a-z0-9]/g, ' ')
    str = str.trim().replace(/\s+/g, '-')
    return str
  };

  useEffect(() => {
    // Auto-generate link based on Vietnamese destination if creating new or link is empty
    if (formData.tour.destination?.vi && (!tourData || !tourData.tour?.link)) {
      const destSlug = generateSlug(formData.tour.destination.vi);
      if (destSlug) { // Only update if slug is valid
        const newLink = `${destSlug}-${autoId}`;
        // Avoid infinite loop by checking if link needs update
        if (formData.tour.link !== newLink) {
            setFormData(prev => ({
                ...prev,
                tour: { ...prev.tour, link: newLink }
            }));
        }
      }
    }
    // If editing and link was manually cleared, regenerate
    else if (tourData && formData.tour.destination?.vi && formData.tour.link === '') {
        const destSlug = generateSlug(formData.tour.destination.vi);
        if (destSlug) {
            const newLink = `${destSlug}-${autoId}`;
            setFormData(prev => ({
                ...prev,
                tour: { ...prev.tour, link: newLink }
            }));
        }
    }
  }, [formData.tour.destination?.vi, tourData, autoId, formData.tour.link]); // Add formData.tour.link dependency


  // --- Handlers using useCallback for potential performance optimization ---

  // Generic handler for nested language fields
  const handleNestedChange = useCallback((section, field, lang, value) => {
    setFormData(prev => {
      // Ensure the section and field exist before updating
      const currentSection = prev[section] || {};
      const currentField = currentSection[field] || { vi: '', en: '', fr: '' };
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: {
            ...currentField,
            [lang]: value
          }
        }
      };
    });
  }, []); // Empty dependency array means this function is created once

  // Handler for simple non-language tour fields
  const handleTourSimpleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      tour: { ...prev.tour, [name]: value }
    }));
  }, []);

  // Handler for day title changes
  const handleDayTitleChange = useCallback((dayIndex, lang, value) => {
    setFormData(prev => {
      // Use functional update with map for immutability
      const updatedDays = (prev.detail.days || []).map((day, index) => {
        if (index === dayIndex) {
          const currentTitle = day.title || { vi: '', en: '', fr: '' };
          return {
            ...day,
            title: {
              ...currentTitle,
              [lang]: value
            }
          };
        }
        return day;
      });
      return {
        ...prev,
        detail: {
          ...prev.detail,
          days: updatedDays
        }
      };
    });
  }, []);

  // Handler for day content changes (LexicalEditor)
  const handleDayContentChange = useCallback((dayIndex, contentIndex, lang, htmlString) => {
    setFormData(prev => {
      const updatedDays = (prev.detail.days || []).map((day, dIndex) => {
        if (dIndex === dayIndex) {
          // Ensure content array exists and map over it
          const updatedContent = (day.content || []).map((item, cIndex) => {
            if (cIndex === contentIndex) {
              const currentItem = item || { vi: '', en: '', fr: '' };
              return {
                ...currentItem,
                [lang]: htmlString
              };
            }
            return item;
          });
          // Ensure the specific content item exists if index is out of bounds (e.g., after adding)
          while (updatedContent.length <= contentIndex) {
            updatedContent.push({ vi: '', en: '', fr: '' });
          }
          // Update the specific item if it was newly added
          if (!updatedContent[contentIndex]) {
             updatedContent[contentIndex] = { vi: '', en: '', fr: '' };
          }
          updatedContent[contentIndex][lang] = htmlString; // Ensure update happens

          return { ...day, content: updatedContent };
        }
        return day;
      });
      return {
        ...prev,
        detail: {
          ...prev.detail,
          days: updatedDays
        }
      };
    });
  }, []);

  // Handler for image alt text changes
  const handleImageAltChange = useCallback((imgIndex, lang, value) => {
    setFormData(prev => {
      const updatedImages = (prev.detail.images || []).map((img, index) => {
        if (index === imgIndex) {
          const currentAlt = img.alt || { vi: '', en: '', fr: '' };
          return {
            ...img,
            alt: {
              ...currentAlt,
              [lang]: value
            }
          };
        }
        return img;
      });
       // Ensure the image item exists if index is out of bounds
       while (updatedImages.length <= imgIndex) {
         updatedImages.push({ image: '', alt: { vi: '', en: '', fr: '' } });
       }
       if (!updatedImages[imgIndex]) {
           updatedImages[imgIndex] = { image: '', alt: { vi: '', en: '', fr: '' } };
       }
       if (!updatedImages[imgIndex].alt) {
           updatedImages[imgIndex].alt = { vi: '', en: '', fr: '' };
       }
       updatedImages[imgIndex].alt[lang] = value; // Ensure update

      return { ...prev, detail: { ...prev.detail, images: updatedImages } };
    });
  }, []);

  // Handler for intro change (LexicalEditor) - uses handleNestedChange
  const handleIntroChange = useCallback((lang, htmlString) => {
    handleNestedChange('detail', 'intro', lang, htmlString);
  }, [handleNestedChange]); // Dependency on handleNestedChange

  // --- Add/Remove Days/Content/Images ---
  const addDay = useCallback(() => {
    setFormData(prev => {
      const newDay = {
        title: { vi: '', en: '', fr: '' },
        content: [{ vi: '', en: '', fr: '' }] // Start with one empty content item
      };
      const updatedDays = [...(prev.detail.days || []), newDay]; // Safely add to existing or new array
      return {
        ...prev,
        detail: {
          ...prev.detail,
          days: updatedDays
        }
      };
    });
    // No need to manage separate dayCount state
  }, []);

  const removeDay = useCallback(index => {
    setFormData(prev => {
      // Filter out the day immutably
      const updatedDays = (prev.detail.days || []).filter((_, i) => i !== index);
      return {
        ...prev,
        detail: {
          ...prev.detail,
          days: updatedDays
        }
      };
    });
  }, []);

  const addContentItem = useCallback(dayIndex => {
    setFormData(prev => {
      const updatedDays = (prev.detail.days || []).map((day, index) => {
        if (index === dayIndex) {
          const newContent = { vi: '', en: '', fr: '' };
          const updatedContent = [...(day.content || []), newContent]; // Safely add
          return { ...day, content: updatedContent };
        }
        return day;
      });
      return {
        ...prev,
        detail: {
          ...prev.detail,
          days: updatedDays
        }
      };
    });
  }, []);

  const removeContentItem = useCallback((dayIndex, contentIndex) => {
    setFormData(prev => {
      const updatedDays = (prev.detail.days || []).map((day, dIndex) => {
        if (dIndex === dayIndex) {
          // Filter out the content item immutably
          const updatedContent = (day.content || []).filter((_, cIndex) => cIndex !== contentIndex);
          return { ...day, content: updatedContent };
        }
        return day;
      });
      return {
        ...prev,
        detail: {
          ...prev.detail,
          days: updatedDays
        }
      };
    });
  }, []);

  const addImage = useCallback(() => {
    setFormData(prev => {
      const newImage = {
        image: '',
        alt: { vi: '', en: '', fr: '' }
      };
      const updatedImages = [...(prev.detail.images || []), newImage]; // Safely add
      return {
        ...prev,
        detail: {
          ...prev.detail,
          images: updatedImages
        }
      };
    });
  }, []);

  const removeImage = useCallback(imgIndex => {
    setFormData(prev => {
      // Filter out the image immutably
      const updatedImages = (prev.detail.images || []).filter((_, i) => i !== imgIndex);
      return {
        ...prev,
        detail: {
          ...prev.detail,
          images: updatedImages
        }
      };
    });
    // Clean up previews and files (keep existing logic, but ensure keys are handled if non-sequential)
    setGalleryImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[imgIndex];
      // Consider re-indexing if necessary, but deletion might suffice
      return newPreviews;
    });
    setGalleryImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[imgIndex];
      // Consider re-indexing if necessary
      return newFiles;
    });
    // Clean up refs (optional)
    if (galleryImageInputsRef.current[imgIndex]) {
        delete galleryImageInputsRef.current[imgIndex];
    }
  }, []);

  // --- File Handling (Keep existing logic, ensure safety) ---
  const handleTourImageSelect = useCallback(e => {
    const file = e.target.files?.[0]; // Optional chaining
    if (file) {
      setTourImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setTourImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGalleryImageSelect = useCallback((index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryImageFiles(prev => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onloadend = () => setGalleryImagePreviews(prev => ({ ...prev, [index]: reader.result }));
      reader.readAsDataURL(file);

      // Update alt text using handleImageAltChange for consistency
      setFormData(prev => {
          const currentImages = prev.detail.images || [];
          if (currentImages[index] && !currentImages[index].alt?.vi && !currentImages[index].alt?.en && !currentImages[index].alt?.fr) {
              const defaultAlt = file.name.split('.').slice(0, -1).join('.') || 'Gallery image';
              handleImageAltChange(index, 'vi', defaultAlt);
              handleImageAltChange(index, 'en', defaultAlt);
              handleImageAltChange(index, 'fr', defaultAlt);
          }
          return prev; // Return previous state as handleImageAltChange updates it
      });
    }
  }, [handleImageAltChange]); // Add dependency

  const handleMultipleImagesSelect = useCallback((e) => {
     const files = Array.from(e.target.files || []); // Ensure files is an array
     if (files.length === 0) return;

     const startIndex = formData.detail.images?.length || 0; // Get current length safely

     files.forEach((file, i) => {
       const newIndex = startIndex + i;
       const defaultAlt = file.name.split('.').slice(0, -1).join('.') || `Image ${newIndex + 1}`;

       // Add image structure first
       addImage(); // Use the addImage handler to ensure structure

       // Then update the newly added image's alt text and set file/preview
       handleImageAltChange(newIndex, 'vi', defaultAlt);
       handleImageAltChange(newIndex, 'en', defaultAlt);
       handleImageAltChange(newIndex, 'fr', defaultAlt);

       setGalleryImageFiles(prev => ({ ...prev, [newIndex]: file }));

       const reader = new FileReader();
       reader.onloadend = () => {
         setGalleryImagePreviews(prev => ({ ...prev, [newIndex]: reader.result }));
       };
       reader.readAsDataURL(file);
     });

     alert(`Đã thêm ${files.length} ảnh vào thư viện`);
     // Clear the file input after processing
     if(e.target) e.target.value = null;
  }, [addImage, handleImageAltChange]); // Add dependencies

  const handleDrag = useCallback((e) => { /* ... keep existing ... */
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') { setDragActive(true); }
    else if (e.type === 'dragleave') { setDragActive(false); }
  }, []);

  const handleDrop = useCallback((e) => { /* ... keep existing ... */
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Use the existing multiple select handler
        handleMultipleImagesSelect({ target: { files: e.dataTransfer.files } });
        e.dataTransfer.clearData();
    }
  }, [handleMultipleImagesSelect]); // Add dependency

  // --- Submit Handler (Keep existing logic, ensure safety) ---
  const handleSubmit = useCallback(async e => {
    e.preventDefault();

    // --- VALIDATION FOR DETAIL TITLE ---
    // Check if the "Nội dung tour" tab is the active one or if we need to switch to it
    // We'll primarily check the Vietnamese version of the detail title as it's often the base language.
    if (!formData.detail.title?.vi) {
      setActiveTab('tourContent'); // Switch to the tour content tab
      setActiveLang('vi');       // Ensure Vietnamese tab is active for the detail title

      // Use a slight delay to ensure the tab and language have switched and the input is visible
      setTimeout(() => {
        if (detailTitleInputRef.current) {
          detailTitleInputRef.current.focus();
          // Optionally, scroll to it if it's off-screen, though focus usually handles this.
          // detailTitleInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          alert('Vui lòng nhập "Tiêu đề chi tiết" cho nội dung tour (Tiếng Việt).');
        }
      }, 100); // 100ms delay, adjust if needed

      setLoading(false); // Ensure loading is set to false as we are not submitting
      return; // Stop the submission process
    }
    // --- END VALIDATION FOR DETAIL TITLE ---


    setLoading(true); // Proceed with loading state if validation passes

    try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error("Authentication token not found.");
      }

      let tourImageUrl = formData.tour.image;
      let finalGalleryImages = JSON.parse(JSON.stringify(formData.detail.images || []));

      // 1. Upload Tour Image
      if (tourImageFile instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('image', tourImageFile);
        imageFormData.append('type', 'tour'); // <-- Add type 'tour' here
        console.log('Uploading tour image...');
        // Use the correct endpoint: /api/admin/gallery
        const res = await axios.post('https://tourist-web-noln.onrender.com/api/admin/gallery', imageFormData, {
          headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
        });
        // Assuming the response from galleryController contains the URL
        tourImageUrl = res.data.url;
        console.log('Tour image uploaded:', tourImageUrl);
      }

      // 2. Upload Gallery Images
      const uploadPromises = Object.keys(galleryImageFiles).map(async (indexStr) => {
          const index = parseInt(indexStr, 10);
          const file = galleryImageFiles[index];
          if (file instanceof File) {
              const imageFormData = new FormData();
              imageFormData.append('image', file);
              imageFormData.append('type', 'gallery'); // <-- Add type 'gallery' here
              console.log(`Uploading gallery image index ${index}...`);
              // Use the correct endpoint: /api/admin/gallery
              const res = await axios.post('https://tourist-web-noln.onrender.com/api/admin/gallery', imageFormData, {
                  headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
              });
              // Update the URL in the copied array using the response from galleryController
              if (finalGalleryImages[index]) {
                  finalGalleryImages[index].image = res.data.url;
                  console.log(`Gallery image ${index} uploaded:`, res.data.url);
              }
          }
      });

      await Promise.all(uploadPromises);
      console.log('All gallery images processed.');

      // 3. Prepare final data payload
      const finalFormData = {
        tour: {
          ...formData.tour,
          image: tourImageUrl // Use the potentially updated URL
        },
        detail: {
          ...formData.detail,
          images: finalGalleryImages // Use the array with potentially updated URLs
        }
      };

      console.log('Final form data being submitted:', finalFormData);
      // 4. Call the onSubmit prop
      onSubmit(finalFormData);

    } catch (error) {
      // Log the actual error response from the server if available
      console.error('Error submitting form:', error.response?.data || error.message);
      alert(`Có lỗi xảy ra khi gửi form: ${error.response?.data?.message || error.message}. Vui lòng kiểm tra console.`);
    } finally {
      // Only set loading to false if we didn't return early from validation
      if (formData.detail.title?.vi) {
         setLoading(false);
      }
    }
  }, [formData, tourImageFile, galleryImageFiles, onSubmit, setActiveTab, setActiveLang]); // Add setActiveTab and setActiveLang to dependencies


  // --- JSX Rendering ---
  // The JSX structure for displaying days is already correct in your provided code.
  // No changes needed in the rendering part below based on your request.
  // Ensure formData.detail.days is populated correctly by the useEffect hook.
  return (
    <form className='integrated-tour-form' onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className='form-tabs'>
        <button type='button' className={activeTab === 'basicInfo' ? 'active' : ''} onClick={() => setActiveTab('basicInfo')}>Thông tin cơ bản</button>
        <button type='button' className={activeTab === 'tourContent' ? 'active' : ''} onClick={() => setActiveTab('tourContent')}>Nội dung tour</button>
        <button type='button' className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>Thư viện ảnh</button>
      </div>

      {/* Language Tabs */}
      <LanguageTabs activeLang={activeLang} setActiveLang={setActiveLang} />

      {/* Basic Info Tab */}
      {activeTab === 'basicInfo' && (
        <div className='tab-content'>
          <h2>Thông tin cơ bản ({activeLang.toUpperCase()})</h2>
          {/* Title */}
          <div className='form-group'>
            <label htmlFor={`title-${activeLang}`}>Tiêu đề <span className="required">*</span></label>
            <input
              id={`title-${activeLang}`}
              type='text'
              placeholder={`Tiêu đề (${activeLang.toUpperCase()})`}
              value={formData.tour.title?.[activeLang] || ''} // Use optional chaining
              onChange={(e) => handleNestedChange('tour', 'title', activeLang, e.target.value)}
              required={activeLang === 'vi'}
            />
          </div>
          {/* Destination */}
          <div className='form-group'>
             <label htmlFor={`destination-${activeLang}`}>Điểm đến <span className="required">*</span></label>
             <select id='destination-vi' name='destination-vi' value={formData.tour.destination?.vi || ''} onChange={(e) => {
                 const selectedDestNameVi = e.target.value;
                 const selectedDestData = destinations.find(d => d.name === selectedDestNameVi);
                 handleNestedChange('tour', 'destination', 'vi', selectedDestNameVi);
                 handleNestedChange('tour', 'destination', 'en', selectedDestData?.name_en || selectedDestNameVi);
                 handleNestedChange('tour', 'destination', 'fr', selectedDestData?.name_fr || selectedDestNameVi);
             }} required>
                 <option value=''>-- Chọn điểm đến (VI) --</option>
                 {destinations.map(dest => ( <option key={dest._id} value={dest.name}>{dest.name}</option> ))}
             </select>
             {activeLang !== 'vi' && formData.tour.destination?.[activeLang] && ( // Optional chaining
                <p className="derived-lang-display">Tên ({activeLang.toUpperCase()}): {formData.tour.destination[activeLang]}</p>
             )}
          </div>
          {/* Date */}
          <div className='form-group'>
            <label htmlFor='date'>Ngày</label>
            <input type='text' id='date' name='date' value={formData.tour.date || ''} onChange={handleTourSimpleChange} required placeholder='VD: 20/12/2024 - 30/12/2024' />
          </div>
          {/* Image */}
          <div className='form-group'>
            <label htmlFor='image'>Hình ảnh Đại Diện</label>
            <div className='file-input-container'>
              <input type='text' id='image' name='image' value={formData.tour.image || ''} onChange={handleTourSimpleChange} placeholder='URL hình ảnh hoặc chọn file' className='file-input-text' />
              <input type='file' id='tour-image-upload' accept='image/*' ref={tourImageInputRef} style={{ display: 'none' }} onChange={handleTourImageSelect} />
              <button type='button' className='browse-btn' onClick={() => tourImageInputRef.current?.click()}>Browse...</button> {/* Optional chaining */}
            </div>
            {tourImagePreview && <div className='image-preview'><img src={tourImagePreview} alt='Tour Preview' style={{ maxWidth: '200px', marginTop: '10px' }} /></div>}
          </div>
          {/* Description */}
          <div className='form-group'>
            <label htmlFor={`description-${activeLang}`}>Mô tả <span className="required">*</span></label>
            <textarea
              id={`description-${activeLang}`}
              placeholder={`Mô tả (${activeLang.toUpperCase()})`}
              value={formData.tour.description?.[activeLang] || ''} // Optional chaining
              onChange={(e) => handleNestedChange('tour', 'description', activeLang, e.target.value)}
              required={activeLang === 'vi'}
              rows={4} // Add rows for better default size
            />
          </div>
          {/* Link */}
          <div className='form-group' style={{ display: 'none' }}>
             <label htmlFor='link'>Link</label>
             <input type='text' id='link' name='link' value={formData.tour.link || ''} onChange={handleTourSimpleChange} required readOnly />
          </div>
        </div>
      )}

      {/* --- Tour Content Tab --- */}
      {activeTab === 'tourContent' && (
        <div className='tab-content'>
          <h2>Nội dung tour ({activeLang.toUpperCase()})</h2>
          <div className='word-editor'>
            <div className='document-container'>
              <div className='document-page'>
                {/* Detail Title */}
                <div className='form-group'>
                   <label htmlFor={`detail-title-${activeLang}`}>Tiêu đề chi tiết <span className="required">*</span></label>
                   <input
                      // Assign the ref here
                      ref={activeLang === 'vi' ? detailTitleInputRef : null}
                      id={`detail-title-${activeLang}`}
                      type='text'
                      placeholder={`Tiêu đề chi tiết (${activeLang.toUpperCase()})`}
                      className='document-title'
                      value={formData.detail.title?.[activeLang] || ''} // Optional chaining
                      onChange={(e) => handleNestedChange('detail', 'title', activeLang, e.target.value)}
                      required={activeLang === 'vi'} // Keep HTML5 required for VI
                    />
                </div>
                {/* Intro */}
                <div className='form-group'>
                  <label>Giới thiệu</label>
                  <LexicalEditor
                    key={`intro-${activeLang}`} // Key is essential for language switching
                    initialHtml={formData.detail.intro?.[activeLang] || ''} // Optional chaining
                    onChange={html => handleIntroChange(activeLang, html)}
                  />
                </div>
                {/* Schedule */}
                <div className='schedule-section'>
                  <h3 className='section-title'>Lịch trình chi tiết</h3>
                  {/* Map over days safely */}
                  {(formData.detail.days || []).map((day, dayIndex) => (
                    <div key={dayIndex} className='document-day'>
                      <div className='day-header-container'>
                        {/* Day Title Input */}
                        <div className='form-group' style={{ flexGrow: 1, marginRight: '15px' }}>
                           <label htmlFor={`day-${dayIndex}-title-${activeLang}`}>Tiêu đề ngày {dayIndex + 1} <span className="required">*</span></label>
                           <input
                              id={`day-${dayIndex}-title-${activeLang}`}
                              type='text'
                              placeholder={`Tiêu đề ngày (${activeLang.toUpperCase()})`}
                              className='day-title-input'
                              value={day.title?.[activeLang] || ''} // Optional chaining
                              onChange={e => handleDayTitleChange(dayIndex, activeLang, e.target.value)}
                              required={activeLang === 'vi'}
                            />
                        </div>
                        <button type='button' className='remove-day-btn' onClick={() => removeDay(dayIndex)} title='Xóa ngày này'><i className='fas fa-trash'></i></button>
                      </div>

                      {/* Day Content Items */}
                      <div className='day-contents'>
                        {/* Map over content safely */}
                        {(day.content || []).map((contentItem, contentIndex) => (
                          <div key={contentIndex} className='content-item-document'>
                             <label>Nội dung {contentIndex + 1}</label>
                             <LexicalEditor
                                key={`day-${dayIndex}-content-${contentIndex}-${activeLang}`} // Key is essential
                                initialHtml={contentItem?.[activeLang] || ''} // Optional chaining
                                onChange={html => handleDayContentChange(dayIndex, contentIndex, activeLang, html)}
                             />
                             <button type='button' className='remove-content-btn' onClick={() => removeContentItem(dayIndex, contentIndex)} title='Xóa nội dung này'><i className='fas fa-minus-circle'></i></button>
                          </div>
                        ))}
                        <button type='button' className='add-content-btn document-style' onClick={() => addContentItem(dayIndex)}><i className='fas fa-plus-circle'></i> Thêm nội dung</button>
                      </div>
                    </div>
                  ))}
                  <div className='add-day-container'>
                    <button type='button' className='add-day-btn' onClick={addDay}><i className='fas fa-calendar-plus'></i> Thêm ngày mới</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Gallery Tab --- */}
      {activeTab === 'gallery' && (
        <div className='tab-content'>
          <h2>Thư viện ảnh ({activeLang.toUpperCase()})</h2>
          {/* Actions */}
          <div className='gallery-actions'>
             <button type='button' className='add-item-btn' onClick={addImage}><i className='fas fa-plus'></i> Thêm ảnh</button>
             <input type='file' id='multiple-gallery-images' accept='image/*' multiple ref={multipleImagesInputRef} style={{ display: 'none' }} onChange={handleMultipleImagesSelect} />
             <button type='button' className='add-item-btn upload-multiple-btn' onClick={() => multipleImagesInputRef.current?.click()}><i className='fas fa-images'></i> Tải lên nhiều ảnh</button> {/* Optional chaining */}
          </div>
          {/* Drop Area */}
          <div className={`drop-area ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
             <p>Kéo và thả các file ảnh vào đây</p><span>hoặc</span>
             <button type='button' className='browse-btn' onClick={() => multipleImagesInputRef.current?.click()}>Chọn file</button> {/* Optional chaining */}
          </div>
          {/* Image Items */}
          <div className='image-gallery'>
            {(formData.detail.images || []).map((img, imgIndex) => ( // Map safely
              <div key={imgIndex} className='image-item'>
                {/* Image URL/File Input */}
                <div className='form-group'>
                   <label htmlFor={`image-url-${imgIndex}`}>Hình ảnh</label>
                   <div className='file-input-container'>
                      <input type='text' id={`image-url-${imgIndex}`} value={img.image || ''} onChange={e => { const updatedImages = [...(formData.detail.images || [])]; if(updatedImages[imgIndex]) updatedImages[imgIndex].image = e.target.value; setFormData(prev => ({...prev, detail: {...prev.detail, images: updatedImages}})); }} placeholder='URL hình ảnh hoặc chọn file' className='file-input-text' />
                      <input type='file' id={`gallery-image-${imgIndex}`} accept='image/*' ref={el => (galleryImageInputsRef.current[imgIndex] = el)} style={{ display: 'none' }} onChange={e => handleGalleryImageSelect(imgIndex, e)} />
                      <button type='button' className='browse-btn' onClick={() => galleryImageInputsRef.current[imgIndex]?.click()}>Browse...</button> {/* Optional chaining */}
                   </div>
                   {galleryImagePreviews[imgIndex] && <div className='image-preview'><img src={galleryImagePreviews[imgIndex]} alt='Preview' style={{ maxWidth: '100%', marginTop: '10px' }} /></div>}
                </div>
                {/* Alt Text */}
                <div className='form-group'>
                  <label htmlFor={`image-alt-${imgIndex}-${activeLang}`}>Mô tả ảnh (Alt Text)</label>
                  <input
                    type='text'
                    id={`image-alt-${imgIndex}-${activeLang}`}
                    placeholder={`Mô tả ảnh (${activeLang.toUpperCase()})`}
                    value={img.alt?.[activeLang] || ''} // Optional chaining
                    onChange={e => handleImageAltChange(imgIndex, activeLang, e.target.value)}
                  />
                </div>
                <button type='button' className='remove-btn' onClick={() => removeImage(imgIndex)}><i className='fas fa-trash'></i></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit/Cancel Buttons */}
      <div className='btn-container'>
        <button type='button' className='cancel-btn' onClick={onCancel}>Hủy</button>
        <button type='submit' className='submit-btn' disabled={loading}>{loading ? 'Đang lưu...' : tourData ? 'Cập nhật' : 'Thêm mới'}</button>
      </div>
    </form>
  );
};

export default IntegratedTourForm;
