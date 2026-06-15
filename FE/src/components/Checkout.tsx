"use client";
import Image from "next/image";
import {
  FC,
  SetStateAction,
  useState,
  forwardRef,
  useEffect,
} from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import GuestRoomSelector from "./GuestRoomSelector";
import { fetchProvinces } from "@/lib/api/locationApi";

interface OptionType {
  value: string;
  label: string;
}

const roomOptions: OptionType[] = [
  { value: "rooms", label: "Rooms" },
  { value: "01", label: "01" },
  { value: "02", label: "02" },
  { value: "03", label: "03" },
  { value: "04", label: "04" },
  { value: "05", label: "05" },
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "09", label: "09" },
];

const CustomDateInput = forwardRef<
  HTMLDivElement,
  { value?: string; onClick?: () => void; placeholder?: string }
>(({ value, onClick, placeholder }, ref) => (
  <div
    ref={ref}
    className='custom-date-input tw-flex tw-items-center tw-justify-between tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg tw-cursor-pointer tw-bg-white tw-w-full'
    onClick={onClick}
  >
    <div className='d-flex gap-2 tw-items-center justify-content-center align-items-center'>
      <i className='ph ph-check'></i>
      <span className={`${value ? "tw-text-gray-800" : "tw-text-gray-400"}`}>
        {value || placeholder || "Select date"}
      </span>
    </div>
  </div>
));
CustomDateInput.displayName = 'CustomDateInput';

const Checkout: FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(roomOptions[0]);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [locations, setLocations] = useState<OptionType[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<OptionType | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const provinces = await fetchProvinces();
        const formattedLocations = provinces.map((province) => ({
          label: `${province.name} (${province.hotel_count})`,
          value: province.name,
        }));
        setLocations(formattedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div
      className='checkout-area position-relative z-3 tw_fade_anim tw-mt-[-200px]'
      data-delay='.3'
    >
      <div className='container'>
        <div className='checkout-bg bg-white tw-pt-11 tw-px-14 tw-pb-11 tw-rounded-md'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='checkout-main-wrapper'>
                {/* Location Selector */}
                <div className='checkout-wrapper d-flex flex-column'>
                  <label className='tw-text-sm fw-normal font-body d-flex align-content-center tw-gap-4 tw-mb-2'>
                    <span>
                      <Image
                        width={21}
                        height={22}
                        src='/assets/images/icons/checkout-icon1.svg'
                        alt='icon'
                      />
                    </span>
                    Vị trí
                  </label>
                  <Select
                    instanceId='location-select-instance'
                    inputId='location-select'
                    options={locations}
                    value={selectedLocation}
                    onChange={(option) => setSelectedLocation(option)}
                    className='custom-select-container'
                    classNamePrefix='custom-select'
                    placeholder="Chọn địa điểm..."
                  />
                </div>

                <div className='checkout-wrapper d-flex flex-column'>
                  <label className='tw-text-sm fw-normal font-body d-flex align-content-center tw-gap-4 tw-mb-2'>
                    <span>
                      <Image
                        width={21}
                        height={22}
                        src='/assets/images/icons/checkout-icon1.svg'
                        alt='icon'
                      />
                    </span>
                    Check-in Date
                  </label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date: SetStateAction<Date | null>) =>
                      setCheckInDate(date)
                    }
                    customInput={
                      <CustomDateInput placeholder='Select check-in date' />
                    }
                    dateFormat='MMM d, yyyy'
                    wrapperClassName='tw-w-full'
                    minDate={new Date()}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    popperPlacement='bottom-start'
                  />
                </div>

                {/* Check-out Date Picker */}
                <div className='checkout-wrapper d-flex flex-column'>
                  <label className='tw-text-sm fw-normal font-body d-flex align-content-center tw-gap-4 tw-mb-2'>
                    <span>
                      <Image
                        width={21}
                        height={22}
                        src='/assets/images/icons/checkout-icon1.svg'
                        alt='icon'
                      />
                    </span>
                    Check-out Date
                  </label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date: SetStateAction<Date | null>) =>
                      setCheckOutDate(date)
                    }
                    customInput={
                      <CustomDateInput placeholder='Select check-out date' />
                    }
                    dateFormat='MMM d, yyyy'
                    wrapperClassName='tw-w-full'
                    minDate={checkInDate || new Date()}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    disabled={!checkInDate}
                    popperPlacement='bottom-start'
                  />
                </div>
                <div className='checkout-wrapper d-flex flex-column'>
                  <label className='tw-text-sm fw-normal font-body d-flex align-content-center tw-gap-4 tw-mb-2'>
                    <span>
                      <Image
                        width={20}
                        height={20}
                        src='/assets/images/icons/checkout-icon3.svg'
                        alt='icon'
                      />
                    </span>
                    Chọn phòng
                  </label>
                  <Select
                    instanceId='checkout-select-instance'
                    inputId='checkout-select'
                    options={roomOptions}
                    value={selectedRoom}
                    onChange={(option) => option && setSelectedRoom(option)}
                    className='custom-select-container'
                    classNamePrefix='custom-select'
                  />
                </div>
                <div className='checkout-wrapper d-flex flex-column'>
                  <label className='tw-text-sm fw-normal font-body d-flex align-content-center tw-gap-4 tw-mb-2'>
                    <span>
                      <Image
                        width={20}
                        height={20}
                        src='/assets/images/icons/checkout-icon4.svg'
                        alt='icon'
                      />
                    </span>{" "}
                    Khách & Phòng
                  </label>
                  <GuestRoomSelector />
                </div>
                <div className='checkout-wrapper z-0'>
                  <div className='checkout-button common-hover-yellow'>
                    <button className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-7 text-uppercase text-heading font-heading d-inline-flex align-items-center tw-gap-2 tw-rounded-lg'>
                      EXPLORE MORE{" "}
                      <span className='d-inline-block lh-1 tw-text-lg'>
                        <i className='ph ph-arrow-up-right' />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
