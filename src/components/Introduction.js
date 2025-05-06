import React from 'react'
import './IntroductionStyle.css'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Text from './Text'

const Introduction = () => {
  const { ref: textRef, inView: textVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const { ref: imageRef, inView: imageVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <div className='introduction' id='introduction'>
      <div className='introduction-container'>
        <div className='content'>
          <div
            ref={imageRef}
            className={`image ${imageVisible ? 'fade-in-left' : ''}`}
          >
            <div className='image-frame'>
              <img src='founder.jpg' alt='Founder' />
            </div>
          </div>
          <div
            ref={textRef}
            className={`text ${textVisible ? 'fade-in-right' : ''}`}
          >
            <Text tag='h3' className='subtitle' translationKey='letterTitle' />

            <Text tag='h2' className='title' translationKey='mainTitle' />

            <Text tag='p' translationKey='greeting' />

            <p>
              <Text tag='span' translationKey='introTextPart1' />
              <Text tag='strong'>LOTUS VOYAGES</Text>
              <Text tag='span' translationKey='introTextPart2' />
            </p>

            <Text tag='p' translationKey='happinessParagraph' />
            <Text tag='p' translationKey='dreamParagraph' />

            <div className='signature'>
              <p>Ms. Đặng Thị Liên</p>
              <p>Founder</p>
            </div>

            <Link to='/contact' className='learn-more-btn'>
              <Text translationKey='learnMore' />{' '}
              <i className='fas fa-long-arrow-alt-right'></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Introduction
