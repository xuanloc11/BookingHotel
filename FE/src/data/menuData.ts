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
    subMenu: [
      { label: "Trang chủ chính", link: "/" },
    ],
  },
  {
    label: "Phòng nghỉ",
    subMenu: [
      { label: "Tìm phòng", link: "/room" },
      { label: "Chi tiết phòng", link: "/room-details" },
      { label: "Chi tiết khách sạn", link: "/hotel/1" },
      { label: "Bộ sưu tập", link: "/gallery" },
    ],
  },
  {
    label: "Đặt phòng",
    subMenu: [
      { label: "Thanh toán", link: "/checkout" },
      { label: "Đặt phòng thành công", link: "/booking-success" },
      { label: "Đơn đặt của tôi", link: "/my-bookings" },
    ],
  },
  {
    label: "Tài khoản",
    subMenu: [
      { label: "Đăng nhập", link: "/login" },
      { label: "Đăng ký", link: "/register" },
      { label: "Quên mật khẩu", link: "/forgot-password" },
    ],
  },
  {
    label: "Liên hệ",
    link: "/contact",
  },
];
