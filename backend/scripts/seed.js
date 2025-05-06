const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Import the 'path' module
const Tour = require('../models/Tour');
const TourDetail = require('../models/TourDetail');

// Load environment variables explicitly from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Adjust path if .env is elsewhere

// --- Updated Seed Data with Language Structure ---

const tours = [
    {
      date: '20/12/2024 - 30/12/2024',
      destination: { // Changed
        vi: 'Bhutan',
        en: 'Bhutan',
        fr: 'Bhoutan'
      },
      title: { // Changed
        vi: '2025 BAY THẲNG TPHCM/HANOI-BHUTAN LỊCH TRÌNH 1',
        en: '2025 DIRECT FLIGHT HCMC/HANOI-BHUTAN ITINERARY 1',
        fr: '2025 VOL DIRECT HCMC/HANOI-BHOUTAN ITINÉRAIRE 1'
      },
      image: '/bhutan.jpg',
      description: { // Changed
        vi: 'JOURNEY TO THE HIDDEN LAND - THUNDER DRAGON',
        en: 'JOURNEY TO THE HIDDEN LAND - THUNDER DRAGON',
        fr: 'VOYAGE VERS LA TERRE CACHÉE - DRAGON TONNERRE'
      },
      link: 'bhutan1' // Keep link as is
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: { // Changed
        vi: 'Bhutan',
        en: 'Bhutan',
        fr: 'Bhoutan'
      },
      title: { // Changed
        vi: 'Khám phá Bhutan - Vùng đất của những điều kỳ diệu',
        en: 'Discover Bhutan - Land of Wonders',
        fr: 'Découvrez le Bhoutan - Terre des Merveilles'
      },
      image: '/bhutan.jpg',
      description: { // Changed
        vi: 'Bhutan, vùng đất của những điều kỳ diệu, nơi mà thiên nhiên và văn hóa hòa quyện tạo nên một bức tranh tuyệt đẹp.',
        en: 'Bhutan, the land of wonders, where nature and culture blend to create a beautiful picture.',
        fr: 'Le Bhoutan, terre des merveilles, où nature et culture se mêlent pour créer une image magnifique.'
      },
      link: 'bhutan2'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: { // Changed
        vi: 'VIỆT NAM',
        en: 'VIETNAM',
        fr: 'VIETNAM'
      },
      title: { // Changed
        vi: 'Hành trình khám phá miền Trung Việt Nam',
        en: 'Journey to Discover Central Vietnam',
        fr: 'Voyage à la Découverte du Centre du Vietnam'
      },
      image: '/vietnam.jpg',
      description: { // Changed
        vi: 'Miền Trung Việt Nam, nơi có những bãi biển đẹp, những di sản văn hóa và lịch sử phong phú, là điểm đến lý tưởng cho những ai yêu thích khám phá.',
        en: 'Central Vietnam, with its beautiful beaches, rich cultural and historical heritage, is an ideal destination for explorers.',
        fr: 'Le Centre du Vietnam, avec ses belles plages, son riche patrimoine culturel et historique, est une destination idéale pour les explorateurs.'
      },
      link: 'vietnam1'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: { // Changed
        vi: 'VIỆT NAM',
        en: 'VIETNAM',
        fr: 'VIETNAM'
      },
      title: { // Changed
        vi: 'Khám phá Sapa - Vùng đất của những điều kỳ diệu',
        en: 'Discover Sapa - Land of Wonders',
        fr: 'Découvrez Sapa - Terre des Merveilles'
      },
      image: '/vietnam.jpg',
      description: { // Changed
        vi: 'Sapa, vùng đất của những điều kỳ diệu, nơi mà thiên nhiên và văn hóa hòa quyện tạo nên một bức tranh tuyệt đẹp.',
        en: 'Sapa, the land of wonders, where nature and culture blend to create a beautiful picture.',
        fr: 'Sapa, terre des merveilles, où nature et culture se mêlent pour créer une image magnifique.'
      },
      link: 'vietnam2'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: { // Changed
        vi: 'PHÁP',
        en: 'FRANCE',
        fr: 'FRANCE'
      },
      title: { // Changed
        vi: 'Pháp - Kinh đô ánh sáng',
        en: 'France - Capital of Light',
        fr: 'France - Capitale de la Lumière'
      },
      image: '/phap.jpg',
      description: { // Changed
        vi: 'Pháp, kinh đô ánh sáng, nơi mà nghệ thuật, văn hóa và ẩm thực đỉnh cao hòa quyện tạo nên một trải nghiệm du lịch tuyệt vời.',
        en: 'France, the capital of light, where art, culture, and high cuisine blend to create a wonderful travel experience.',
        fr: 'La France, capitale de la lumière, où l\'art, la culture et la haute cuisine se mêlent pour créer une merveilleuse expérience de voyage.'
      },
      link: 'phap1'
    },
    {
      date: '20-December to 30-December 2025', // Keep date format consistent if possible
      destination: { // Changed
        vi: 'PHÁP',
        en: 'FRANCE',
        fr: 'FRANCE'
      },
      title: { // Changed
        vi: 'Khám phá Paris - Vùng đất của nghệ thuật và lịch sử',
        en: 'Discover Paris - Land of Art and History',
        fr: 'Découvrez Paris - Terre d\'Art et d\'Histoire'
      },
      image: '/phap.jpg',
      description: { // Changed
        vi: 'Paris, nơi mà nghệ thuật và lịch sử hòa quyện tạo nên một bức tranh tuyệt đẹp, là điểm đến lý tưởng cho những ai yêu thích khám phá.',
        en: 'Paris, where art and history blend to create a beautiful picture, is an ideal destination for explorers.',
        fr: 'Paris, où l\'art et l\'histoire se mêlent pour créer une image magnifique, est une destination idéale pour les explorateurs.'
      },
      link: 'phap2'
    }
  ];

  const tourDetails = [
    {
      tourId: 'bhutan1', // Matches tour.link
      title: { // Changed
        vi: 'TOUR HÀ NỘI – ĐÀ NẴNG – HỘI AN 4 NGÀY 3 ĐÊM',
        en: 'HANOI – DA NANG – HOI AN TOUR 4 DAYS 3 NIGHTS',
        fr: 'TOUR HANOI – DA NANG – HOI AN 4 JOURS 3 NUITS'
      },
      intro: { // Changed
        vi: 'Đà Nẵng, Hội An là hai điểm đến du lịch nổi tiếng tại Việt Nam hiện nay. Lịch trình Đà Nẵng Hội An 4 ngày 3 đêm hứa hẹn sẽ giúp bạn có được quãng thời gian du lịch, nghỉ dưỡng lý tưởng, tham quan nhiều cảnh đẹp và thưởng thức văn hóa ẩm thực phong phú của hai địa phương này.',
        en: 'Da Nang and Hoi An are two famous tourist destinations in Vietnam today. The 4-day 3-night Da Nang Hoi An itinerary promises to give you an ideal travel and relaxation time, visiting many beautiful landscapes and enjoying the rich culinary culture of these two localities.',
        fr: 'Da Nang et Hoi An sont aujourd\'hui deux destinations touristiques célèbres au Vietnam. L\'itinéraire Da Nang Hoi An de 4 jours et 3 nuits promet de vous offrir un temps de voyage et de détente idéal, de visiter de nombreux paysages magnifiques et de profiter de la riche culture culinaire de ces deux localités.'
      },
      days: [
        {
          title: { // Changed
            vi: 'NGÀY 1: TOUR SƠN TRÀ, NGŨ HÀNH SƠN, HỘI AN (ĂN TỐI)',
            en: 'DAY 1: SON TRA, MARBLE MOUNTAINS, HOI AN TOUR (DINNER)',
            fr: 'JOUR 1 : TOUR SON TRA, MONTAGNES DE MARBRE, HOI AN (DÎNER)'
          },
          content: [ // Changed to array of objects
            {
              vi: 'Sáng: Đến sân bay/bến xe Đà Nẵng. Chào đón khách khám phá thành phố Đà Nẵng – nơi được mệnh danh là thành phố của những cây cầu: Cầu Rồng – Cầu Tình Yêu, cầu Sông Hàn, Cầu Thuận Phước, Cầu Trần Thị Lý…',
              en: 'Morning: Arrive at Da Nang airport/bus station. Welcome guests to explore Da Nang city – known as the city of bridges: Dragon Bridge – Love Bridge, Han River Bridge, Thuan Phuoc Bridge, Tran Thi Ly Bridge…',
              fr: 'Matin : Arrivée à l\'aéroport/gare routière de Da Nang. Accueil des invités pour explorer la ville de Da Nang – connue comme la ville des ponts : Pont du Dragon – Pont de l\'Amour, Pont de la Rivière Han, Pont Thuan Phuoc, Pont Tran Thi Ly…'
            },
            {
              vi: 'Xe đưa quý khách về nhận phòng và nghỉ ngơi tại khách sạn 5 sao biển, đẹp, có hồ bơi vô cực sang chảnh cùng các tiện ích: Phòng gym, Spa, Nhà hàng sang trọng.',
              en: 'The car takes you to check in and rest at a beautiful 5-star beach hotel with a luxurious infinity pool and amenities: Gym, Spa, Luxury restaurant.',
              fr: 'La voiture vous emmène vous enregistrer et vous reposer dans un bel hôtel 5 étoiles en bord de mer avec une luxueuse piscine à débordement et des équipements : Salle de sport, Spa, Restaurant de luxe.'
            },
            {
              vi: '14h00: Xe và hướng dẫn viên đón đoàn khởi hành tham quan Chùa Linh Ứng – Bán Đảo Sơn Trà, một trong ba ngôi chùa cùng tên Linh Ứng ở Đà Nẵng.',
              en: '14:00: Car and tour guide pick up the group to visit Linh Ung Pagoda – Son Tra Peninsula, one of the three pagodas with the same name Linh Ung in Da Nang.',
              fr: '14h00 : Voiture et guide touristique viennent chercher le groupe pour visiter la pagode Linh Ung – Péninsule de Son Tra, l\'une des trois pagodes du même nom Linh Ung à Da Nang.'
            },
            {
              vi: '15h30: Đoàn tiếp tục đi chuyển đến điểm tham quan danh thắng Ngũ Hành Sơn. Đoàn dừng chân tham quan làng đá Mỹ Nghệ Non Nước – làng nghề nổi tiếng của người dân Đà Nẵng.',
              en: '15:30: The group continues to move to the Marble Mountains scenic spot. The group stops to visit Non Nuoc Fine Arts Stone Village – a famous traditional craft village of Da Nang people.',
              fr: '15h30 : Le groupe continue de se déplacer vers le site pittoresque des Montagnes de Marbre. Le groupe s\'arrête pour visiter le village de pierre des Beaux-Arts de Non Nuoc – un célèbre village artisanal traditionnel des habitants de Da Nang.'
            },
            {
              vi: '17h30: Khởi hành quan quan Phố Cổ Hội An. 18h00: Ăn tối tại Hội An với các món đặc sản, du khách tự do tham quan tại đây. 20h30: Du khách tập trung tại điểm hẹn để về lại Đà Nẵng.',
              en: '17:30: Depart to visit Hoi An Ancient Town. 18:00: Dinner in Hoi An with specialties, tourists are free to visit here. 20:30: Tourists gather at the meeting point to return to Da Nang.',
              fr: '17h30 : Départ pour visiter la vieille ville de Hoi An. 18h00 : Dîner à Hoi An avec des spécialités, les touristes sont libres de visiter ici. 20h30 : Les touristes se rassemblent au point de rendez-vous pour retourner à Da Nang.'
            }
          ]
        },
        {
          title: { // Changed
            vi: 'NGÀY 2: TOUR BÀ NÀ (ĂN SÁNG, TRƯA)',
            en: 'DAY 2: BA NA TOUR (BREAKFAST, LUNCH)',
            fr: 'JOUR 2 : TOUR BA NA (PETIT-DÉJEUNER, DÉJEUNER)'
          },
          content: [ // Changed to array of objects
            {
              vi: '6h30: Quý khách dùng bữa sáng tại khách sạn. 7h30: Xe và HDV đón khách khởi hành đi tham quan khu du lịch Bà Nà Hills.',
              en: '6:30: Have breakfast at the hotel. 7:30: Car and tour guide pick up guests to visit Ba Na Hills tourist area.',
              fr: '6h30 : Petit-déjeuner à l\'hôtel. 7h30 : Voiture et guide touristique viennent chercher les invités pour visiter la zone touristique de Ba Na Hills.'
            },
            {
              vi: '9h00: Đến Bà Nà, bắt đầu hành trình lên núi bằng tuyến Cáp Treo đạt 2 kỷ lục Guinness Thế Giới. Đến nơi, Quý khách tham quan các điểm: Siêu phẩm Cầu Bàn Tay Vàng nổi tiếng nhất thế giới, Vườn hoa tình yêu Les Jardin DAmour, Hầm rượu DeBay hơn 100 năm tuổi.',
              en: '9:00: Arrive at Ba Na, start the journey up the mountain by the Cable Car line that holds 2 Guinness World Records. Upon arrival, visit the points: The world-famous Golden Bridge masterpiece, Les Jardin DAmour love flower garden, DeBay Wine Cellar over 100 years old.',
              fr: '9h00 : Arrivée à Ba Na, début du voyage vers le sommet de la montagne par la ligne de téléphérique détenant 2 records du monde Guinness. À l\'arrivée, visitez les points : Le chef-d\'œuvre mondialement célèbre du Pont Doré, le jardin de fleurs d\'amour Les Jardin D\'Amour, la cave à vin DeBay vieille de plus de 100 ans.'
            },
            {
              vi: 'Trưa: Đoàn dùng bữa tại nhà hàng Buffet 70 món. Chiều: Tham quan khu Làng Pháp có kiến trúc vô vùng độc đáo được ví như Châu Âu giữa lòng Đà Nẵng.',
              en: 'Noon: The group has lunch at the 70-dish Buffet restaurant. Afternoon: Visit the French Village area with its unique architecture, likened to Europe in the heart of Da Nang.',
              fr: 'Midi : Le groupe déjeune au restaurant Buffet de 70 plats. Après-midi : Visite du quartier du Village Français à l\'architecture unique, comparé à l\'Europe au cœur de Da Nang.'
            },
            {
              vi: '15h30: Quý khách lên cáp treo xuống núi, tạm biệt Bà Nà. Xe khởi hành về lại Đà Nẵng. Tối: Đoàn di chuyển tới nhà hàng Sangha-Vegeterian Restaurant để ăn tối sau đó tự do tham quan Đà Nẵng về đêm.',
              en: '15:30: Take the cable car down the mountain, farewell to Ba Na. The car departs back to Da Nang. Evening: The group moves to Sangha-Vegetarian Restaurant for dinner, then free to explore Da Nang at night.',
              fr: '15h30 : Prenez le téléphérique pour descendre la montagne, adieu à Ba Na. La voiture repart vers Da Nang. Soir : Le groupe se rend au restaurant végétarien Sangha pour le dîner, puis temps libre pour explorer Da Nang la nuit.'
            }
          ]
        },
        {
          title: { // Changed
            vi: 'NGÀY 3: QUAY TRỞ LẠI ĐÀ NẴNG(ĂN SÁNG, TRƯA)',
            en: 'DAY 3: RETURN TO DA NANG (BREAKFAST, LUNCH)',
            fr: 'JOUR 3 : RETOUR À DA NANG (PETIT-DÉJEUNER, DÉJEUNER)'
          },
          content: [ // Changed to array of objects - Assuming content is similar to Day 2 for this example
             {
              vi: '6h30: Quý khách dùng bữa sáng tại khách sạn. Tự do nghỉ ngơi hoặc tắm biển.',
              en: '6:30: Have breakfast at the hotel. Free time to relax or swim.',
              fr: '6h30 : Petit-déjeuner à l\'hôtel. Temps libre pour se détendre ou nager.'
            },
            {
              vi: 'Trưa: Làm thủ tục trả phòng khách sạn. Xe đưa đoàn ra sân bay/bến xe Đà Nẵng.',
              en: 'Noon: Check out of the hotel. Car takes the group to Da Nang airport/bus station.',
              fr: 'Midi : Départ de l\'hôtel. La voiture emmène le groupe à l\'aéroport/gare routière de Da Nang.'
            },
            {
              vi: 'Kết thúc chương trình tour Đà Nẵng Hội An 4 ngày 3 đêm. Hẹn gặp lại quý khách!',
              en: 'End of the 4-day 3-night Da Nang Hoi An tour program. See you again!',
              fr: 'Fin du programme du tour Da Nang Hoi An de 4 jours et 3 nuits. À bientôt !'
            }
          ]
        }
      ],
      images: [
        {
          image: '/tours/bhutan1/bhutan1-1.png',
          alt: { // Changed
            vi: 'Hình ảnh Bhutan 1',
            en: 'Bhutan Image 1',
            fr: 'Image Bhoutan 1'
          }
        },
        {
          image: '/tours/bhutan1/bhutan1-2.png',
          alt: { // Changed
            vi: 'Hình ảnh Bhutan 2',
            en: 'Bhutan Image 2',
            fr: 'Image Bhoutan 2'
          }
        },
        {
          image: '/tours/bhutan1/bhutan1-3.png',
          alt: { // Changed
            vi: 'Hình ảnh Bhutan 3',
            en: 'Bhutan Image 3',
            fr: 'Image Bhoutan 3'
          }
        }
      ]
    },
    {
      tourId: 'bhutan2', // Matches tour.link
      title: { // Changed
        vi: 'TOUR SÀI GÒN – PHÚ QUỐC 3 NGÀY 2 ĐÊM',
        en: 'SAIGON – PHU QUOC TOUR 3 DAYS 2 NIGHTS',
        fr: 'TOUR SAIGON – PHU QUOC 3 JOURS 2 NUITS'
      },
      intro: { // Changed
        vi: 'Phú Quốc, hòn đảo ngọc của Việt Nam, là điểm đến lý tưởng cho những ai yêu thích biển xanh, cát trắng và nắng vàng. Lịch trình 3 ngày 2 đêm sẽ mang đến cho bạn những trải nghiệm tuyệt vời.',
        en: 'Phu Quoc, the pearl island of Vietnam, is an ideal destination for those who love blue sea, white sand, and golden sun. The 3-day 2-night itinerary will bring you wonderful experiences.',
        fr: 'Phu Quoc, l\'île perlière du Vietnam, est une destination idéale pour ceux qui aiment la mer bleue, le sable blanc et le soleil doré. L\'itinéraire de 3 jours et 2 nuits vous apportera des expériences merveilleuses.'
      },
      days: [
        {
          title: { // Changed
            vi: 'NGÀY 1: KHÁM PHÁ ĐÔNG ĐẢO (ĂN TRƯA, TỐI)',
            en: 'DAY 1: DISCOVER EAST ISLAND (LUNCH, DINNER)',
            fr: 'JOUR 1 : DÉCOUVERTE DE L\'ÎLE EST (DÉJEUNER, DÎNER)'
          },
          content: [ // Changed to array of objects
            {
              vi: 'Sáng: Đón khách tại sân bay Phú Quốc. Tham quan làng chài Hàm Ninh, nơi nổi tiếng với hải sản tươi ngon.',
              en: 'Morning: Pick up guests at Phu Quoc airport. Visit Ham Ninh fishing village, famous for fresh seafood.',
              fr: 'Matin : Accueil des invités à l\'aéroport de Phu Quoc. Visite du village de pêcheurs de Ham Ninh, célèbre pour ses fruits de mer frais.'
            },
            {
              vi: 'Trưa: Dùng bữa tại nhà hàng địa phương.',
              en: 'Noon: Have lunch at a local restaurant.',
              fr: 'Midi : Déjeuner dans un restaurant local.'
            },
            {
              vi: 'Chiều: Tham quan suối Tranh, cơ sở sản xuất nước mắm và vườn tiêu Phú Quốc.',
              en: 'Afternoon: Visit Tranh stream, fish sauce production facility, and Phu Quoc pepper garden.',
              fr: 'Après-midi : Visite du ruisseau Tranh, de l\'usine de production de sauce de poisson et du jardin de poivriers de Phu Quoc.'
            },
            {
              vi: 'Tối: Dùng bữa tại nhà hàng và tự do khám phá chợ đêm Phú Quốc.',
              en: 'Evening: Have dinner at a restaurant and freely explore Phu Quoc night market.',
              fr: 'Soir : Dîner dans un restaurant et exploration libre du marché nocturne de Phu Quoc.'
            }
          ]
        },
        {
          title: { // Changed
            vi: 'NGÀY 2: KHÁM PHÁ NAM ĐẢO (ĂN SÁNG, TRƯA, TỐI)',
            en: 'DAY 2: DISCOVER SOUTH ISLAND (BREAKFAST, LUNCH, DINNER)',
            fr: 'JOUR 2 : DÉCOUVERTE DE L\'ÎLE SUD (PETIT-DÉJEUNER, DÉJEUNER, DÎNER)'
          },
          content: [ // Changed to array of objects
            {
              vi: 'Sáng: Tham quan nhà tù Phú Quốc, bãi Sao và cơ sở sản xuất ngọc trai.',
              en: 'Morning: Visit Phu Quoc prison, Sao beach, and pearl production facility.',
              fr: 'Matin : Visite de la prison de Phu Quoc, de la plage de Sao et de l\'usine de production de perles.'
            },
            {
              vi: 'Trưa: Dùng bữa tại nhà hàng địa phương.',
              en: 'Noon: Have lunch at a local restaurant.',
              fr: 'Midi : Déjeuner dans un restaurant local.'
            },
            {
              vi: 'Chiều: Tham gia các hoạt động lặn ngắm san hô tại quần đảo An Thới.',
              en: 'Afternoon: Participate in snorkeling activities to see coral reefs in the An Thoi archipelago.',
              fr: 'Après-midi : Participation à des activités de plongée avec tuba pour voir les récifs coralliens dans l\'archipel d\'An Thoi.'
            },
            {
              vi: 'Tối: Dùng bữa tại nhà hàng và tự do khám phá Phú Quốc về đêm.',
              en: 'Evening: Have dinner at a restaurant and freely explore Phu Quoc at night.',
              fr: 'Soir : Dîner dans un restaurant et exploration libre de Phu Quoc la nuit.'
            }
          ]
        },
        {
          title: { // Changed
            vi: 'NGÀY 3: TẠM BIỆT PHÚ QUỐC (ĂN SÁNG)',
            en: 'DAY 3: FAREWELL TO PHU QUOC (BREAKFAST)',
            fr: 'JOUR 3 : ADIEU À PHU QUOC (PETIT-DÉJEUNER)'
          },
          content: [ // Changed to array of objects
            {
              vi: 'Sáng: Dùng bữa sáng tại khách sạn. Tự do tắm biển hoặc mua sắm đặc sản Phú Quốc.',
              en: 'Morning: Have breakfast at the hotel. Free time for swimming or shopping for Phu Quoc specialties.',
              fr: 'Matin : Petit-déjeuner à l\'hôtel. Temps libre pour nager ou acheter des spécialités de Phu Quoc.'
            },
            {
              vi: 'Trưa: Xe đưa khách ra sân bay. Kết thúc chương trình tham quan.',
              en: 'Noon: Car takes guests to the airport. End of the tour program.',
              fr: 'Midi : La voiture emmène les invités à l\'aéroport. Fin du programme de la visite.'
            }
          ]
        }
      ],
      images: [ // Assuming same images for example, update alts
        {
          image: '/tours/bhutan1/bhutan1-1.png', // Use relevant images for Phu Quoc
          alt: { // Changed
            vi: 'Hình ảnh Phú Quốc 1',
            en: 'Phu Quoc Image 1',
            fr: 'Image Phu Quoc 1'
          }
        },
        {
          image: '/tours/bhutan1/bhutan1-2.png', // Use relevant images for Phu Quoc
          alt: { // Changed
            vi: 'Hình ảnh Phú Quốc 2',
            en: 'Phu Quoc Image 2',
            fr: 'Image Phu Quoc 2'
          }
        },
        {
          image: '/tours/bhutan1/bhutan1-3.png', // Use relevant images for Phu Quoc
          alt: { // Changed
            vi: 'Hình ảnh Phú Quốc 3',
            en: 'Phu Quoc Image 3',
            fr: 'Image Phu Quoc 3'
          }
        }
      ]
    }
    // Add more tourDetails objects for vietnam1, vietnam2, phap1, phap2 following the same structure
  ];

  // --- Database Connection and Import Logic ---

  const seedDatabase = async () => {
    try {
      // Check if MONGO_URI is loaded
      if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined. Make sure your .env file is correct and in the backend directory.');
        process.exit(1);
      }

      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options

      console.log('MongoDB connected successfully');

      // Now import the data
      await importData();

    } catch (error) {
      console.error(`Database connection error: ${error.message}`);
      // Log the URI being used (or lack thereof) for debugging
      console.error(`Attempted URI: ${process.env.MONGO_URI}`);
      process.exit(1);
    }
  };

  // Import function
  const importData = async () => {
    try {
      // Clear all data
      console.log('Clearing existing data...');
      await Tour.deleteMany({});
      await TourDetail.deleteMany({});

      // Import data
      console.log('Importing new data...');
      await Tour.create(tours);
      await TourDetail.create(tourDetails);

      console.log('Data imported successfully!');
      // Close the connection after seeding
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (error) {
      console.error(`Data import error: ${error.message}`);
      // Close the connection in case of error too
      await mongoose.connection.close();
      process.exit(1);
    }
  };

  // Run the database seeding
  seedDatabase();