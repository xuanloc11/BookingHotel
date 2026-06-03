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
    label: "Home",
    subMenu: [
      { label: "Main Home", link: "/" },
    ],
  },
  {
    label: "Rooms",
    subMenu: [
      { label: "Search Rooms", link: "/room" },
      { label: "Room Details", link: "/room-details" },
      { label: "Hotel Details", link: "/hotel/1" },
      { label: "Gallery", link: "/gallery" },
    ],
  },
  {
    label: "Reservations",
    subMenu: [
      { label: "Checkout", link: "/checkout" },
      { label: "Booking Success", link: "/booking-success" },
      { label: "My Bookings", link: "/my-bookings" },
    ],
  },
  {
    label: "Account",
    subMenu: [
      { label: "Login", link: "/login" },
      { label: "Register", link: "/register" },
      { label: "Forgot Password", link: "/forgot-password" },
    ],
  },
  {
    label: "Contact",
    link: "/contact",
  },
];
