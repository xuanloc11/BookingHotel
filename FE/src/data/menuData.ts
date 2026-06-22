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
        link: "/room",
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
      link: "/room",
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
