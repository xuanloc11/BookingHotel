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
            <div className='col-xl-3 col-lg-12'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Vị trí
              </label>
              <input
                className='form-control tw-h-14'
                defaultValue={filters.location ?? ""}
                name='location'
                placeholder='Hà Nội, Đà Nẵng, bãi biển...'
                type='search'
              />
            </div>

            <div className='col-xl-3 col-lg-6 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Giá tối thiểu
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
                Giá tối đa
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
                Hạng sao
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.stars ?? ""}
                name='stars'
              >
                <option value=''>Mọi hạng sao</option>
                <option value='5'>5 sao</option>
                <option value='4'>Từ 4 sao</option>
                <option value='3'>Từ 3 sao</option>
              </select>
            </div>

            <div className='col-xl-4 col-lg-4 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Điểm đánh giá
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.starRating ?? ""}
                name='starRating'
              >
                <option value=''>Mọi đánh giá</option>
                <option value='4.5'>Tuyệt hảo: Từ 4.5</option>
                <option value='4'>Rất tốt: Từ 4.0</option>
                <option value='3.5'>Tốt: Từ 3.5</option>
                <option value='3'>Khá: Từ 3.0</option>
              </select>
            </div>

            <div className='col-xl-4 col-lg-4 col-md-6'>
              <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                Sắp xếp theo
              </label>
              <select
                className='form-select tw-h-14'
                defaultValue={filters.sortBy ?? ""}
                name='sortBy'
              >
                <option value=''>Đề xuất hàng đầu</option>
                <option value='price_asc'>Giá (Ưu tiên thấp nhất)</option>
                <option value='price_desc'>Giá (Ưu tiên cao nhất)</option>
                <option value='rating_desc'>Đánh giá tốt nhất</option>
              </select>
            </div>

            <div className='col-xl-4 col-lg-4 col-md-12'>
              <div className='d-flex tw-gap-3'>
                <button
                  className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg flex-grow-1'
                  type='submit'
                >
                  Tìm kiếm
                </button>
                <Link
                  className='btn btn-outline-secondary d-inline-flex align-items-center justify-content-center tw-px-5'
                  href='/room'
                >
                  Xóa lọc
                </Link>
              </div>
            </div>
          </div>

          {amenities.length > 0 ? (
            <div className='tw-mt-8'>
              <span className='tw-text-sm fw-bold text-heading tw-mb-3 d-block'>
                Tiện nghi
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
