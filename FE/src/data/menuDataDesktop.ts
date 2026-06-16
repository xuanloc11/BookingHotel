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
    type: "mega",
    megaItems: [
      {
        title: "Trang chủ chính",
        link: "/",
        image: "/assets/images/thumbs/home-img1.png",
      },
    ],
  },
  {
    label: "Phòng nghỉ",
    type: "submenu",
    subMenu: [
      { label: "Tìm phòng", link: "/room" },
      { label: "Chi tiết phòng", link: "/room-details" },
      { label: "Chi tiết khách sạn", link: "/hotel/1" },
      { label: "Bộ sưu tập", link: "/gallery" },
    ],
  },
  {
    label: "Đặt phòng",
    type: "submenu",
    subMenu: [
      { label: "Thanh toán", link: "/checkout" },
      { label: "Đặt phòng thành công", link: "/booking-success" },
      { label: "Đơn đặt của tôi", link: "/my-bookings" },
    ],
  },
  {
    label: "Tài khoản",
    type: "submenu",
    subMenu: [
      { label: "Đăng nhập", link: "/login" },
      { label: "Đăng ký", link: "/register" },
      { label: "Quên mật khẩu", link: "/forgot-password" },
    ],
  },
  {
    label: "Liên hệ",
    type: "link",
    link: "/contact",
  },
];
