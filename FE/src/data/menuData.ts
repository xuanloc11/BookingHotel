export interface SubMenuItem {
  label: string;
  link: string;
}

export interface MenuItem {
  label: string;
  link?: string;
  subMenu?: SubMenuItem[];
}

export const menuData: MenuItem[] = [
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
    subMenu: [
      { label: "Giới thiệu chung", link: "/about" },
      { label: "Chi tiết khách sạn", link: "/hotel/1" },
    ],
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
