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
    label: "Home",
    type: "mega",
    megaItems: [
      {
        title: "Main Home",
        link: "/",
        image: "/assets/images/thumbs/home-img1.png",
      },
    ],
  },
  {
    label: "Rooms",
    type: "submenu",
    subMenu: [
      { label: "Search Rooms", link: "/room" },
      { label: "Room Details", link: "/room-details" },
      { label: "Hotel Details", link: "/hotel/1" },
      { label: "Gallery", link: "/gallery" },
    ],
  },
  {
    label: "Reservations",
    type: "submenu",
    subMenu: [
      { label: "Checkout", link: "/checkout" },
      { label: "Booking Success", link: "/booking-success" },
      { label: "My Bookings", link: "/my-bookings" },
    ],
  },
  {
    label: "Account",
    type: "submenu",
    subMenu: [
      { label: "Login", link: "/login" },
      { label: "Register", link: "/register" },
      { label: "Forgot Password", link: "/forgot-password" },
    ],
  },
  {
    label: "Contact",
    type: "link",
    link: "/contact",
  },
];
