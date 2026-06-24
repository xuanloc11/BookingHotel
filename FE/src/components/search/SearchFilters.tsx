"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import GuestRoomSelector from "@/components/room/GuestRoomSelector";

import type { HotelSearchFilters } from "@/types/hotel";

interface SearchFiltersProps {
  filters: HotelSearchFilters;
  amenities: string[];
}

export default function SearchFilters({ filters, amenities }: SearchFiltersProps) {
  const { t } = useLanguage();
  const selectedAmenities = new Set(filters.amenities ?? []);
  const [guestConfig, setGuestConfig] = useState({
    adults: filters.adults ?? 2,
    children: filters.children ?? 0,
    rooms: filters.rooms ?? 1,
  });

  return (
    <section className='bg_2 tw-py-12'>
      <div className='container'>
        <form
          action='/room'
          className='bg-white tw-rounded-lg tw-p-8'
          method='get'
        >
          <div className='row row-gap-4 align-items-end'>
            <input type='hidden' name='adults' value={guestConfig.adults} />
            <input type='hidden' name='children' value={guestConfig.children} />
            <input type='hidden' name='rooms' value={guestConfig.rooms} />
            
            <div className='col-xl-3 col-lg-12'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("search.location")}
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.location ?? ""}
                name='location'
                placeholder={t("search.locationPlaceholder")}
                type='search'
              />
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("checkout.checkIn")}
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.checkIn ?? ""}
                name='checkIn'
                type='date'
              />
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("checkout.checkOut")}
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.checkOut ?? ""}
                name='checkOut'
                type='date'
              />
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("checkout.guests") === "checkout.guests" ? "Khách và phòng" : t("checkout.guests")}
              </label>
              <GuestRoomSelector 
                initialAdults={filters.adults}
                initialChildren={filters.children}
                initialRooms={filters.rooms}
                onChange={setGuestConfig}
              />
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("search.minPrice")}
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.priceMin ?? ""}
                min='0'
                name='priceMin'
                step='50000'
                type='number'
              />
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("search.maxPrice")}
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.priceMax ?? ""}
                min='0'
                name='priceMax'
                step='50000'
                type='number'
              />
            </div>

            <div className='col-xl-3 col-lg-4 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("search.stars")}
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.stars ?? ""}
                name='stars'
              >
                <option value=''>{t("search.allStars")}</option>
                <option value='5'>{t("search.5stars")}</option>
                <option value='4'>{t("search.from4stars")}</option>
                <option value='3'>{t("search.from3stars")}</option>
              </select>
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("search.guestRating")}
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.starRating ?? ""}
                name='starRating'
              >
                <option value=''>{t("search.allRatings")}</option>
                <option value='4.5'>{t("search.rating45")}</option>
                <option value='4'>{t("search.rating40")}</option>
                <option value='3.5'>{t("search.rating35")}</option>
                <option value='3'>{t("search.rating30")}</option>
              </select>
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                {t("search.sortBy")}
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.sortBy ?? ""}
                name='sortBy'
              >
                <option value=''>{t("search.sortTop")}</option>
                <option value='price_asc'>{t("search.sortPriceAsc")}</option>
                <option value='price_desc'>{t("search.sortPriceDesc")}</option>
                <option value='rating_desc'>{t("search.sortRatingDesc")}</option>
              </select>
            </div>

            <div className='col-xl-9 col-lg-12 col-md-12'>
              <div className='d-flex tw-gap-3'>
                <button
                  className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg flex-grow-1'
                  type='submit'
                >
                  {t("search.searchBtn")}
                </button>
                <Link
                  className='btn btn-outline-secondary d-inline-flex align-items-center justify-content-center tw-px-5'
                  href='/room'
                >
                  {t("search.clearBtn")}
                </Link>
              </div>
            </div>
          </div>

          {amenities.length > 0 ? (
            <div className='tw-mt-8'>
              <span className='tw-text-sm fw-bold text-heading tw-mb-3 d-block'>
                {t("search.amenities")}
              </span>
              <div className='d-flex flex-wrap tw-gap-3'>
                {amenities.slice(0, 14).map((amenity) => (
                  <label
                    className='border tw-rounded-lg tw-py-2 tw-px-4 d-inline-flex align-items-center tw-gap-2'
                    key={amenity}
                  >
                    <input
                      defaultChecked={selectedAmenities.has(amenity)}
                      name='amenities'
                      type='checkbox'
                      value={amenity}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
