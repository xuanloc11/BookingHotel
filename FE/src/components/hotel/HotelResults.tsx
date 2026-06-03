import HotelCard from "./HotelCard";
import type { Hotel } from "@/types/hotel";

interface HotelResultsProps {
  hotels: Hotel[];
}

export default function HotelResults({ hotels }: HotelResultsProps) {
  return (
    <section className='py-120 bg_gray_1'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-end flex-wrap row-gap-3 tw-mb-10'>
          <div>
            <h2 className='section-title fw-normal tw-mb-3'>
              Available Hotels
            </h2>
            <p className='mb-0'>{hotels.length} stays match your search.</p>
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className='bg-white tw-rounded-lg tw-p-10 text-center'>
            <h3 className='tw-text-8 fw-normal tw-mb-3'>No hotels found</h3>
            <p className='mb-0'>
              Adjust the dates, budget, location, or amenities and search again.
            </p>
          </div>
        ) : (
          <div className='row'>
            {hotels.map((hotel) => (
              <div className='col-xl-4 col-lg-6 col-md-6' key={hotel.id}>
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
