export interface MegaHomeItem {
  title: string;
  link: string;
  image: string;
}

export interface SubMenuItem {
  label: string;
  link: string;
}

export interface DesktopMenuItem {
  label: string;
  type: "mega" | "submenu" | "link";
  link?: string;
  megaItems?: MegaHomeItem[];
  subMenu?: SubMenuItem[];
}

export const getDesktopMenuData = (lang: string = 'vi'): DesktopMenuItem[] => {
  if (lang === 'en') {
    return [
      {
        label: "Home",
        type: "link",
        link: "/",
      },
      {
        label: "Rooms",
        type: "submenu",
        subMenu: [
          { label: "Room List", link: "/room" },
          { label: "Gallery", link: "/gallery" },
        ],
      },
      {
        label: "About Us",
        type: "link",
        link: "/about",
      },
      {
        label: "Contact",
        type: "link",
        link: "/contact",
      },
      {
        label: "Account",
        type: "submenu",
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
      type: "link",
      link: "/",
    },
    {
      label: "Phòng nghỉ",
      type: "submenu",
      subMenu: [
        { label: "Danh sách phòng", link: "/room" },
        { label: "Thư viện ảnh", link: "/gallery" },
      ],
    },
    {
      label: "Giới thiệu",
      type: "link",
      link: "/about",
    },
    {
      label: "Liên hệ",
      type: "link",
      link: "/contact",
    },
    {
      label: "Tài khoản",
      type: "submenu",
      subMenu: [
        { label: "Đăng nhập", link: "/login" },
        { label: "Đăng ký", link: "/register" },
      ],
    },
  ];
};

export const desktopMenuData = getDesktopMenuData('vi');
