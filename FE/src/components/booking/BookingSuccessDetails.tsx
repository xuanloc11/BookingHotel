import Link from "next/link";

interface BookingSuccessDetailsProps {
  bookingId?: string;
  status?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function BookingSuccessDetails({
  bookingId,
  status,
  hotelName,
  checkIn,
  checkOut,
}: BookingSuccessDetailsProps) {
  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-xl-8'>
            <div className='bg-white tw-rounded-lg tw-p-12 text-center'>
              <span className='tw-w-16 tw-h-16 rounded-circle bg-main-600 d-inline-flex align-items-center justify-content-center tw-text-8 text-heading tw-mb-6'>
                <i className='ph ph-check' />
              </span>
              <h1 className='tw-text-12 fw-normal tw-mb-4'>
                Đã nhận được yêu cầu đặt chỗ
              </h1>
              <p className='tw-text-lg tw-mb-8'>
                Thông tin xác nhận đã được ghi nhận. Giữ mã đặt phòng để làm thủ tục nhận phòng và hỗ trợ.
              </p>

              <div className='border tw-rounded-lg tw-p-6 text-start tw-mb-8'>
                <div className='d-flex justify-content-between tw-mb-3'>
                  <span>Booking ID</span>
                  <strong>{bookingId ?? "Pending"}</strong>
                </div>
                <div className='d-flex justify-content-between tw-mb-3'>
                  <span>Trạng thái</span>
                  <strong className='text-capitalize'>{status ?? "pending"}</strong>
                </div>
                {hotelName ? (
                  <div className='d-flex justify-content-between tw-mb-3'>
                    <span>Hotel</span>
                    <strong>{hotelName}</strong>
                  </div>
                ) : null}
                {checkIn && checkOut ? (
                  <div className='d-flex justify-content-between'>
                    <span>Ngày</span>
                    <strong>
                      {checkIn} to {checkOut}
                    </strong>
                  </div>
                ) : null}
              </div>

              <div className='d-flex justify-content-center flex-wrap tw-gap-3'>
                <Link
                  className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg'
                  href='/profile/?tab=bookings'
                >
                  Xem các đơn đặt phòng
                </Link>
                <Link className='btn btn-outline-secondary tw-py-4 tw-px-8' href='/room'>
                  Tìm kiếm thêm khách sạn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
