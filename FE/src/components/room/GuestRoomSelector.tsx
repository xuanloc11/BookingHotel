"use client";
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const GuestRoomSelector = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const updateCount = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
    delta: number,
    min: number
  ) => {
    const newVal = current + delta;
    if (newVal >= min) setter(newVal);
  };

  const displayText = `${adults} ${t("checkout.adultsCount")} · ${children} ${t("checkout.childrenCount")} · ${rooms} ${t("checkout.roomsCount")}`;

  return (
    <div className='position-relative tw-w-full' ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        className='custom-date-input tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-[7px] tw-border tw-border-gray-300 tw-rounded-lg tw-cursor-pointer tw-bg-white tw-w-full'
        onClick={handleToggle}
      >
        <div className='d-flex gap-2 tw-items-center align-items-center'>
          <span className='tw-text-gray-800 tw-text-sm'>{displayText}</span>
        </div>
        <i className='ph ph-caret-down tw-text-gray-500'></i>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className='position-absolute bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-shadow-lg'
          style={{
            top: "100%",
            left: 0,
            width: "320px",
            marginTop: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            zIndex: 9999, // Đảm bảo luôn nổi lên trên cùng
          }}
        >
          {/* Adults Row */}
          <div className='d-flex justify-content-between align-items-center tw-mb-4'>
            <span className='tw-text-gray-800 tw-font-medium'>{t("checkout.adults")}</span>
            <div className='d-flex align-items-center tw-gap-3'>
              <button
                type='button'
                className='btn btn-outline-secondary d-flex justify-content-center align-items-center'
                style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                onClick={() => updateCount(setAdults, adults, -1, 1)}
                disabled={adults <= 1}
              >
                <i className='ph ph-minus'></i>
              </button>
              <span className='tw-w-6 text-center'>{adults}</span>
              <button
                type='button'
                className='btn btn-outline-primary d-flex justify-content-center align-items-center'
                style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                onClick={() => updateCount(setAdults, adults, 1, 1)}
              >
                <i className='ph ph-plus'></i>
              </button>
            </div>
          </div>

          {/* Children Row */}
          <div className='d-flex justify-content-between align-items-center tw-mb-4'>
            <span className='tw-text-gray-800 tw-font-medium'>{t("checkout.children")}</span>
            <div className='d-flex align-items-center tw-gap-3'>
              <button
                type='button'
                className='btn btn-outline-secondary d-flex justify-content-center align-items-center'
                style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                onClick={() => updateCount(setChildren, children, -1, 0)}
                disabled={children <= 0}
              >
                <i className='ph ph-minus'></i>
              </button>
              <span className='tw-w-6 text-center'>{children}</span>
              <button
                type='button'
                className='btn btn-outline-primary d-flex justify-content-center align-items-center'
                style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                onClick={() => updateCount(setChildren, children, 1, 0)}
              >
                <i className='ph ph-plus'></i>
              </button>
            </div>
          </div>

          {/* Rooms Row */}
          <div className='d-flex justify-content-between align-items-center tw-mb-4'>
            <span className='tw-text-gray-800 tw-font-medium'>{t("checkout.rooms")}</span>
            <div className='d-flex align-items-center tw-gap-3'>
              <button
                type='button'
                className='btn btn-outline-secondary d-flex justify-content-center align-items-center'
                style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                onClick={() => updateCount(setRooms, rooms, -1, 1)}
                disabled={rooms <= 1}
              >
                <i className='ph ph-minus'></i>
              </button>
              <span className='tw-w-6 text-center'>{rooms}</span>
              <button
                type='button'
                className='btn btn-outline-primary d-flex justify-content-center align-items-center'
                style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                onClick={() => updateCount(setRooms, rooms, 1, 1)}
              >
                <i className='ph ph-plus'></i>
              </button>
            </div>
          </div>

          {/* Done Button */}
          <button
            type='button'
            className='btn btn-outline-primary w-100 tw-py-2 tw-mt-2'
            style={{ borderRadius: "8px" }}
            onClick={() => setIsOpen(false)}
          >
            {t("checkout.done")}
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestRoomSelector;
