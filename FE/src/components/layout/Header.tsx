"use client";
import { FC, useEffect, useRef, useState } from "react";
import { getMenuData } from "@/data/menuData";
import { getDesktopMenuData } from "@/data/menuDataDesktop";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCurrency } from "@/lib/currency/CurrencyContext";

const Header: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, handleLogout } = useAuth();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { currency, toggleCurrency } = useCurrency();
  const { language, toggleLanguage, t } = useLanguage();

  const dynamicDesktopMenu = getDesktopMenuData(language)
    .filter(item => item.label !== "Tài khoản" && item.label !== "Account")
    .map(item => item);

  const dynamicMobileMenu = getMenuData(language)
    .filter(item => item.label !== "Tài khoản" && item.label !== "Account")
    .map(item => item);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchActive(false);
    if (searchQuery.trim()) {
      router.push(`/room?location=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/room');
    }
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
        {/* Top Bar */}
        <div className="top-bar tw-bg-neutral-900 tw-py-2 d-none d-lg-block border-bottom border-neutral-800" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}>
          <div className="container tw-container-1750-px d-flex justify-content-end align-items-center tw-gap-6">
            <Link
              href='/find-booking'
              className='text-neutral-300 hover-text-white tw-text-sm d-flex align-items-center tw-gap-1'
            >
              <i className='ph ph-magnifying-glass' />
              Tra cứu đơn
            </Link>
            
            <button onClick={toggleCurrency} className='text-neutral-300 hover-text-white tw-text-sm bg-transparent border-0 d-flex align-items-center tw-gap-1' title="Chọn tiền tệ">
              <span className='tw-text-base'><i className='ph ph-currency-circle-dollar' /></span>
              {currency}
            </button>
            
            <button onClick={toggleLanguage} className='text-neutral-300 hover-text-white tw-text-sm bg-transparent border-0 d-flex align-items-center tw-gap-1' title="Chọn ngôn ngữ">
              <img src={language === 'vi' ? "https://flagcdn.com/w40/vn.png" : "https://flagcdn.com/w40/us.png"} width="20" height="14" alt={language.toUpperCase()} className="tw-rounded-sm object-fit-cover" style={{ boxShadow: '0 0 2px rgba(0,0,0,0.3)' }} />
            </button>
          </div>
        </div>

        <div className='container tw-container-1750-px'>
          <nav className='d-flex align-items-center justify-content-between position-relative tw-py-5'>
            {/* Logo Start */}
            <div className='logo'>
              <Link href='/' className='link'>
                <div className='d-flex align-items-center gap-2'>
                  <i className='ph-fill ph-buildings tw-text-4xl text-main-600'></i>
                  <span className={`fw-bold tw-text-3xl ${scroll || pathname !== '/' ? 'text-white' : 'text-dark'}`}>VPL Hotel</span>
                </div>
              </Link>
            </div>
            {/* Logo End  */}
            {/* Menu removed to match Booking.com style */}
            {/* Header Right start */}
            <div className='header-right d-flex tw-gap-28'>
              <div className='header-btn-wrap d-flex align-items-center tw-gap-5'>
                {/* Currency & Language moved to Top Bar */}

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
              <div className='header-button header-two-button d-flex align-items-center tw-gap-4'>

                <Link
                  className='tw-btn-hover-white bg-main-600 tw-py-5 tw-px-7 text-capitalize text-heading font-heading d-lg-inline-flex d-none align-items-center justify-content-center tw-gap-2 tw-rounded-lg'
                  style={{ minWidth: "230px" }}
                  href='/room'
                >
                  {t("header.bookNow")}
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
                        {(user.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
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
                            href='/profile'
                            onClick={() => setUserMenuOpen(false)}
                            className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-heading hover-bg-neutral-200 tw-rounded'
                          >
                            <i className='ph ph-user' />
                            {t("header.profile")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href='/profile?tab=bookings'
                            onClick={() => setUserMenuOpen(false)}
                            className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-heading hover-bg-neutral-200 tw-rounded'
                          >
                            <i className='ph ph-calendar-check' />
                            {t("header.myBookings")}
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
                        {user.role === 'vendor' && (
                          <li>
                            <Link
                              href='/extranet/dashboard'
                              onClick={() => setUserMenuOpen(false)}
                              className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-primary fw-medium hover-bg-neutral-200 tw-rounded'
                            >
                              <i className='ph ph-shield-check' />
                              Trang Quản lý (Vendor)
                            </Link>
                          </li>
                        )}
                        {user.role === 'admin' && (
                          <li>
                            <Link
                              href='/admin/dashboard'
                              onClick={() => setUserMenuOpen(false)}
                              className='d-flex align-items-center tw-gap-2 tw-px-4 tw-py-2 text-primary fw-medium hover-bg-neutral-200 tw-rounded'
                            >
                              <i className='ph ph-shield-check' />
                              Trang Quản trị (Admin)
                            </Link>
                          </li>
                        )}
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
                            {t("header.logout")}
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className='d-flex align-items-center tw-gap-4 tw-ms-2'>
                    <Link
                      href='/login'
                      className='text-white fw-medium hover-text-main-600 d-inline-flex justify-content-center align-items-center'
                      style={{ minWidth: "100px" }}
                    >
                      {t("header.login")}
                    </Link>
                    <Link
                      href='/register'
                      className='tw-btn-hover-white bg-transparent border border-white tw-py-2 tw-px-5 text-white hover-text-heading fw-medium tw-rounded-lg d-none d-lg-inline-flex justify-content-center align-items-center'
                      style={{ minWidth: "120px" }}
                    >
                      {t("header.register")}
                    </Link>
                  </div>
                )}
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
            <div className='d-flex align-items-center gap-2'>
              <i className='ph-fill ph-buildings tw-text-3xl text-main-600'></i>
              <span className='fw-bold tw-text-2xl text-dark'>VPL Hotel</span>
            </div>
          </Link>

          {/* Mobile Menu Links Removed */}

          {/* Mobile Auth */}
          <div className='tw-mt-8 tw-border-t tw-border-neutral-200 tw-pt-6'>
            <Link
              href='/find-booking'
              onClick={() => setActive(false)}
              className='d-flex align-items-center tw-gap-2 tw-py-2 tw-mb-4 text-heading fw-medium hover-text-main-600'
            >
              <i className='ph ph-magnifying-glass text-main-600' />
              Tra cứu đơn hàng
            </Link>
            
            {authLoading ? null : user ? (
              <>
                <div className='d-flex align-items-center tw-gap-3 tw-mb-4'>
                  <span
                    className='d-inline-flex align-items-center justify-content-center bg-main-600 rounded-circle text-heading fw-bold'
                    style={{ width: 36, height: 36, fontSize: 14 }}
                  >
                    {(user.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </span>
                  <div>
                    <span className='fw-semibold text-heading d-block'>{user.full_name || user.email}</span>
                    <span className='tw-text-xs text-neutral-500'>{user.email}</span>
                  </div>
                </div>
                <Link
                  href='/profile'
                  onClick={() => setActive(false)}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-heading hover-text-main-600'
                >
                  <i className='ph ph-user' />
                  {t("header.profile")}
                </Link>
                <Link
                  href='/profile?tab=bookings'
                  onClick={() => setActive(false)}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-heading hover-text-main-600'
                >
                  <i className='ph ph-calendar-check' />
                  {t("header.myBookings")}
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
                  {t("header.logout")}
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
                  {t("header.login")}
                </Link>
                <Link
                  href='/register'
                  onClick={() => setActive(false)}
                  className='d-flex align-items-center tw-gap-2 tw-py-2 text-heading hover-text-main-600'
                >
                  <i className='ph ph-user-plus' />
                  {t("header.register")}
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
                        <div className='d-flex align-items-center gap-2'>
                          <i className='ph-fill ph-buildings tw-text-4xl text-main-600'></i>
                          <span className='fw-bold tw-text-3xl text-dark'>VPL Hotel</span>
                        </div>
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
                    <form onSubmit={handleSearch}>
                      <div className='search_input'>
                        <input
                          className='search-input-field'
                          type='text'
                          placeholder='Nhập địa điểm khách sạn...'
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
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

export default Header;
