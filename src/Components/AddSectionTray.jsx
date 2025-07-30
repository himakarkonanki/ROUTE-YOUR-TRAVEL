// AddSectionTray.js
import React, { useState, useRef, useEffect } from 'react';
import add from '../assets/icons/add_circle.svg';
import close from '../assets/icons/close.svg';
import hotel from '../assets/icons/hotel.svg';
import fork_spoon from '../assets/icons/fork_spoon.svg';
import table from '../assets/icons/table.svg';
import flightland from '../assets/icons/flight_land.svg';
import interest from '../assets/icons/interests.svg';
import taxi from '../assets/icons/local_taxi.svg';

const ICON_OPTIONS = {
    PlaneLanding: flightland,
    Landmark: interest,
    CarFront: taxi,
    Hotel: hotel,
    Restaurant: fork_spoon,
    Table: table,
};

const SECTION_OPTIONS = [
    { value: 'PlaneLanding', label: 'Flight', heading: 'Arrival' },
    { value: 'Landmark', label: 'Activity', heading: 'Activities' },
    { value: 'CarFront', label: 'Car', heading: 'Transfer' },
    { value: 'Hotel', label: 'Hotel', heading: 'Hotel' },
    { value: 'Restaurant', label: 'Restaurant', heading: 'Dining' },
    { value: 'Table', label: 'Table', heading: 'Table' },
];

function AddSectionTray({ onAddSection }) {
    const [showAddSectionTray, setShowAddSectionTray] = useState(false);
    const trayRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (trayRef.current && !trayRef.current.contains(event.target)) {
                setShowAddSectionTray(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddSection = (sectionType) => {
        const selectedOption = SECTION_OPTIONS.find(opt => opt.value === sectionType);
        const newSection = {
            id: Date.now(),
            type: sectionType,
            heading: selectedOption.heading,
            details: '',
            icon: sectionType
        };
        onAddSection(newSection);
        setShowAddSectionTray(false);
    };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            paddingLeft: '34px',
            alignSelf: 'stretch',
            position: 'relative',
        }}>
            {/* Add Section Button */}
            <div 
                onClick={() => setShowAddSectionTray(!showAddSectionTray)}
                style={{
                    display: 'flex',
                    padding: '16px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '28px',
                    background: '#F2F4FE',
                    cursor: 'pointer',
                }}
            >
                <div style={{
                    width: '24px',
                    height: '24px',
                    aspectRatio: '1 / 1',
                }}>
                    <img src={add} alt='add icon' />
                </div>
                <div style={{
                    color: '#0E1328',
                    fontFamily: 'Lato',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '24px',
                    textTransform: 'uppercase',
                }}>
                    Add Section
                </div>
            </div>

            {/* Horizontal Tray */}
            {showAddSectionTray && (
                <div
                    ref={trayRef}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 16px',
                        borderRadius: '40px',
                        background: '#FFFFFF',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        overflowX: 'auto',
                    }}
                >
                    {/* Close icon */}
                    <img
                        src={close}
                        alt="close"
                        width={20}
                        height={20}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowAddSectionTray(false)}
                    />

                    {/* Section tiles */}
                    {SECTION_OPTIONS.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleAddSection(option.value)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Icon holder */}
                            <div
                                style={{
                                    display: 'flex',
                                    padding: '16px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '28px',
                                    background: '#F2F4FE',
                                }}
                            >
                                <img
                                    src={ICON_OPTIONS[option.value]}
                                    alt={option.label}
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <span
                                style={{
                                    fontFamily: 'Lato',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#374151',
                                }}
                            >
                                {option.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddSectionTray;
