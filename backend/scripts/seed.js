const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/Tour');
const TourDetail = require('../models/TourDetail');

// Load environment variables
dotenv.config();

// Connect to database

const tours = [
    {
      date: '20/12/2024 - 30/12/2024',
      destination: 'Bhutan',
      title: '2025 BAY THẲNG TPHCM/HANOI-BHUTAN LỊCH TRÌNH 1',
      image: '/bhutan.jpg',
      description: 'JOURNEY TO THE HIDDEN LAND - THUNDER DRAGON',
      link: 'bhutan1'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: 'Bhutan',
      title: 'Khám phá Bhutan - Vùng đất của những điều kỳ diệu',
      image: '/bhutan.jpg',
      description: 'Bhutan, vùng đất của những điều kỳ diệu, nơi mà thiên nhiên và văn hóa hòa quyện tạo nên một bức tranh tuyệt đẹp.',
      link: 'bhutan2'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: 'VIỆT NAM',
      title: 'Hành trình khám phá miền Trung Việt Nam',
      image: '/vietnam.jpg',
      description: 'Miền Trung Việt Nam, nơi có những bãi biển đẹp, những di sản văn hóa và lịch sử phong phú, là điểm đến lý tưởng cho những ai yêu thích khám phá.',
      link: 'vietnam1'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: 'VIỆT NAM',
      title: 'Khám phá Sapa - Vùng đất của những điều kỳ diệu',
      image: '/vietnam.jpg',
      description: 'Sapa, vùng đất của những điều kỳ diệu, nơi mà thiên nhiên và văn hóa hòa quyện tạo nên một bức tranh tuyệt đẹp.',
      link: 'vietnam2'
    },
    {
      date: '20/12/2024 - 30/12/2024',
      destination: 'PHÁP',
      title: 'Pháp - Kinh đô ánh sáng',
      image: '/phap.jpg',
      description: 'Pháp, kinh đô ánh sáng, nơi mà nghệ thuật, văn hóa và ẩm thực đỉnh cao hòa quyện tạo nên một trải nghiệm du lịch tuyệt vời.',
      link: 'phap1'
    },
    {
      date: '20-December to 30-December 2025',
      destination: 'PHÁP',
      title: 'Khám phá Paris - Vùng đất của nghệ thuật và lịch sử',
      image: '/phap.jpg',
      description: 'Paris, nơi mà nghệ thuật và lịch sử hòa quyện tạo nên một bức tranh tuyệt đẹp, là điểm đến lý tưởng cho những ai yêu thích khám phá.',
      link: 'phap2'
    }
  ];
  
  const tourDetails = [
    {
      tourId: 'bhutan1',
      title: 'TOUR HÀ NỘI – ĐÀ NẴNG – HỘI AN 4 NGÀY 3 ĐÊM',
      intro: 'Đà Nẵng, Hội An là hai điểm đến du lịch nổi tiếng tại Việt Nam hiện nay. Lịch trình Đà Nẵng Hội An 4 ngày 3 đêm hứa hẹn sẽ giúp bạn có được quãng thời gian du lịch, nghỉ dưỡng lý tưởng, tham quan nhiều cảnh đẹp và thưởng thức văn hóa ẩm thực phong phú của hai địa phương này.',
      days: [
        {
          title: 'NGÀY 1: TOUR SƠN TRÀ, NGŨ HÀNH SƠN, HỘI AN (ĂN TỐI)',
          content: [
            'Sáng: Đến sân bay/bến xe Đà Nẵng. Chào đón khách khám phá thành phố Đà Nẵng – nơi được mệnh danh là thành phố của những cây cầu: Cầu Rồng – Cầu Tình Yêu, cầu Sông Hàn, Cầu Thuận Phước, Cầu Trần Thị Lý…',
            'Xe đưa quý khách về nhận phòng và nghỉ ngơi tại khách sạn 5 sao biển, đẹp, có hồ bơi vô cực sang chảnh cùng các tiện ích: Phòng gym, Spa, Nhà hàng sang trọng.',
            '14h00: Xe và hướng dẫn viên đón đoàn khởi hành tham quan Chùa Linh Ứng – Bán Đảo Sơn Trà, một trong ba ngôi chùa cùng tên Linh Ứng ở Đà Nẵng.',
            '15h30: Đoàn tiếp tục đi chuyển đến điểm tham quan danh thắng Ngũ Hành Sơn. Đoàn dừng chân tham quan làng đá Mỹ Nghệ Non Nước – làng nghề nổi tiếng của người dân Đà Nẵng.',
            '17h30: Khởi hành quan quan Phố Cổ Hội An. 18h00: Ăn tối tại Hội An với các món đặc sản, du khách tự do tham quan tại đây. 20h30: Du khách tập trung tại điểm hẹn để về lại Đà Nẵng.'
          ]
        },
        {
          title: 'NGÀY 2: TOUR BÀ NÀ (ĂN SÁNG, TRƯA)',
          content: [
            '6h30: Quý khách dùng bữa sáng tại khách sạn. 7h30: Xe và HDV đón khách khởi hành đi tham quan khu du lịch Bà Nà Hills.',
            '9h00: Đến Bà Nà, bắt đầu hành trình lên núi bằng tuyến Cáp Treo đạt 2 kỷ lục Guinness Thế Giới. Đến nơi, Quý khách tham quan các điểm: Siêu phẩm Cầu Bàn Tay Vàng nổi tiếng nhất thế giới, Vườn hoa tình yêu Les Jardin DAmour, Hầm rượu DeBay hơn 100 năm tuổi.',
            'Trưa: Đoàn dùng bữa tại nhà hàng Buffet 70 món. Chiều: Tham quan khu Làng Pháp có kiến trúc vô vùng độc đáo được ví như Châu Âu giữa lòng Đà Nẵng.',
            '15h30: Quý khách lên cáp treo xuống núi, tạm biệt Bà Nà. Xe khởi hành về lại Đà Nẵng. Tối: Đoàn di chuyển tới nhà hàng Sangha-Vegeterian Restaurant để ăn tối sau đó tự do tham quan Đà Nẵng về đêm.'
          ]
        },
        {
          title: 'NGÀY 3: QUAY TRỞ LẠI ĐÀ NẴNG(ĂN SÁNG, TRƯA)',
          content: [
            '6h30: Quý khách dùng bữa sáng tại khách sạn. 7h30: Xe và HDV đón khách khởi hành đi tham quan khu du lịch Bà Nà Hills.',
            '9h00: Đến Bà Nà, bắt đầu hành trình lên núi bằng tuyến Cáp Treo đạt 2 kỷ lục Guinness Thế Giới. Đến nơi, Quý khách tham quan các điểm: Siêu phẩm Cầu Bàn Tay Vàng nổi tiếng nhất thế giới, Vườn hoa tình yêu Les Jardin DAmour, Hầm rượu DeBay hơn 100 năm tuổi.',
            'Trưa: Đoàn dùng bữa tại nhà hàng Buffet 70 món. Chiều: Tham quan khu Làng Pháp có kiến trúc vô vùng độc đáo được ví như Châu Âu giữa lòng Đà Nẵng.',
            '15h30: Quý khách lên cáp treo xuống núi, tạm biệt Bà Nà. Xe khởi hành về lại Đà Nẵng. Tối: Đoàn di chuyển tới nhà hàng Sangha-Vegeterian Restaurant để ăn tối sau đó tự do tham quan Đà Nẵng về đêm.'
          ]
        }
      ],
      images: [
        {
          image: '/tours/bhutan1/bhutan1-1.png',
          alt: 'bhutan1-1'
        },
        {
          image: '/tours/bhutan1/bhutan1-2.png',
          alt: 'bhutan1-2'
        },
        {
          image: '/tours/bhutan1/bhutan1-3.png',
          alt: 'bhutan1-3'
        }
      ]
    },
    {
      tourId: 'bhutan2',
      title: 'TOUR SÀI GÒN – PHÚ QUỐC 3 NGÀY 2 ĐÊM',
      intro: 'Phú Quốc, hòn đảo ngọc của Việt Nam, là điểm đến lý tưởng cho những ai yêu thích biển xanh, cát trắng và nắng vàng. Lịch trình 3 ngày 2 đêm sẽ mang đến cho bạn những trải nghiệm tuyệt vời.',
      days: [
        {
          title: 'NGÀY 1: KHÁM PHÁ ĐÔNG ĐẢO (ĂN TRƯA, TỐI)',
          content: [
            'Sáng: Đón khách tại sân bay Phú Quốc. Tham quan làng chài Hàm Ninh, nơi nổi tiếng với hải sản tươi ngon.',
            'Trưa: Dùng bữa tại nhà hàng địa phương.',
            'Chiều: Tham quan suối Tranh, cơ sở sản xuất nước mắm và vườn tiêu Phú Quốc.',
            'Tối: Dùng bữa tại nhà hàng và tự do khám phá chợ đêm Phú Quốc.'
          ]
        },
        {
          title: 'NGÀY 2: KHÁM PHÁ NAM ĐẢO (ĂN SÁNG, TRƯA, TỐI)',
          content: [
            'Sáng: Tham quan nhà tù Phú Quốc, bãi Sao và cơ sở sản xuất ngọc trai.',
            'Trưa: Dùng bữa tại nhà hàng địa phương.',
            'Chiều: Tham gia các hoạt động lặn ngắm san hô tại quần đảo An Thới.',
            'Tối: Dùng bữa tại nhà hàng và tự do khám phá Phú Quốc về đêm.'
          ]
        },
        {
          title: 'NGÀY 3: TẠM BIỆT PHÚ QUỐC (ĂN SÁNG)',
          content: [
            'Sáng: Dùng bữa sáng tại khách sạn. Tự do tắm biển hoặc mua sắm đặc sản Phú Quốc.',
            'Trưa: Xe đưa khách ra sân bay. Kết thúc chương trình tham quan.'
          ]
        }
      ],
      images: [
        {
          image: '/tours/bhutan1/bhutan1-1.png',
          alt: 'bhutan1-1'
        },
        {
          image: '/tours/bhutan1/bhutan1-2.png',
          alt: 'bhutan1-2'
        },
        {
          image: '/tours/bhutan1/bhutan1-3.png',
          alt: 'bhutan1-3'
        }
      ]
    }
  ];
  
  const seedDatabase = async () => {
    try {
      // Connect to MongoDB and wait for the connection to establish
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      console.log('MongoDB connected successfully');
      
      // Now import the data
      await importData();
      
    } catch (error) {
      console.error(`Database connection error: ${error.message}`);
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
      await Tour.insertMany(tours);
      await TourDetail.insertMany(tourDetails);
  
      console.log('Data imported successfully!');
      process.exit(0);
    } catch (error) {
      console.error(`Data import error: ${error.message}`);
      process.exit(1);
    }
  };
  
  // Run the database seeding
  seedDatabase();