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
import GuestRoomSelector from "@/components/room/GuestRoomSelector";
import { fetchProvinces } from "@/lib/api/locationApi";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface OptionType {
  value: string;
  label: string;
}

const roomOptions = (t: (key: string) => string): OptionType[] => [
  { value: "rooms", label: t("checkout.roomPlaceholder") },
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
  { value?: string; onClick?: () => void; customPlaceholder?: string }
>(({ value, onClick, customPlaceholder }, ref) => (
  <div
    ref={ref}
    className='custom-date-input d-flex align-items-center justify-content-between px-3 border bg-white w-100'
    style={{ height: "42px", borderRadius: "0.375rem", borderColor: "#ced4da", cursor: "pointer" }}
    onClick={onClick}
  >
    <div className='d-flex gap-2 align-items-center overflow-hidden'>
      <i className='ph ph-calendar-blank text-muted'></i>
      <span className={`${value ? "text-dark" : "text-muted"} text-nowrap text-truncate small`}>
        {value || customPlaceholder}
      </span>
    </div>
  </div>
));
CustomDateInput.displayName = 'CustomDateInput';

const Checkout: FC = () => {
  const { t } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState(roomOptions(t)[0]);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [locations, setLocations] = useState<OptionType[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<OptionType | null>(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation?.value) {
      params.append("location", selectedLocation.value);
    }
    if (checkInDate) {
      params.append("checkIn", checkInDate.toISOString());
    }
    if (checkOutDate) {
      params.append("checkOut", checkOutDate.toISOString());
    }
    params.append("adults", guests.adults.toString());
    params.append("children", guests.children.toString());
    params.append("rooms", guests.rooms.toString());

    router.push(`/room?${params.toString()}`);
  };

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
                <div className='checkout-wrapper flex-grow-1 d-flex flex-column justify-content-between h-100' style={{ maxWidth: "100%" }}>
                  <label className='tw-text-sm fw-normal font-body d-flex align-items-center tw-gap-4 tw-mb-2 text-nowrap'>
                    <span>
                      <Image
                        width={21}
                        height={22}
                        src='/assets/images/icons/checkout-icon1.svg'
                        alt='icon'
                      />
                    </span>
                    {t("checkout.location")}
                  </label>
                  <Select
                    instanceId='location-select-instance'
                    inputId='location-select'
                    options={locations}
                    value={selectedLocation}
                    onChange={(option) => setSelectedLocation(option)}
                    className='custom-select-container'
                    classNamePrefix='custom-select'
                    placeholder={t("checkout.locationPlaceholder")}
                  />
                </div>

                <div className='checkout-wrapper flex-grow-1 d-flex flex-column justify-content-between h-100' style={{ maxWidth: "100%" }}>
                  <label className='tw-text-sm fw-normal font-body d-flex align-items-center tw-gap-4 tw-mb-2 text-nowrap'>
                    <span>
                      <Image
                        width={21}
                        height={22}
                        src='/assets/images/icons/checkout-icon1.svg'
                        alt='icon'
                      />
                    </span>
                    {t("checkout.checkIn")}
                  </label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date: SetStateAction<Date | null>) =>
                      setCheckInDate(date)
                    }
                    customInput={
                      <CustomDateInput customPlaceholder={t("checkout.selectCheckIn")} />
                    }
                    dateFormat='MMM d, yyyy'
                    wrapperClassName='w-100'
                    minDate={new Date()}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    popperPlacement='bottom-start'
                  />
                </div>

                {/* Check-out Date Picker */}
                <div className='checkout-wrapper flex-grow-1 d-flex flex-column justify-content-between h-100' style={{ maxWidth: "100%" }}>
                  <label className='tw-text-sm fw-normal font-body d-flex align-items-center tw-gap-4 tw-mb-2 text-nowrap'>
                    <span>
                      <Image
                        width={21}
                        height={22}
                        src='/assets/images/icons/checkout-icon1.svg'
                        alt='icon'
                      />
                    </span>
                    {t("checkout.checkOut")}
                  </label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date: SetStateAction<Date | null>) =>
                      setCheckOutDate(date)
                    }
                    customInput={
                      <CustomDateInput customPlaceholder={t("checkout.selectCheckOut")} />
                    }
                    dateFormat='MMM d, yyyy'
                    wrapperClassName='w-100'
                    minDate={checkInDate || new Date()}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    disabled={!checkInDate}
                    popperPlacement='bottom-start'
                  />
                </div>

                <div className='checkout-wrapper flex-grow-1 d-flex flex-column justify-content-between h-100' style={{ maxWidth: "100%" }}>
                  <label className='tw-text-sm fw-normal font-body d-flex align-items-center tw-gap-4 tw-mb-2 text-nowrap'>
                    <span>
                      <Image
                        width={20}
                        height={20}
                        src='/assets/images/icons/checkout-icon4.svg'
                        alt='icon'
                      />
                    </span>{" "}
                    {t("checkout.guestsRooms")}
                  </label>
                  <GuestRoomSelector onChange={setGuests} />
                </div>
                <div className='checkout-wrapper z-0'>
                  <div className='checkout-button common-hover-yellow'>
                    <button 
                      onClick={handleSearch}
                      className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-7 text-uppercase text-heading font-heading d-inline-flex align-items-center tw-gap-2 tw-rounded-lg'
                    >
                      {t("checkout.search")}{" "}
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
