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

export const desktopMenuData: DesktopMenuItem[] = [
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
    type: "submenu",
    subMenu: [
      { label: "Giới thiệu chung", link: "/about" },
      { label: "Chi tiết khách sạn", link: "/hotel/1" },
    ],
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
