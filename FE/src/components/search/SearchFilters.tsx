import Link from "next/link";

import type { HotelSearchFilters } from "@/types/hotel";

interface SearchFiltersProps {
  filters: HotelSearchFilters;
  amenities: string[];
}

export default function SearchFilters({ filters, amenities }: SearchFiltersProps) {
  const selectedAmenities = new Set(filters.amenities ?? []);

  return (
    <section className='bg_2 tw-py-12'>
      <div className='container'>
        <form
          action='/room'
          className='bg-white tw-rounded-lg tw-p-8'
          method='get'
        >
          <div className='row row-gap-4 align-items-end'>
            <div className='col-xl-3 col-lg-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Location
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.location ?? ""}
                name='location'
                placeholder='Hanoi, Da Nang, beach...'
                type='search'
              />
            </div>

            <div className='col-xl-2 col-lg-3 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Min price
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

            <div className='col-xl-2 col-lg-3 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Max price
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

            <div className='col-xl-2 col-lg-4 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Star rating
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.starRating ?? ""}
                name='starRating'
              >
                <option value=''>Any rating</option>
                <option value='5'>5 stars</option>
                <option value='4'>4+ stars</option>
                <option value='3'>3+ stars</option>
              </select>
            </div>

            <div className='col-xl-3 col-lg-8 col-md-6'>
              <div className='d-flex tw-gap-3'>
                <button
                  className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg flex-grow-1'
                  type='submit'
                >
                  Search
                </button>
                <Link
                  className='btn btn-outline-secondary d-inline-flex align-items-center justify-content-center tw-px-5'
                  href='/room'
                >
                  Clear
                </Link>
              </div>
            </div>
          </div>

          {amenities.length > 0 ? (
            <div className='tw-mt-8'>
              <span className='tw-text-sm fw-bold text-heading tw-mb-3 d-block'>
                Amenities
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
