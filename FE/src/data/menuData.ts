export interface SubMenuItem {
  label: string;
  link: string;
}

export interface MenuItem {
  label: string;
  link?: string;
  subMenu?: SubMenuItem[];
}

export const getMenuData = (lang: string = 'vi'): MenuItem[] => {
  if (lang === 'en') {
    return [
      {
        label: "Home",
        link: "/",
      },
      {
        label: "Rooms",
        subMenu: [
          { label: "Room List", link: "/room" },
          { label: "Gallery", link: "/gallery" },
        ],
      },
      {
        label: "About Us",
        link: "/about",
      },
      {
        label: "Contact",
        link: "/contact",
      },
      {
        label: "Account",
        subMenu: [
          { label: "Login", link: "/login" },
          { label: "Register", link: "/register" },
        ],
      },
    ];
  }

  // Default to VI
  return [
    {
      label: "Trang chủ",
      link: "/",
    },
    {
      label: "Phòng nghỉ",
      subMenu: [
        { label: "Danh sách phòng", link: "/room" },
        { label: "Thư viện ảnh", link: "/gallery" },
      ],
    },
    {
      label: "Giới thiệu",
      link: "/about",
    },
    {
      label: "Liên hệ",
      link: "/contact",
    },
    {
      label: "Tài khoản",
      subMenu: [
        { label: "Đăng nhập", link: "/login" },
        { label: "Đăng ký", link: "/register" },
      ],
    },
  ];
};

export const menuData = getMenuData('vi');
