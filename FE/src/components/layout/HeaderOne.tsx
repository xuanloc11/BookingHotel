"use client";
import { FC, useEffect, useRef, useState } from "react";
import { menuData } from "@/data/menuData";
import { desktopMenuData } from "@/data/menuDataDesktop";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const HeaderOne: FC = () => {
  const pathname = usePathname();
  const { user, loading: authLoading, handleLogout } = useAuth();
  const [searchActive, setSearchActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const dynamicDesktopMenu = desktopMenuData.map(item => {
    if (item.label === "Tài khoản") {
      if (user) {
        return {
          ...item,
          subMenu: [
            { label: "Hồ sơ cá nhân", link: "#" },
            { label: "Đơn đặt của tôi", link: "/my-bookings" },
            { label: "Đăng xuất", link: "/logout" }
          ]
        };
      } else {
        return {
          ...item,
          subMenu: [
            { label: "Đăng nhập", link: "/login" },
            { label: "Đăng ký", link: "/register" }
          ]
        };
      }
    }
    return item;
  });

  const dynamicMobileMenu = menuData.map(item => {
    if (item.label === "Tài khoản") {
      if (user) {
        return {
          ...item,
          subMenu: [
            { label: "Hồ sơ cá nhân", link: "#" },
            { label: "Đơn đặt của tôi", link: "/my-bookings" },
            { label: "Đăng xuất", link: "/logout" }
          ]
        };
      } else {
        return {
          ...item,
          subMenu: [
            { label: "Đăng nhập", link: "/login" },
            { label: "Đăng ký", link: "/register" }
          ]
        };
      }
    }
    return item;
  });

  /* Close user dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  const handleToggle = (index: number) => {
    if (!isMobile) return;

    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className='overlay'></div>
      <div
        className={`side-overlay ${active ? "active_side-overlay" : ""}`}
      ></div>
      <header
        className={`header tw-transition-all tw-z-99 header-transparent ${
          scroll ? "fixed-header" : ""
        }`}
      >
        <div className='container tw-container-1750-px'>
          <nav className='d-flex align-items-center justify-content-between position-relative'>
            {/* Logo Start */}
            <div className='logo'>
              <Link href='/' className='link'>
                <Image
                  width={202}
                  height={65}
                  src='/assets/images/logo/logo.png'
                  alt='Logo'
                  className='max-w-200-px'
                />
              </Link>
            </div>
            {/* Logo End  */}
            {/* Menu Start  */}
            <div className='header-menu d-lg-block d-none'>
              {/* Nav menu Start */}
              <ul className='nav-menu d-lg-flex align-items-center tw-gap-8'>
                {dynamicDesktopMenu.map((item, index) => {
                  // ================= LINK ONLY =================
                  if (item.type === "link") {
                    return (
                      <li key={index} className='nav-menu__item'>
                        <Link
                          href={item.link || "#"}
                          className='nav-menu__link text-white font-heading tw-py-11 fw-normal w-100'
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  // ================= MEGA MENU =================
                  if (item.type === "mega") {
                    return (
                      <li key={index} className='nav-menu__item has-submenu'>
                        <Link
                          href='#'
                          className='nav-menu__link tw-pe-5 text-white font-heading tw-py-11 fw-normal w-100'
                        >
                          {item.label}
                        </Link>

                        <div className='mega-menu tw-p-6 tw-rounded-lg scroll-sm nav-submenu position-absolute start-0 top-100 tw-w-max bg-white tw-rounded-md tw-duration-200 tw-z-99'>
                          <div className='row g-4 row-cols-1 row-cols-lg-3 row-cols-xl-4'>
                            {item.megaItems?.map((home, i) => (
                              <div key={i} className='col'>
                                <div className='mega-menu-item group-item'>
                                  <div className='position-relative border border-neutral-200 tw-rounded-lg overflow-hidden'>
                                    <Link href={home.link} className='d-block'>
                                      <Image
                                        src={home.image}
                                        width={1440}
                                        height={2100}
                                        alt='Home Page Image'
                                        className='tw-h-320-px w-100 object-fit-cover object-top'
                                      />
                                    </Link>

                                    <div className='d-lg-flex d-none'>
                                      <div className='mega-menu-item__overlay position-absolute top-0 tw-start-0 w-100 h-100 d-flex justify-content-center align-items-center tw-invisible opacity-0 group-hover-item-visible group-hover-item-opacity-1 tw-scale-08 group-hover-item-scale-1 tw-rounded-lg pointer-event-none'></div>
                                      <div className='mega-menu-item__buttons position-absolute top-0 tw-start-0 w-100 h-100 d-flex justify-content-center align-items-center flex-column tw-gap-4 tw-invisible opacity-0 group-hover-item-visible group-hover-item-opacity-1'>
                                        <Link
                                          className='tw-btn-hover-white bg-main-600 tw-py-4 tw-px-8 text-capitalize text-heading font-heading d-inline-flex align-items-center tw-gap-2 tw-rounded-lg'
                                          href={home.link}
                                        >
                                          Xem ngay
                                          <span className='d-inline-block lh-1 tw-text-lg'>
                                            <i className='ph ph-arrow-up-right' />
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>

                                  <div className='tw-mt-4 text-center'>
                                    <Link
                                      href={home.link}
                                      className='text-heading hover-text-main-600 fw-semibold tw-text-md text-capitalize line-clamp-1'
                                    >
                                      {home.title}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                  }

                  // ================= SUB MENU =================
                  return (
                    <li
                      key={index}
                      className='nav-menu__item has-submenu position-relative'
                    >
                      <Link
                        href='#'
                        className='nav-menu__link tw-pe-5 text-white font-heading tw-py-11 fw-normal w-100'
                      >
                        {item.label}
                      </Link>

                      <ul className='nav-submenu scroll-sm position-absolute start-0 top-100 tw-w-max bg-white tw-rounded-md overflow-hidden tw-p-2 tw-duration-200 tw-z-99'>
                        {item.subMenu?.map((sub, i) => (
                          <li
                            key={i}
                            className={`nav-submenu__item d-block tw-rounded tw-duration-200 position-relative ${
                              pathname === sub.link ? "activePage" : ""
                            }`}
                          >
                            {sub.link === "/logout" ? (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  await handleLogout();
                                }}
                                className='nav-submenu__link hover-bg-neutral-200 text-danger font-heading fw-normal w-100 d-block text-start tw-py-2 tw-px-305 tw-rounded border-0 bg-transparent'
                              >
                                {sub.label}
                              </button>
                            ) : (
                              <Link
                                href={sub.link}
                                className='nav-submenu__link hover-bg-neutral-200 text-heading font-heading fw-normal w-100 d-block tw-py-2 tw-px-305 tw-rounded'
                              >
                                {sub.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
              {/* Nav menu End  */}
            </div>
            {/* Menu End  */}
            {/* Header Right start */}
            <div className='header-right d-flex tw-gap-28'>
              <div className='header-btn-wrap d-flex align-items-center tw-gap-5'>
                <div>
                  <button
                    onClick={() => setSearchActive(true)}
                    className='open-search text-white'
                    aria-label='Tìm kiếm'
                    title='Mở tìm kiếm'
                  >
                    <span className='tw-text-3xl'>
                      <i className='ph ph-magnifying-glass' />
                    </span>
                  </button>
                </div>
              </div>

              {/* Auth Section */}
              <div className='header-button d-flex align-items-center tw-gap-4'>
                <Link
                  className='tw-btn-hover-yellow bg-white tw-py-5 tw-px-7 text-uppercase text-heading font-heading d-lg-inline-flex d-none align-items-center tw-gap-2 tw-rounded-lg'
                  href='/room'
                >
                  ĐẶT PHÒNG NGAY
                  <span className='d-inline-block lh-1 tw-text-lg'>
                    <i className='ph ph-calendar-plus' />
                  </span>
                </Link>

                {authLoading ? (
                  <span className='text-white tw-text-sm'>...</span>
                ) : user ? (
                  /* ---- Logged-in: avatar + dropdown ---- */
                  <div ref={userMenuRef} className='position-relative'>
                    <button
                      type='button'
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                      className='d-flex align-items-center tw-gap-2 bg-transparent border-0 text-white'
                      aria-label='Menu người dùng'
                    >
                      <span
                        className='d-inline-flex align-items-center justify-content-center bg-main-600 rounded-circle text-heading fw-bold'
                        style={{ width: 36, height: 36, fontSize: 14 }}
                      >
                        {(user.full_name?.[0] || user.email[0]).toUpperCase()}
                      </span>
                      <span className='d-none d-lg-inline fw-medium' style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.full_name || user.email}
                      </span>
                      <i className='ph ph-caret-down tw-text-sm' />
                    </button>

                    {userMenuOpen && (
                      <ul
                        className='position-absolute bg-white tw-rounded-md tw-p-2 tw-z-999'
                        style={{ top: '100%', right: 0, minWidth: 200, boxShadow: '0 4px 24px rgba(0,0,0,.12)' }}
                      >
                        <li className='tw-px-4 tw-py-2 border-bottom border-neutral-200'>
                          <span className='fw-semibold text-heading d-block text-truncate'>{user.full_name || user.email}</span>
                          <span className='tw-text-xs text-neutral-500 d-block text-truncate'>{user.email}</span>
                        </li>
                        <li>
                          <Link
                            href='/my-bookings'
                            onClick={() => setUserMenuOpen(false)}
                            className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-heading hover-bg-neutral-200 tw-rounded'
                          >
                            <i className='ph ph-calendar-check' />
                            Đơn đặt của tôi
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/room'
                            onClick={() => setUserMenuOpen(false)}
                            className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-heading hover-bg-neutral-200 tw-rounded'
                          >
                            <i className='ph ph-buildings' />
                            Tìm phòng
                          </Link>
                        </li>
                        <li className='border-top border-neutral-200'>
                          <button
                            type='button'
                            onClick={async () => {
                              setUserMenuOpen(false);
                              await handleLogout();
                            }}
                            className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-danger hover-bg-neutral-200 tw-rounded w-100 border-0 bg-transparent'
                          >
                            <i className='ph ph-sign-out' />
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => setActive(true)}
                type='button'
                className='toggle-mobileMenu leading-none d-lg-none text-white tw-text-9'
              >
                <i className='ph ph-list' />
              </button>
            </div>
            {/* Header Right End  */}
          </nav>
        </div>
      </header>

      {/* MobileMenu */}
      <div
        className={`mobile-menu d-lg-none d-block scroll-sm position-fixed bg-white tw-w-300-px tw-h-screen overflow-y-auto tw-p-6 tw-z-999 tw--translate-x-full tw-pb-68 ${
          active ? "active_mobile_menu" : "de_active_mobile_menu"
        }`}
      >
        <button
          onClick={() => setActive(false)}
          type='button'
          className='close-button position-absolute tw-end-0 top-0 tw-me-2 tw-mt-2 tw-w-605 tw-h-605 rounded-circle d-flex justify-content-center align-items-center text-neutral-900 bg-neutral-200 hover-bg-neutral-900 hover-text-white'
        >
          <i className='ph ph-x'></i>
        </button>

        <div className='mobile-menu__inner'>
          <Link href='/' className='mobile-menu__logo'>
            <Image
              width={202}
              height={65}
              src='/assets/images/logo/logo.png'
              alt='Logo'
            />
          </Link>

          <div className='mobile-menu__menu'>
            <ul className='nav-menu d-lg-flex align-items-center nav-menu--mobile d-block tw-mt-8'>
              {dynamicMobileMenu.map((item, index) => (
                <li
                  key={index}
                  className={`nav-menu__item ${
                    item.subMenu ? "has-submenu position-relative" : ""
                  } ${activeIndex === index ? "active" : ""}`}
                  onClick={() => handleToggle(index)}
                >
                  <Link
                    href={item.link ?? "#"}
                    className='nav-menu__link tw-pe-5 text-white font-heading tw-py-11 fw-normal w-100'
                  >
                    {item.label}
                  </Link>

                  {item.subMenu && (
                    <ul
                      className={`nav-submenu scroll-sm position-absolute start-0 top-100 tw-w-max bg-white tw-rounded-md overflow-hidden tw-p-2 tw-duration-200 tw-z-99 ${
                        activeIndex === index && isMobile
                          ? "active_submenu"
                          : "de_active_submenu"
                      }`}
                    >
                      {item.subMenu.map((sub, subIndex) => (
                        <li
                          key={subIndex}
                          className='nav-submenu__item d-block tw-rounded tw-duration-200 position-relative'
                        >
                          {sub.link === "/logout" ? (
                            <button
                              type='button'
                              onClick={async (e) => {
                                e.preventDefault();
                                setActive(false);
                                await handleLogout();
                              }}
                              className='nav-submenu__link hover-bg-neutral-200 text-danger font-heading fw-normal w-100 d-block text-start tw-py-2 tw-px-305 tw-rounded border-0 bg-transparent'
                            >
                              {sub.label}
                            </button>
                          ) : (
                            <Link
                              href={sub.link}
                              onClick={() => setActive(false)}
                              className='nav-submenu__link hover-bg-neutral-200 text-heading font-heading fw-normal w-100 d-block tw-py-2 tw-px-305 tw-rounded'
                            >
                              {sub.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Auth */}
          <div className='tw-mt-8 tw-border-t tw-border-neutral-200 tw-pt-6'>
            {authLoading ? null : user ? (
              <>
                <div className='d-flex align-items-center tw-gap-3 tw-mb-4'>
                  <span
                    className='d-inline-flex align-items-center justify-content-center bg-main-600 rounded-circle text-heading fw-bold'
                    style={{ width: 36, height: 36, fontSize: 14 }}
                  >
                    {(user.full_name?.[0] || user.email[0]).toUpperCase()}
                  </span>
                  <div>
                    <span className='fw-semibold text-heading d-block'>{user.full_name || user.email}</span>
                    <span className='tw-text-xs text-neutral-500'>{user.email}</span>
                  </div>
                </div>
                <Link
                  href='/my-bookings'
                  onClick={() => setActive(false)}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-heading hover-text-main-600'
                >
                  <i className='ph ph-calendar-check' />
                  Đơn đặt của tôi
                </Link>
                <button
                  type='button'
                  onClick={async () => {
                    setActive(false);
                    await handleLogout();
                  }}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-danger border-0 bg-transparent w-100 tw-mt-2'
                >
                  <i className='ph ph-sign-out' />
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className='d-flex flex-column tw-gap-3'>
                <Link
                  href='/login'
                  onClick={() => setActive(false)}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-heading hover-text-main-600'
                >
                  <i className='ph ph-sign-in' />
                  Đăng nhập
                </Link>
                <Link
                  href='/register'
                  onClick={() => setActive(false)}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-heading hover-text-main-600'
                >
                  <i className='ph ph-user-plus' />
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <>
        <div
          className={
            searchActive ? "search_popup search-opened" : "search_popup"
          }
        >
          <div className='container'>
            <div className='row'>
              <div className='col-xxl-12'>
                <div className='search_wrapper'>
                  <div className='search_top d-flex justify-content-between align-items-center'>
                    <div className='search_logo'>
                      <Link href='/'>
                        <Image
                          width={202}
                          height={65}
                          src='/assets/images/logo/logo.png'
                          alt='Logo'
                        />
                      </Link>
                    </div>
                    <div
                      className='search_close'
                      onClick={() => setSearchActive(false)}
                    >
                      <button type='button' className='search_close_btn'>
                        <svg
                          width={18}
                          height={18}
                          viewBox='0 0 18 18'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M17 1L1 17'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M1 1L17 17'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className='search_form'>
                    <form action='#'>
                      <div className='search_input'>
                        <input
                          className='search-input-field'
                          type='text'
                          placeholder='Nhập nội dung tìm kiếm...'
                        />
                        <span className='search-focus-border' />
                        <button type='submit'>
                          <svg
                            width={20}
                            height={20}
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M19.0002 19.0002L17.2002 17.2002'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            searchActive
              ? "search-popup-overlay search-popup-overlay-open"
              : "search-popup-overlay"
          }
        />
      </>
    </>
  );
};

export default HeaderOne;
