const translations = {
  // Vietnamese (default language)
  vi: {
    // Navbar
    about: "Về chúng tôi",
    tour: "Điểm đến",
    contact: "Liên hệ",
    bookNow: "Đặt lịch ngay",
    admin: "Admin",
    logout: "Đăng xuất",

    // Footer
    contactUs: "Liên Hệ",
    otherPlatforms: "Nền tảng khác",
    address: "K285/43 Lê Duẩn, Phường Tân Chính, Quận Thanh Khê, Thành phố Đà Nẵng, Việt Nam",
    phone: "Điện thoại",
    email: "Email",
    backToTop: "Về đầu trang",

    // Introduction
    letterTitle: "Thư ngỏ",
    mainTitle: "VÌ MỘT HÀNH TINH XANH",
    greeting: "Bạn thân mến,",
    introTextPart1: "Với nguyện ước đóng góp phần mình cho đất nước đẹp tươi, thông qua việc tổ chức những chuyến du lịch khám phá đầy ý nghĩa, trong sự lựa chọn lối sống xanh và lành, chúng tôi đã bắt đầu thực hiện dự án thành lập - ",
    introTextPart2: ".",
    introText: "Với nguyện ước đóng góp phần mình cho đất nước đẹp tươi, thông qua việc tổ chức những chuyến du lịch khám phá đầy ý nghĩa, trong sự lựa chọn lối sống xanh và lành, chúng tôi đã bắt đầu thực hiện dự án thành lập - LOTUS VOYAGES.",
    happinessParagraph: "Chúng tôi thật sự hạnh phúc khi mà dự án ấp ủ bấy lâu nay của chúng tôi đã thành hiện thực.",
    dreamParagraph: "Ước mơ tổ chức các chuyến du lịch chăm sóc sức khoẻ và phát triển những tài năng của bản thân, chúng tôi sẽ tổ chức các tour du lịch gồm workshop yoga, thiền tập, nấu ăn thuần chay, hội họa…",
    learnMore: "Tìm hiểu thêm",

    // WhyChooseUs (General - Keep these if used for section titles/subtitles)
    whyChooseUs: "TẠI SAO CHỌN CHÚNG TÔI", // Keep this one if used as general title
    whyChooseUsSubtitle: "Lý do chọn chúng tôi",
    whyChooseUsTitle: "VÌ SAO CHỌN LOTUS VOYAGES",
    personalizedService: "Dịch vụ cá nhân hóa", // Keep this one
    personalizedDescription: "Chúng tôi cung cấp các chương trình du lịch được thiết kế riêng theo yêu cầu của khách hàng, đảm bảo đáp ứng mọi nhu cầu và mong muốn của quý khách.", // Keep this one
    expertGuides: "Hướng dẫn viên chuyên nghiệp", // Keep this one
    expertGuidesDescription: "Đội ngũ hướng dẫn viên của chúng tôi là những người am hiểu sâu sắc về văn hóa, lịch sử và các điểm đến, mang đến cho bạn những trải nghiệm phong phú và đáng nhớ.", // Keep this one

    // Tours
    experiencePrograms: "CHƯƠNG TRÌNH TRẢI NGHIỆM",
    allDestinations: "Tất cả",
    bhutan: "Bhutan",
    vietnam: "Việt Nam",
    france: "Pháp",
    loadingTours: "Đang tải chương trình tour...",
    errorLoadingTours: "Không thể tải danh sách tour. Vui lòng thử lại sau.",
    noToursFound: "Không có tour nào phù hợp với tiêu chí tìm kiếm.",
    viewAllTours: "Xem tất cả tour",
    daysLeft: "Còn {days} ngày",
    viewDetails: "Xem chi tiết",
    editTour: "Sửa tour",
    deleteTour: "Xóa tour",
    confirmDeleteTour: "Bạn có chắc chắn muốn xóa tour này?",
    deleteTourError: "Không thể xóa tour",

    // For TourDetail component
    loadingTourDetails: "Đang tải chi tiết tour...",
    errorLoadingTourDetails: "Không thể tải chi tiết tour.",
    tourNotFound: "Không tìm thấy dữ liệu tour này.",
    tourIntroduction: "Giới thiệu",
    tourItinerary: "Lịch trình chi tiết",
    noImagesAvailable: "Không có hình ảnh nào.",
    noIntroductionAvailable: "Chưa có phần giới thiệu.",
    noItineraryAvailable: "Chưa có lịch trình chi tiết.",
    relatedTours: "Các tour liên quan",
    editTour: "Sửa Tour",

    // WhyChooseUs (Specific Items - Ensure these keys are unique if needed, or reuse above)
    whyChooseUsItem1Title: "Trải nghiệm nhiều phong cách",
    whyChooseUsItem1Desc: "Lotus Voyages vô cùng tự hào khi được phục vụ tất cả mọi du khách từ cá nhân đến nhóm, công ty, tổ chức đến với các trải nghiệm đến những vùng đất đặc biệt với các trải nghiệm vô cùng thú vị từ thiên đỉnh, văn hoá, leo núi, khám phá thiên nhiên, đời sống người dân địa phương du mục và trải nghiệm mục đích phát triển kinh doanh.",
    whyChooseUsItem2Title: "Chất lượng Trải nghiệm",
    whyChooseUsItem2Desc: "Lotus Voyages vô cùng kỹ lưỡng cẩn thận trong việc lựa chọn các trải nghiệm, từ nơi lưu trú, khách sạn, các hoạt động địa danh, ăn uống, phương tiện di chuyển và đặc biệt người bạn địa phương trong mỗi hành trình để mọi miền khám phá lại những trải nghiệm đáng nhớ và chất lượng tốt nhất dành cho quý khách hàng.",
    whyChooseUsItem3Title: "Đối tác tin cậy, nhiều năm kinh nghiệm",
    whyChooseUsItem3Desc: "Các thành viên Lotus Voyages có kinh nghiệm nhiều năm làm việc trong ngành du lịch, hợp tác chiến lược trực tiếp với các đối tác hàng không như Bhutan Airlines, Druk Air, Khách sạn: Six Senses, Aman, Bhutan Spirit Sanctuary, Naksel, St Regis, Shangrila, Hyatt, Ritz Carlton, Accors, Marriott... Đồng thời Team có kinh nghiệm mở đường bay thẳng, charter nguyên chuyến đến Bhutan từ Việt Nam từ năm 2017- đơn vị đầu tiên.",
    whyChooseUsItem4Title: "Đội ngũ chuyên nghiệp", // Consider if this should be teamSubtitle
    whyChooseUsItem4Desc: "Đội ngũ của chúng tôi có kinh nghiệm và chuyên môn cao, luôn sẵn sàng hỗ trợ và phục vụ khách hàng một cách tận tâm và chuyên nghiệp.", // Consider if this should be expertGuidesDescription
    whyChooseUsItem5Title: "Không Shopping tour",
    whyChooseUsItem5Desc: "Chúng tôi cam kết không tổ chức các tour du lịch có mục đích mua sắm, đảm bảo mang lại trải nghiệm du lịch thuần túy và ý nghĩa nhất cho khách hàng.",
    whyChooseUsItem6Title: "Chương trình thiết kế riêng", // Consider if this should be personalizedService
    whyChooseUsItem6Desc: "Chúng tôi cung cấp các chương trình du lịch được thiết kế riêng theo yêu cầu của khách hàng, đảm bảo đáp ứng mọi nhu cầu và mong muốn của quý khách.", // Consider if this should be personalizedDescription

    // TeamMember
    teamSubtitle: "Đội ngũ chuyên nghiệp",
    teamTitle: "ĐỘI NGŨ CỦA LOTUS VOYAGES",
    viewMore: "Xem thêm",
    collapse: "Thu gọn",
    viewMoreAria: "Xem thêm thông tin",
    collapseAria: "Thu gọn thông tin",

    // TeamMember (Specific Members)
    teamMember1Name: "Liên Đặng - CEO",
    teamMember1Position: "CEO",
    teamMember1Desc: "Là một người đam mê du lịch, yêu thích thiên nhiên, khám phá văn hóa lịch sử và hơn 15 năm kinh nghiệm trong lĩnh vực du lịch, may mắn đến nhiều vùng đất trên thế giới và được nghe và truyền cảm hứng bởi những câu chuyện về con người, văn hóa, lịch sử, cuộc sống... Liên Đặng luôn phấn đấu để lan tỏa hạnh phúc và niềm vui đến mọi người.",

    // Slider
    slide1Title: "KHÁM PHÁ THIÊN NHIÊN",
    slide1Desc: "Hành trình về với thiên nhiên và văn hóa bản địa",
    slide2Title: "TRẢI NGHIỆM BẢN SẮC",
    slide2Desc: "Những điểm đến độc đáo và khó quên",
    slide3Title: "DU LỊCH XANH",
    slide3Desc: "Cam kết vì một hành tinh xanh và du lịch bền vững",
    bookNowSlider: "Đặt Lịch Ngay",
    contactSupport: "Liên Hệ Tư Vấn",

    // Reviews
    reviewsTitle: "Cảm nghĩ của khách hàng về chúng tôi",
    recommends: "Recommends",
    readReview: "Xem bài đánh giá",
    followUsSocial: "Hãy theo dõi chúng tôi trên FaceBook và Instagram để nắm bắt những đánh giá và cập nhật mới mới nhất",

    // Gallery
    ourJourney: "Hành trình của chúng tôi",
    photoGallery: "THƯ VIỆN ẢNH",
    loadingGallery: "Đang tải thư viện ảnh...",
    errorLoadingGallery: "Không thể tải thư viện ảnh",
    loadMore: "Xem thêm",
    deleteImageConfirm: "Bạn có chắc chắn muốn xóa ảnh này?",
    deleteImageError: "Không thể xóa ảnh",
    galleryImage: "Hình ảnh",
    galleryDefaultDesc: "Lotus Voyages",

    // Footer (Specific section)
    footerTagline: "Hành trình đẳng cấp - Trải nghiệm xanh",
    licenseInfo: "GPKD Dịch Vụ Lữ Hành Quốc Tế số 48-361/2023 được Tổng cục Du Lịch Việt Nam tại Hà Nội cấp ngày 24/04/2023",
    contactFooter: "Liên Hệ",
    addressFooter: "K285/43 Lê Duẩn, Tân Chính, Thanh Khê, Đà Nẵng, Việt Nam",
    workingHours: "Thứ Hai - Thứ Bảy: 9:00 - 17:30",
    quickLinks: "Liên Kết Nhanh",
    home: "Trang Chủ",
    toursLink: "Tour Du Lịch",
    aboutUsLink: "Về Chúng Tôi",
    contactLink: "Liên Hệ",
    taxCode: "Mã số thuế: 0402162459",

    // Destinations
    destinationsSubtitle: "Khám phá điểm đến",
    destinationsTitle: "ĐIỂM ĐẾN ĐẶC TRƯNG",
    explore: "Khám phá",

    // CTA Banner
    ctaUniqueDestinationsTitle: "Điểm Đến Độc Đáo",
    ctaUniqueDestinationsDesc: "Khám phá những địa điểm du lịch độc đáo nhất",
    ctaGreenTourismTitle: "Du Lịch Xanh",
    ctaGreenTourismDesc: "Cam kết với môi trường và phát triển bền vững",
    ctaProGuidesTitle: "Hướng Dẫn Chuyên Nghiệp",
    ctaProGuidesDesc: "Đội ngũ hướng dẫn viên chuyên nghiệp và thân thiện",
    ctaDedicatedServiceTitle: "Dịch Vụ Tận Tâm",
    ctaDedicatedServiceDesc: "Chăm sóc và hỗ trợ khách hàng tận tình",
  },

  // English translations
  en: {
    // Navbar
    about: "About Us",
    tour: "Destinations",
    contact: "Contact",
    bookNow: "Book Now",
    admin: "Admin",
    logout: "Logout",

    // Footer
    contactUs: "Contact Us",
    otherPlatforms: "Other Platforms",
    address: "K285/43 Le Duan, Tan Chinh Ward, Thanh Khe District, Da Nang City, Vietnam",
    phone: "Phone",
    email: "Email",
    backToTop: "Back to top",

    // Introduction
    letterTitle: "Open Letter",
    mainTitle: "FOR A GREEN PLANET",
    greeting: "Dear Friend,",
    introTextPart1: "With the wish to contribute to the beautiful country through organizing meaningful discovery trips, in choosing a green and healthy lifestyle, we have started implementing the foundation project - ",
    introTextPart2: ".",
    introText: "With the wish to contribute to the beautiful country through organizing meaningful discovery trips, in choosing a green and healthy lifestyle, we have started implementing the foundation project - LOTUS VOYAGES.",
    happinessParagraph: "We are truly happy that our long-cherished project has become a reality.",
    dreamParagraph: "With the dream of organizing health care tours and developing personal talents, we will organize tours including yoga workshops, meditation practice, vegan cooking, painting...",
    learnMore: "Learn More",

    // WhyChooseUs (General)
    whyChooseUs: "WHY CHOOSE US",
    whyChooseUsSubtitle: "Reasons to choose us",
    whyChooseUsTitle: "WHY CHOOSE LOTUS VOYAGES",
    personalizedService: "Personalized Service", // Keep this one
    personalizedDescription: "We provide travel programs tailored to customer requirements, ensuring that we meet all needs and desires of our clients.", // Keep this one
    expertGuides: "Expert Guides", // Keep this one
    expertGuidesDescription: "Our team of guides is deeply knowledgeable about culture, history and destinations, bringing you rich and memorable experiences.", // Keep this one

    // Tours
    experiencePrograms: "EXPERIENCE PROGRAMS",
    allDestinations: "All",
    bhutan: "Bhutan",
    vietnam: "Vietnam",
    france: "France",
    loadingTours: "Loading tours...",
    errorLoadingTours: "Could not load tours. Please try again later.",
    noToursFound: "No tours match the search criteria.",
    viewAllTours: "View All Tours",
    daysLeft: "{days} days left",
    viewDetails: "View Details",
    editTour: "Edit Tour",
    deleteTour: "Delete Tour",
    confirmDeleteTour: "Are you sure you want to delete this tour?",
    deleteTourError: "Could not delete tour",

    // For TourDetail component
    loadingTourDetails: "Loading tour details...",
    errorLoadingTourDetails: "Could not load tour details.",
    tourNotFound: "Tour data not found.",
    tourIntroduction: "Introduction",
    tourItinerary: "Detailed Itinerary",
    noImagesAvailable: "No images available.",
    noIntroductionAvailable: "No introduction available.",
    noItineraryAvailable: "No detailed itinerary available.",
    relatedTours: "Related Tours",
    editTour: "Edit Tour",

    // WhyChooseUs (Specific Items)
    whyChooseUsItem1Title: "Experience Many Styles",
    whyChooseUsItem1Desc: "Lotus Voyages is extremely proud to serve all travelers from individuals to groups, companies, organizations with experiences to special lands with extremely interesting experiences from zenith, culture, mountain climbing, nature discovery, nomadic local life and business development purpose experiences.",
    whyChooseUsItem2Title: "Quality Experience",
    whyChooseUsItem2Desc: "Lotus Voyages is extremely meticulous and careful in selecting experiences, from accommodation, hotels, landmark activities, dining, transportation and especially local friends in each journey so that all regions rediscover memorable experiences and the best quality for customers.",
    whyChooseUsItem3Title: "Reliable Partner, Many Years of Experience",
    whyChooseUsItem3Desc: "Lotus Voyages members have many years of experience working in the tourism industry, direct strategic cooperation with airline partners such as Bhutan Airlines, Druk Air, Hotels: Six Senses, Aman, Bhutan Spirit Sanctuary, Naksel, St Regis, Shangrila, Hyatt, Ritz Carlton, Accors, Marriott... At the same time, the Team has experience opening direct flights, chartering entire flights to Bhutan from Vietnam since 2017 - the first unit.",
    whyChooseUsItem4Title: "Professional Team",
    whyChooseUsItem4Desc: "Our team has high experience and expertise, always ready to support and serve customers wholeheartedly and professionally.",
    whyChooseUsItem5Title: "No Shopping Tour",
    whyChooseUsItem5Desc: "We are committed to not organizing shopping-oriented tours, ensuring the purest and most meaningful travel experience for customers.",
    whyChooseUsItem6Title: "Custom Designed Programs",
    whyChooseUsItem6Desc: "We provide travel programs tailored to customer requirements, ensuring that we meet all needs and desires of our clients.",

    // TeamMember
    teamSubtitle: "Professional Team",
    teamTitle: "LOTUS VOYAGES TEAM",
    viewMore: "View More",
    collapse: "Collapse",
    viewMoreAria: "View more information",
    collapseAria: "Collapse information",

    // TeamMember (Specific Members)
    teamMember1Name: "Lien Dang - CEO",
    teamMember1Position: "CEO",
    teamMember1Desc: "As a travel enthusiast, nature lover, cultural and historical explorer with over 15 years of experience in the tourism industry, fortunate to visit many lands around the world and be heard and inspired by stories about people, culture, history, life... Lien Dang always strives to spread happiness and joy to everyone.",

    // Slider
    slide1Title: "EXPLORE NATURE",
    slide1Desc: "Journey back to nature and indigenous culture",
    slide2Title: "EXPERIENCE IDENTITY",
    slide2Desc: "Unique and unforgettable destinations",
    slide3Title: "GREEN TOURISM",
    slide3Desc: "Committed to a green planet and sustainable tourism",
    bookNowSlider: "Book Now",
    contactSupport: "Contact Support",

    // Reviews
    reviewsTitle: "What our customers think about us",
    recommends: "Recommends",
    readReview: "Read review",
    followUsSocial: "Follow us on Facebook and Instagram for the latest reviews and updates",

    // Gallery
    ourJourney: "Our Journey",
    photoGallery: "PHOTO GALLERY",
    loadingGallery: "Loading gallery...",
    errorLoadingGallery: "Could not load gallery",
    loadMore: "Load More",
    deleteImageConfirm: "Are you sure you want to delete this image?",
    deleteImageError: "Could not delete image",
    galleryImage: "Image",
    galleryDefaultDesc: "Lotus Voyages",

    // Footer (Specific section)
    footerTagline: "Premium journeys - Green experiences",
    licenseInfo: "International Tour Operator License No. 48-361/2023 issued by Vietnam National Authority of Tourism in Hanoi on April 24, 2023",
    contactFooter: "Contact",
    addressFooter: "K285/43 Le Duan, Tan Chinh, Thanh Khe, Da Nang, Vietnam",
    workingHours: "Monday - Saturday: 9:00 AM - 5:30 PM",
    quickLinks: "Quick Links",
    home: "Home",
    toursLink: "Tours",
    aboutUsLink: "About Us",
    contactLink: "Contact",
    taxCode: "Tax Code: 0402162459",

    // Destinations
    destinationsSubtitle: "Explore destinations",
    destinationsTitle: "FEATURED DESTINATIONS",
    explore: "Explore",

    // CTA Banner
    ctaUniqueDestinationsTitle: "Unique Destinations",
    ctaUniqueDestinationsDesc: "Discover the most unique travel locations",
    ctaGreenTourismTitle: "Green Tourism",
    ctaGreenTourismDesc: "Committed to the environment and sustainable development",
    ctaProGuidesTitle: "Professional Guides",
    ctaProGuidesDesc: "Professional and friendly team of guides",
    ctaDedicatedServiceTitle: "Dedicated Service",
    ctaDedicatedServiceDesc: "Caring and dedicated customer support",
  },

  // French translations
  fr: {
    // Navbar
    about: "À Propos",
    tour: "Destinations",
    contact: "Contact",
    bookNow: "Réserver",
    admin: "Admin",
    logout: "Déconnexion",

    // Footer
    contactUs: "Contactez-nous",
    otherPlatforms: "Autres Plateformes",
    address: "K285/43 Le Duan, Quartier Tan Chinh, District Thanh Khe, Ville Da Nang, Vietnam",
    phone: "Téléphone",
    email: "Email",
    backToTop: "Haut de page",

    // Introduction
    letterTitle: "Lettre Ouverte",
    mainTitle: "POUR UNE PLANÈTE VERTE",
    greeting: "Cher Ami,",
    introTextPart1: "Avec le souhait de contribuer au beau pays à travers l'organisation de voyages de découverte significatifs, en choisissant un mode de vie vert et sain, nous avons commencé à mettre en œuvre le projet de fondation - ",
    introTextPart2: ".",
    introText: "Avec le souhait de contribuer au beau pays à travers l'organisation de voyages de découverte significatifs, en choisissant un mode de vie vert et sain, nous avons commencé à mettre en œuvre le projet de fondation - LOTUS VOYAGES.",
    happinessParagraph: "Nous sommes vraiment heureux que notre projet longtemps caressé soit devenu une réalité.",
    dreamParagraph: "Avec le rêve d'organiser des voyages de soins de santé et de développer les talents personnels, nous organiserons des circuits comprenant des ateliers de yoga, la pratique de la méditation, la cuisine végétalienne, la peinture...",
    learnMore: "En Savoir Plus",

    // WhyChooseUs (General)
    whyChooseUs: "POURQUOI NOUS CHOISIR",
    whyChooseUsSubtitle: "Raisons de nous choisir",
    whyChooseUsTitle: "POURQUOI CHOISIR LOTUS VOYAGES",
    personalizedService: "Service Personnalisé", // Keep this one
    personalizedDescription: "Nous proposons des programmes de voyage adaptés aux exigences des clients, garantissant que nous répondons à tous les besoins et désirs de nos clients.", // Keep this one
    expertGuides: "Guides Experts", // Keep this one
    expertGuidesDescription: "Notre équipe de guides connaît profondément la culture, l'histoire et les destinations, vous offrant des expériences riches et mémorables.", // Keep this one

    // Tours
    experiencePrograms: "PROGRAMMES D'EXPÉRIENCE",
    allDestinations: "Tous",
    bhutan: "Bhoutan",
    vietnam: "Vietnam",
    france: "France",
    loadingTours: "Chargement des circuits...",
    errorLoadingTours: "Impossible de charger les circuits. Veuillez réessayer plus tard.",
    noToursFound: "Aucun circuit ne correspond aux critères de recherche.",
    viewAllTours: "Voir Tous les Circuits",
    daysLeft: "Il reste {days} jours",
    viewDetails: "Voir les Détails",
    editTour: "Modifier le circuit",
    deleteTour: "Supprimer le circuit",
    confirmDeleteTour: "Êtes-vous sûr de vouloir supprimer ce circuit ?",
    deleteTourError: "Impossible de supprimer le circuit",

    // For TourDetail component
    loadingTourDetails: "Chargement des détails du circuit...",
    errorLoadingTourDetails: "Impossible de charger les détails du circuit.",
    tourNotFound: "Données du circuit introuvables.",
    tourIntroduction: "Introduction",
    tourItinerary: "Itinéraire Détaillé",
    noImagesAvailable: "Aucune image disponible.",
    noIntroductionAvailable: "Aucune introduction disponible.",
    noItineraryAvailable: "Aucun itinéraire détaillé disponible.",
    relatedTours: "Circuits Connexes",
    editTour: "Modifier le Circuit",

    // WhyChooseUs (Specific Items)
    whyChooseUsItem1Title: "Expérimentez de nombreux styles",
    whyChooseUsItem1Desc: "Lotus Voyages est extrêmement fier de servir tous les voyageurs, des particuliers aux groupes, entreprises, organisations avec des expériences dans des terres spéciales avec des expériences extrêmement intéressantes allant du zénith, de la culture, de l'alpinisme, de la découverte de la nature, de la vie locale nomade et des expériences à des fins de développement commercial.",
    whyChooseUsItem2Title: "Expérience de qualité",
    whyChooseUsItem2Desc: "Lotus Voyages est extrêmement méticuleux et prudent dans la sélection des expériences, de l'hébergement, des hôtels, des activités phares, de la restauration, du transport et surtout des amis locaux dans chaque voyage afin que toutes les régions redécouvrent des expériences mémorables et la meilleure qualité pour les clients.",
    whyChooseUsItem3Title: "Partenaire fiable, nombreuses années d'expérience",
    whyChooseUsItem3Desc: "Les membres de Lotus Voyages ont de nombreuses années d'expérience dans l'industrie du tourisme, une coopération stratégique directe avec des partenaires aériens tels que Bhutan Airlines, Druk Air, Hôtels : Six Senses, Aman, Bhutan Spirit Sanctuary, Naksel, St Regis, Shangrila, Hyatt, Ritz Carlton, Accors, Marriott... En même temps, l'équipe a de l'expérience dans l'ouverture de vols directs, l'affrètement de vols entiers vers le Bhoutan depuis le Vietnam depuis 2017 - la première unité.",
    whyChooseUsItem4Title: "Équipe professionnelle",
    whyChooseUsItem4Desc: "Notre équipe possède une grande expérience et expertise, toujours prête à soutenir et servir les clients de tout cœur et professionnellement.",
    whyChooseUsItem5Title: "Pas de circuit shopping",
    whyChooseUsItem5Desc: "Nous nous engageons à ne pas organiser de circuits axés sur le shopping, garantissant l'expérience de voyage la plus pure et la plus significative pour les clients.",
    whyChooseUsItem6Title: "Programmes conçus sur mesure",
    whyChooseUsItem6Desc: "Nous proposons des programmes de voyage adaptés aux exigences des clients, garantissant que nous répondons à tous les besoins et désirs de nos clients.",

    // TeamMember
    teamSubtitle: "Équipe Professionnelle",
    teamTitle: "ÉQUIPE LOTUS VOYAGES",
    viewMore: "Voir Plus",
    collapse: "Réduire",
    viewMoreAria: "Voir plus d'informations",
    collapseAria: "Réduire les informations",

    // TeamMember (Specific Members)
    teamMember1Name: "Lien Dang - PDG",
    teamMember1Position: "PDG",
    teamMember1Desc: "En tant que passionnée de voyages, amoureuse de la nature, exploratrice culturelle et historique avec plus de 15 ans d'expérience dans l'industrie du tourisme, chanceuse de visiter de nombreuses terres à travers le monde et d'être entendue et inspirée par des histoires sur les gens, la culture, l'histoire, la vie... Lien Dang s'efforce toujours de répandre le bonheur et la joie à tout le monde.",

    // Slider
    slide1Title: "EXPLOREZ LA NATURE",
    slide1Desc: "Voyage au cœur de la nature et de la culture indigène",
    slide2Title: "EXPÉRIMENTEZ L'IDENTITÉ",
    slide2Desc: "Destinations uniques et inoubliables",
    slide3Title: "TOURISME VERT",
    slide3Desc: "Engagé pour une planète verte et un tourisme durable",
    bookNowSlider: "Réserver",
    contactSupport: "Contacter le Support",

    // Reviews
    reviewsTitle: "Ce que nos clients pensent de nous",
    recommends: "Recommande",
    readReview: "Lire l'avis",
    followUsSocial: "Suivez-nous sur Facebook et Instagram pour les derniers avis et mises à jour",

    // Gallery
    ourJourney: "Notre Voyage",
    photoGallery: "GALERIE PHOTOS",
    loadingGallery: "Chargement de la galerie...",
    errorLoadingGallery: "Impossible de charger la galerie",
    loadMore: "Voir Plus",
    deleteImageConfirm: "Êtes-vous sûr de vouloir supprimer cette image ?",
    deleteImageError: "Impossible de supprimer l'image",
    galleryImage: "Image",
    galleryDefaultDesc: "Lotus Voyages",

    // Footer (Specific section)
    footerTagline: "Voyages haut de gamme - Expériences vertes",
    licenseInfo: "Licence d'Opérateur de Tourisme International n° 48-361/2023 délivrée par l'Autorité Nationale du Tourisme du Vietnam à Hanoï le 24 avril 2023",
    contactFooter: "Contact",
    addressFooter: "K285/43 Le Duan, Tan Chinh, Thanh Khe, Da Nang, Vietnam",
    workingHours: "Lundi - Samedi : 9h00 - 17h30",
    quickLinks: "Liens Rapides",
    home: "Accueil",
    toursLink: "Circuits",
    aboutUsLink: "À Propos",
    contactLink: "Contact",
    taxCode: "Code Fiscal : 0402162459",

    // Destinations
    destinationsSubtitle: "Explorer les destinations",
    destinationsTitle: "DESTINATIONS PHARES",
    explore: "Explorer",

    // CTA Banner
    ctaUniqueDestinationsTitle: "Destinations Uniques",
    ctaUniqueDestinationsDesc: "Découvrez les lieux de voyage les plus uniques",
    ctaGreenTourismTitle: "Tourisme Vert",
    ctaGreenTourismDesc: "Engagé pour l'environnement et le développement durable",
    ctaProGuidesTitle: "Guides Professionnels",
    ctaProGuidesDesc: "Équipe de guides professionnels et sympathiques",
    ctaDedicatedServiceTitle: "Service Dédié",
    ctaDedicatedServiceDesc: "Support client attentionné et dévoué",
  }
};

export default translations;