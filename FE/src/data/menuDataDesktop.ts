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
        type: "link",
        link: "/room",
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
      type: "link",
      link: "/room",
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
