export const dictionaries = {
  vi: {
    "header.currency": "Chọn tiền tệ",
    "header.language": "Chọn ngôn ngữ",
    "header.bookNow": "ĐẶT PHÒNG NGAY",
    "header.profile": "Hồ sơ cá nhân",
    "header.myBookings": "Đơn đặt của tôi",
    "header.logout": "Đăng xuất",
    "header.login": "Đăng nhập",
    "header.register": "Đăng ký",
    
    "menu.home": "Trang chủ",
    "menu.rooms": "Phòng nghỉ",
    "menu.roomList": "Danh sách phòng",
    "menu.gallery": "Thư viện ảnh",
    "menu.about": "Giới thiệu",
    "menu.generalInfo": "Giới thiệu chung",
    "menu.hotelDetails": "Chi tiết khách sạn",
    "menu.contact": "Liên hệ",
    "menu.account": "Tài khoản",

    "banner.subtitle": "Tìm kiếm ngôi nhà độc đáo ở những vùng đất sôi động.",
    "banner.title": "Khách Sạn Uy Tín, Đặt Phòng Dễ Dàng",
    "banner.bookNow": "Đặt phòng ngay",
    "banner.reviews": "Từ hơn 2,000+ đánh giá",
  },
  en: {
    "header.currency": "Select currency",
    "header.language": "Select language",
    "header.bookNow": "BOOK NOW",
    "header.profile": "My Profile",
    "header.myBookings": "My Bookings",
    "header.logout": "Logout",
    "header.login": "Login",
    "header.register": "Register",

    "menu.home": "Home",
    "menu.rooms": "Rooms",
    "menu.roomList": "Room List",
    "menu.gallery": "Gallery",
    "menu.about": "About Us",
    "menu.generalInfo": "General Info",
    "menu.hotelDetails": "Hotel Details",
    "menu.contact": "Contact",
    "menu.account": "Account",

    "banner.subtitle": "Find unique homes in vibrant places.",
    "banner.title": "Trusted Hotels, Seamless Booking",
    "banner.bookNow": "Booking today",
    "banner.reviews": "From 2,000+ reviews",
  }
};

export type Language = "vi" | "en";
export type DictionaryKey = keyof typeof dictionaries["vi"];
