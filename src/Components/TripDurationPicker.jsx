import React, { useRef, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendar from '../assets/icons/date_range.svg';

function TripDurationPicker({ value, onChange, isPreview = false }) {
  // `value` is expected as a string in format: "Jan 1, 2025 - Jan 7, 2025" or ''
  // Parse it to a date range [startDate, endDate] for the date picker
  const [dateRange, setDateRange] = useState([null, null]);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef();

  // Parse value prop to Date objects (startDate, endDate)
  useEffect(() => {
    if (!value) {
      setDateRange([null, null]);
      return;
    }
    const parts = value.split(' - ');
    if (parts.length === 2) {
      const start = new Date(parts[0]);
      const end = new Date(parts[1]);
      if (!isNaN(start) && !isNaN(end)) {
        setDateRange([start, end]);
      }
    }
  }, [value]);

  // Click outside listener to close calendar popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const formatDate = (date) =>
    date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const hasSelectedDates = dateRange[0] && dateRange[1];

  // Handle date changes from the picker and notify parent
  const handleDateChange = (update) => {
    const [start, end] = update || [null, null];
    setDateRange([start, end]);
    if (start && end) {
      const formatted = `${formatDate(start)} - ${formatDate(end)}`;
      if (onChange) onChange(formatted);
      setOpen(false);
    }
  };

  // Preview mode: show read-only non-interactive display
  if (isPreview) {
    return (
      <div
        style={{
          height: '64px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(242, 244, 254, 0.12)',
          borderRadius: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: hasSelectedDates ? '#FFFFFF' : 'rgba(255, 255, 255, 0.64)',
          fontFamily: 'Lato',
          fontSize: hasSelectedDates ? '28px' : '20px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '36px',
          userSelect: 'none',
        }}
      >
        {hasSelectedDates ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}` : 'Select Dates'}
      </div>
    );
  }

  // Editable mode
  return (
    <div
      ref={pickerRef}
      style={{
        display: 'flex',
        height: '64px',
        padding: '0 24px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        borderRadius: '16px',
        background: 'rgba(242, 244, 254, 0.12)',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => setOpen(!open)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          width: hasSelectedDates ? 'auto' : '160px',
          transition: 'width 0.3s ease-in-out',
          color: hasSelectedDates ? '#FFFFFF' : 'rgba(255, 255, 255, 0.64)',
          fontFamily: 'Lato',
          fontSize: hasSelectedDates ? '28px' : '20px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '36px',
          userSelect: 'none',
        }}
      >
        {hasSelectedDates ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}` : 'Select Dates'}
      </div>

      {/* Divider */}
      <div
        style={{
          width: '1px',
          height: '24px',
          borderRadius: '2px',
          background: 'rgba(255, 255, 255, 0.16)',
        }}
      />
      {/* Calendar Icon */}
      <div
        style={{
          width: '32px',
          height: '32px',
          aspectRatio: '1 / 1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={calendar} alt="Calendar Icon" />
      </div>

      {/* Popup Calendar */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            right: '-10%',
            zIndex: 9999,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateChange}
            inline
          />
        </div>
      )}
    </div>
  );
}

export default TripDurationPicker;
