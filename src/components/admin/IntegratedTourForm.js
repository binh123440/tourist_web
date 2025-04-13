// Component form nhập liệu tour tích hợp
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './IntegratedTourFormStyle.css' // Import CSS cho component
import LexicalEditor from './LexicalEditor' // Đường dẫn tới component LexicalEditor
import ToolbarPlugin from './ToolbarPlugin' // Đường dẫn tới component ToolbarPlugin

const IntegratedTourForm = ({ tourData, onSubmit, onCancel }) => {
  // Định nghĩa state ban đầu cho tour và chi tiết tour
  const initialTourState = {
    title: '',
    destination: '',
    date: '',
    image: '',
    description: '',
    link: ''
  }

  const initialDetailState = {
    title: '',
    intro: '',
    days: [],
    images: []
  }

  // State chính quản lý dữ liệu form
  const [formData, setFormData] = useState({
    tour: { ...initialTourState },
    detail: { ...initialDetailState }
  })

  const [tourImageFile, setTourImageFile] = useState(null)
  const [tourImagePreview, setTourImagePreview] = useState(null)
  const [galleryImageFiles, setGalleryImageFiles] = useState({})
  const [galleryImagePreviews, setGalleryImagePreviews] = useState({})
  const [destinations, setDestinations] = useState([]) // Danh sách điểm đến
  const [loading, setLoading] = useState(false) // Trạng thái đang tải
  const [activeTab, setActiveTab] = useState('basicInfo') // Tab đang hiển thị
  const [dayCount, setDayCount] = useState(0) // Số ngày trong lịch trình
  const fileInputRef = useRef(null) // Tham chiếu đến input file
  // Bổ sung thêm tham chiếu cho input files
  const tourImageInputRef = useRef(null)
  const galleryImageInputsRef = useRef({})
  const multipleImagesInputRef = useRef(null)
  // State quản lý trạng thái kéo thả
  const [dragActive, setDragActive] = useState(false);

  // Hàm chuyển đổi tiếng Việt sang không dấu và tạo slug
  const generateSlug = text => {
    // Loại bỏ dấu tiếng Việt
    let str = text.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    // Loại bỏ ký tự đặc biệt và thay khoảng trắng bằng gạch ngang
    str = str.replace(/[^a-z0-9]/g, ' ')
    str = str.trim().replace(/\s+/g, '-')

    return str
  }

  // Thêm state để lưu trữ id tự động
  const [autoId, setAutoId] = useState(
    // Nếu đang sửa tour và đã có link, giữ nguyên id cũ
    tourData?.tour?.link?.split('-').pop() ||
      // Nếu là tour mới, tạo id từ timestamp
      Math.floor((new Date().getTime() / 1000) % 10000)
  )

  // Khi component được tải hoặc tourData thay đổi
  useEffect(() => {
    if (tourData) {
      // Nếu có dữ liệu, điền vào form
      setFormData({
        tour: tourData.tour || { ...initialTourState },
        detail: tourData.detail || { ...initialDetailState }
      })

      // Cập nhật số ngày trong lịch trình
      if (tourData.detail && tourData.detail.days) {
        setDayCount(tourData.detail.days.length)
      }
    }

    // Thay thế gọi API bằng dữ liệu cứng về điểm đến
    const hardcodedDestinations = [
      { _id: '1', name: 'Việt Nam' },
      { _id: '2', name: 'Bhutan' },
      { _id: '3', name: 'Pháp' }
    ]

    setDestinations(hardcodedDestinations)
  }, [tourData])

  // Thêm useEffect để cập nhật link tự động khi destination thay đổi
  useEffect(() => {
    // Chỉ tự động tạo link khi destination được chọn và không phải đang edit tour cũ
    if (
      formData.tour.destination &&
      (!tourData?.tour?.link || formData.tour.link === '')
    ) {
      const destSlug = generateSlug(formData.tour.destination)
      const newLink = `${destSlug}-${autoId}`

      setFormData({
        ...formData,
        tour: {
          ...formData.tour,
          link: newLink
        }
      })
    }
  }, [formData.tour.destination])

  // Xử lý thay đổi các trường thông tin cơ bản của tour
  const handleTourChange = e => {
    setFormData({
      ...formData,
      tour: {
        ...formData.tour,
        [e.target.name]: e.target.value
      }
    })
  }

  // Xử lý thay đổi các trường thông tin chi tiết của tour
  const handleDetailChange = e => {
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        [e.target.name]: e.target.value
      }
    })
  }

  // Xử lý thay đổi thông tin ngày trong lịch trình
  const handleDayChange = (index, field, value) => {
    const updatedDays = [...(formData.detail.days || [])]

    // Tạo ngày mới nếu chưa có
    if (!updatedDays[index]) {
      updatedDays[index] = { title: '', content: [] }
    }

    // Cập nhật tiêu đề hoặc nội dung
    if (field === 'title') {
      updatedDays[index].title = value
    } else if (field.startsWith('content')) {
      const contentIndex = parseInt(field.split('-')[1])
      if (!updatedDays[index].content) {
        updatedDays[index].content = []
      }
      updatedDays[index].content[contentIndex] = value
    }

    // Cập nhật state
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        days: updatedDays
      }
    })
  }

  // Thêm một ngày mới vào lịch trình
  const addDay = () => {
    setDayCount(dayCount + 1)

    const updatedDays = [...(formData.detail.days || [])]
    updatedDays.push({ title: '', content: [''] })

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        days: updatedDays
      }
    })
  }

  // Xóa một ngày khỏi lịch trình
  const removeDay = index => {
    const updatedDays = [...(formData.detail.days || [])]
    updatedDays.splice(index, 1)

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        days: updatedDays
      }
    })

    setDayCount(dayCount - 1)
  }

  // Thêm một mục nội dung vào một ngày
  const addContentItem = dayIndex => {
    const updatedDays = [...(formData.detail.days || [])]
    if (!updatedDays[dayIndex].content) {
      updatedDays[dayIndex].content = []
    }
    updatedDays[dayIndex].content.push('')

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        days: updatedDays
      }
    })
  }

  // Xóa một mục nội dung khỏi một ngày
  const removeContentItem = (dayIndex, contentIndex) => {
    const updatedDays = [...(formData.detail.days || [])]
    updatedDays[dayIndex].content.splice(contentIndex, 1)

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        days: updatedDays
      }
    })
  }

  // Xử lý thay đổi thông tin ảnh trong thư viện
  const handleImageChange = (index, field, value) => {
    const updatedImages = [...(formData.detail.images || [])]

    if (!updatedImages[index]) {
      updatedImages[index] = { image: '', alt: '' }
    }

    updatedImages[index][field] = value

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        images: updatedImages
      }
    })
  }

  // Thêm một ảnh mới vào thư viện
  const addImage = () => {
    const updatedImages = [...(formData.detail.images || [])]
    updatedImages.push({ image: '', alt: '' })

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        images: updatedImages
      }
    })
  }

  // Xóa một ảnh khỏi thư viện
  const removeImage = index => {
    const updatedImages = [...(formData.detail.images || [])]
    updatedImages.splice(index, 1)

    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        images: updatedImages
      }
    })
  }

  // Xử lý khi chọn ảnh đại diện cho tour
  const handleTourImageSelect = e => {
    const file = e.target.files[0]
    if (file) {
      // Cập nhật state với file đã chọn
      setTourImageFile(file)

      // Tạo URL preview cho ảnh
      const reader = new FileReader()
      reader.onloadend = () => {
        setTourImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Cập nhật URL trong formData (tạm thời)
      setFormData({
        ...formData,
        tour: {
          ...formData.tour,
          image: file.name // Tạm lưu tên file
        }
      })
    }
  }

  // Xử lý khi chọn ảnh cho gallery
  const handleGalleryImageSelect = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      // Cập nhật state với file đã chọn
      setGalleryImageFiles(prev => ({
        ...prev,
        [index]: file
      }))

      // Tạo URL preview cho ảnh
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryImagePreviews(prev => ({
          ...prev,
          [index]: reader.result
        }))
      }
      reader.readAsDataURL(file)

      // Cập nhật alt text trong formData nếu trống
      const updatedImages = [...(formData.detail.images || [])]
      if (!updatedImages[index].alt) {
        updatedImages[index].alt = file.name
      }

      // Cập nhật url tạm thời
      updatedImages[index].image = file.name

      setFormData({
        ...formData,
        detail: {
          ...formData.detail,
          images: updatedImages
        }
      })
    }
  }

  // Xử lý khi chọn nhiều ảnh cho gallery
  const handleMultipleImagesSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
  
    // Clone mảng images hiện tại
    const updatedImages = [...(formData.detail.images || [])]
    const startIndex = updatedImages.length
    
    // Thêm mỗi file như một ảnh mới
    files.forEach((file, i) => {
      const currentIndex = startIndex + i
      updatedImages.push({ image: file.name, alt: file.name })
      
      // Cập nhật files và previews
      setGalleryImageFiles(prev => ({
        ...prev,
        [currentIndex]: file
      }))
      
      // Tạo preview cho mỗi file
      const reader = new FileReader()
      reader.onloadend = () => {
        setGalleryImagePreviews(prev => ({
          ...prev,
          [currentIndex]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    })
    
    // Cập nhật state với các ảnh mới
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        images: updatedImages
      }
    })
    
    // Thông báo số lượng ảnh đã thêm
    alert(`Đã thêm ${files.length} ảnh vào thư viện`)
  }
  

  // Xử lý các sự kiện kéo (drag)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Xử lý sự kiện thả (drop)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Xử lý các file từ sự kiện drop
      const files = Array.from(e.dataTransfer.files);
      
      // Tạo một event object giả để sử dụng với hàm handleMultipleImagesSelect
      handleMultipleImagesSelect({ target: { files: e.dataTransfer.files } });
    }
  };
  

  // Cập nhật hàm submit form để xử lý upload file trước
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      // Xử lý upload ảnh đại diện tour nếu có
      let tourImageUrl = formData.tour.image
      if (tourImageFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('image', tourImageFile)
        formDataUpload.append('type', 'tour')

        const token = localStorage.getItem('token')
        const response = await axios.post(
          'http://localhost:5000/api/admin/gallery',
          formDataUpload,
          {
            headers: {
              'x-auth-token': token,
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        // Lấy URL hình ảnh được upload
        tourImageUrl = response.data.url
      }

      // Xử lý upload các ảnh gallery
      const updatedGalleryImages = [...(formData.detail.images || [])]

      // Upload từng ảnh và cập nhật URL
      for (let i = 0; i < updatedGalleryImages.length; i++) {
        if (galleryImageFiles[i]) {
          const formDataUpload = new FormData()
          formDataUpload.append('image', galleryImageFiles[i])
          formDataUpload.append('type', 'gallery')

          const token = localStorage.getItem('token')
          const response = await axios.post(
            'http://localhost:5000/api/admin/gallery',
            formDataUpload,
            {
              headers: {
                'x-auth-token': token,
                'Content-Type': 'multipart/form-data'
              }
            }
          )

          // Cập nhật URL ảnh
          updatedGalleryImages[i].image = response.data.url
        }
      }

      // Cập nhật formData với các URL ảnh mới
      const updatedFormData = {
        tour: {
          ...formData.tour,
          image: tourImageUrl
        },
        detail: {
          ...formData.detail,
          images: updatedGalleryImages
        }
      }

      // Gọi onSubmit prop với dữ liệu đã cập nhật
      onSubmit(updatedFormData)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Có lỗi khi tải ảnh lên. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleRichTextChange = (
    field,
    htmlString,
    dayIndex = null,
    contentIndex = null
  ) => {
    if (dayIndex !== null && contentIndex !== null) {
      // Cập nhật nội dung của một ngày cụ thể
      const updatedDays = formData.detail.days.map((day, dIndex) => {
        if (dIndex === dayIndex) {
          const updatedContent = day.content.map((item, cIndex) =>
            cIndex === contentIndex ? htmlString : item
          )
          return { ...day, content: updatedContent }
        }
        return day
      })
      setFormData(prev => ({
        ...prev,
        detail: { ...prev.detail, days: updatedDays }
      }))
    } else {
      // Cập nhật trường intro
      setFormData(prev => ({
        ...prev,
        detail: { ...prev.detail, [field]: htmlString }
      }))
    }
  }

  return (
    <form className='integrated-tour-form' onSubmit={handleSubmit}>
      <div className='form-tabs'>
        <button
          type='button'
          className={activeTab === 'basicInfo' ? 'active' : ''}
          onClick={() => setActiveTab('basicInfo')}
        >
          Thông tin cơ bản
        </button>
        <button
          type='button'
          className={activeTab === 'tourContent' ? 'active' : ''}
          onClick={() => setActiveTab('tourContent')}
        >
          Nội dung tour
        </button>
        <button
          type='button'
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          Thư viện ảnh
        </button>
      </div>

      {activeTab === 'basicInfo' && (
        <div className='tab-content'>
          <h2>Thông tin cơ bản</h2>

          <div className='form-group'>
            <label htmlFor='title'>Tiêu đề</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.tour.title}
              onChange={handleTourChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='destination'>Điểm đến</label>
            <select
              id='destination'
              name='destination'
              value={formData.tour.destination}
              onChange={handleTourChange}
              required
            >
              <option value=''>-- Chọn điểm đến --</option>
              {destinations.map(dest => (
                <option key={dest._id} value={dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='date'>Ngày</label>
            <input
              type='text'
              id='date'
              name='date'
              value={formData.tour.date}
              onChange={handleTourChange}
              required
              placeholder='VD: 20/12/2024 - 30/12/2024'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='image'>Hình ảnh</label>
            <div className='file-input-container'>
              <input
                type='text'
                id='image'
                name='image'
                value={formData.tour.image}
                onChange={handleTourChange}
                placeholder='URL hình ảnh hoặc chọn file'
                className='file-input-text'
              />
              <input
                type='file'
                id='tour-image-upload'
                accept='image/*'
                ref={tourImageInputRef}
                style={{ display: 'none' }}
                onChange={handleTourImageSelect}
              />
              <button
                type='button'
                className='browse-btn'
                onClick={() => tourImageInputRef.current.click()}
              >
                Browse...
              </button>
            </div>
            {tourImagePreview && (
              <div className='image-preview'>
                <img
                  src={tourImagePreview}
                  alt='Tour Preview'
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              </div>
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='description'>Mô tả</label>
            <textarea
              id='description'
              name='description'
              value={formData.tour.description}
              onChange={handleTourChange}
              required
            ></textarea>
          </div>

          <div className='form-group' style={{ display: 'none' }}>
            <label htmlFor='link'>Link (tự động tạo từ điểm đến)</label>
            <div className='link-input-container'>
              <input
                type='text'
                id='link'
                name='link'
                value={formData.tour.link}
                onChange={handleTourChange}
                required
                placeholder='Link sẽ tự động tạo khi chọn điểm đến'
                className='link-input-text'
              />
              <div className='link-preview'>
                <span>URL: </span>
                <code>
                  {formData.tour.link
                    ? `/tour-detail/${formData.tour.link}`
                    : ''}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tourContent' && (
        <div className='tab-content'>
          <h2>Nội dung tour</h2>

          <div className='word-editor'>
           

            <div className='document-container'>
              <div className='document-page'>
                <div className='form-group no-margin'>
                  <input
                    type='text'
                    id='detailTitle'
                    name='title'
                    value={formData.detail.title}
                    onChange={handleDetailChange}
                    required
                    className='document-title'
                    placeholder='Nhập tiêu đề chi tiết tour...'
                  />
                </div>
                
                <div className='form-group no-margin'>
                  <label htmlFor='intro'>Giới thiệu</label>{' '}
                  {/* Thêm label nếu muốn */}
                </div>
                <LexicalEditor
                  initialHtml={formData.detail.intro || ''}
                  onChange={html => handleRichTextChange('intro', html)}
                />
                <div className='schedule-section'>
                  <h3 className='section-title'>Lịch trình chi tiết</h3>

                  {Array.from({ length: dayCount }).map((_, dayIndex) => (
                    <div key={dayIndex} className='document-day'>
                      <div className='day-header-container'>
                        <input
                          type='text'
                          value={formData.detail.days?.[dayIndex]?.title || ''}
                          onChange={e =>
                            handleDayChange(dayIndex, 'title', e.target.value)
                          }
                          required
                          placeholder={`NGÀY ${dayIndex + 1}: TIÊU ĐỀ NGÀY`}
                          className='day-title-input'
                        />

                        <button
                          type='button'
                          className='remove-day-btn'
                          onClick={() => removeDay(dayIndex)}
                          title='Xóa ngày này'
                        >
                          <i className='fas fa-trash'></i>
                        </button>
                      </div>

                      <div className='day-contents'>
                        {formData.detail.days?.[dayIndex]?.content?.map(
                          (content, contentIndex) => (
                            <div
                              key={contentIndex}
                              className='content-item-document'
                            >
                              <LexicalEditor
                                initialHtml={content} // Truyền HTML ban đầu của content item
                                onChange={htmlString =>
                                  handleRichTextChange(
                                    'content',
                                    htmlString,
                                    dayIndex,
                                    contentIndex
                                  )
                                } // Hàm cập nhật state
                              />
                              <button
                                type='button'
                                className='remove-content-btn'
                                onClick={() =>
                                  removeContentItem(dayIndex, contentIndex)
                                }
                                title='Xóa nội dung này'
                              >
                                <i className='fas fa-minus-circle'></i>
                              </button>
                            </div>
                          )
                        )}

                        <button
                          type='button'
                          className='add-content-btn document-style'
                          onClick={() => addContentItem(dayIndex)}
                        >
                          <i className='fas fa-plus-circle'></i> Thêm nội dung
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className='add-day-container'>
                    <button
                      type='button'
                      className='add-day-btn'
                      onClick={addDay}
                    >
                      <i className='fas fa-calendar-plus'></i> Thêm ngày mới
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className='tab-content'>
          <h2>Lịch trình tour</h2>

          <button type='button' className='add-item-btn' onClick={addDay}>
            <i className='fas fa-plus'></i> Thêm ngày
          </button>

          {Array.from({ length: dayCount }).map((_, dayIndex) => (
            <div key={dayIndex} className='day-container'>
              <div className='day-header'>
                <h3>Ngày {dayIndex + 1}</h3>
                <button
                  type='button'
                  className='remove-btn'
                  onClick={() => removeDay(dayIndex)}
                >
                  <i className='fas fa-trash'></i>
                </button>
              </div>

              <div className='form-group'>
                <label htmlFor={`day-title-${dayIndex}`}>Tiêu đề ngày</label>
                <input
                  type='text'
                  id={`day-title-${dayIndex}`}
                  value={formData.detail.days?.[dayIndex]?.title || ''}
                  onChange={e =>
                    handleDayChange(dayIndex, 'title', e.target.value)
                  }
                  required
                  placeholder='VD: NGÀY 1: TOUR SƠN TRÀ (ĂN TỐI)'
                />
              </div>

              <div className='content-items'>
                <h4>Nội dung chi tiết</h4>

                {formData.detail.days?.[dayIndex]?.content?.map(
                  (content, contentIndex) => (
                    <div key={contentIndex} className='content-item'>
                      <textarea
                        value={content}
                        onChange={e =>
                          handleDayChange(
                            dayIndex,
                            `content-${contentIndex}`,
                            e.target.value
                          )
                        }
                        rows='3'
                        required
                      ></textarea>

                      <button
                        type='button'
                        className='remove-btn small'
                        onClick={() =>
                          removeContentItem(dayIndex, contentIndex)
                        }
                      >
                        <i className='fas fa-times'></i>
                      </button>
                    </div>
                  )
                )}

                <button
                  type='button'
                  className='add-content-btn'
                  onClick={() => addContentItem(dayIndex)}
                >
                  <i className='fas fa-plus'></i> Thêm nội dung
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className='tab-content'>
          <h2>Thư viện ảnh</h2>

          <div className='gallery-actions'>
            <button type='button' className='add-item-btn' onClick={addImage}>
              <i className='fas fa-plus'></i> Thêm ảnh
            </button>
            
            <input
              type='file'
              id='multiple-gallery-images'
              accept='image/*'
              multiple
              ref={multipleImagesInputRef}
              style={{ display: 'none' }}
              onChange={handleMultipleImagesSelect}
            />
            <button
              type='button'
              className='add-item-btn upload-multiple-btn'
              onClick={() => multipleImagesInputRef.current.click()}
            >
              <i className='fas fa-images'></i> Tải lên nhiều ảnh
            </button>
          </div>

          <div 
            className={`drop-area ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <p>Kéo và thả các file ảnh vào đây</p>
            <span>hoặc</span>
            <button
              type='button'
              className='browse-btn'
              onClick={() => multipleImagesInputRef.current.click()}
            >
              Chọn file
            </button>
          </div>

          <div className='image-gallery'>
            {formData.detail.images?.map((img, imgIndex) => (
              <div key={imgIndex} className='image-item'>
                <div className='form-group'>
                  <label htmlFor={`image-url-${imgIndex}`}>Hình ảnh</label>
                  <div className='file-input-container'>
                    <input
                      type='text'
                      id={`image-url-${imgIndex}`}
                      value={img.image}
                      onChange={e =>
                        handleImageChange(imgIndex, 'image', e.target.value)
                      }
                      placeholder='URL hình ảnh hoặc chọn file'
                      className='file-input-text'
                    />
                    <input
                      type='file'
                      id={`gallery-image-${imgIndex}`}
                      accept='image/*'
                      ref={el => (galleryImageInputsRef.current[imgIndex] = el)}
                      style={{ display: 'none' }}
                      onChange={e => handleGalleryImageSelect(imgIndex, e)}
                    />
                    <button
                      type='button'
                      className='browse-btn'
                      onClick={() =>
                        galleryImageInputsRef.current[imgIndex].click()
                      }
                    >
                      Browse...
                    </button>
                  </div>
                  {galleryImagePreviews[imgIndex] && (
                    <div className='image-preview'>
                      <img
                        src={galleryImagePreviews[imgIndex]}
                        alt='Preview'
                        style={{ maxWidth: '100%', marginTop: '10px' }}
                      />
                    </div>
                  )}
                </div>

                <div className='form-group'>
                  <label htmlFor={`image-alt-${imgIndex}`}>Mô tả ảnh</label>
                  <input
                    type='text'
                    id={`image-alt-${imgIndex}`}
                    value={img.alt}
                    onChange={e =>
                      handleImageChange(imgIndex, 'alt', e.target.value)
                    }
                    required
                    placeholder='VD: Cảnh Đẹp Bhutan'
                  />
                </div>

                <button
                  type='button'
                  className='remove-btn'
                  onClick={() => removeImage(imgIndex)}
                >
                  <i className='fas fa-trash'></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='btn-container'>
        <button type='button' className='cancel-btn' onClick={onCancel}>
          Hủy
        </button>
        <button type='submit' className='submit-btn' disabled={loading}>
          {loading ? 'Đang lưu...' : tourData ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>
    </form>
  )
}

export default IntegratedTourForm
