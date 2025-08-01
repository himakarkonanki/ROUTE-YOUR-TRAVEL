import React, { useState, useEffect } from 'react';
import more from '../assets/icons/more_horiz.svg';
import addRow from '../assets/icons/add_row_above.svg';
import addbelow from '../assets/icons/add_row_below.svg';
import del from '../assets/icons/delete.svg';

const ReusableTable = ({ 
    initialData = null, 
    onDataChange = null, 
    columns = 2, 
    rows = 3, 
    headerPlaceholder = "Table Title",
    cellPlaceholder = "Type here",
    className = "",
    style = {},
    headerStyle = {},
    cellStyle = {},
    containerStyle = {},
    onMoreClick = null,
    onTableRemove = null
}) => {
    // Initialize table data based on props
    const [tableData, setTableData] = useState(() => {
        if (initialData) {
            return initialData;
        }
        
        // Create default structure: header row + data rows
        const defaultData = Array(rows + 1).fill(null).map(() => 
            Array(columns).fill('')
        );
        return defaultData;
    });

    const [showMoreTray, setShowMoreTray] = useState(false);
    const [selectedCell, setSelectedCell] = useState({ rowIndex: null, colIndex: null });

    // Update parent component when data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange(tableData);
        }
    }, [tableData, onDataChange]);

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newTableData = [...tableData];
        newTableData[rowIndex][colIndex] = value;
        setTableData(newTableData);
    };

    const handleMoreClick = () => {
        setShowMoreTray(!showMoreTray);
        if (onMoreClick) {
            onMoreClick();
        }
    };

    const handleCellClick = (rowIndex, colIndex) => {
        // Don't select header row cells (index 0)
        if (rowIndex > 0) {
            if (selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex) {
                setSelectedCell({ rowIndex: null, colIndex: null }); // Deselect if same cell clicked
                setShowMoreTray(false); // Hide tray when deselecting
            } else {
                setSelectedCell({ rowIndex, colIndex });
                setShowMoreTray(false); // Hide tray when selecting different cell
            }
        }
    };

    const addRowAbove = () => {
        if (selectedCell.rowIndex !== null) {
            const newRow = Array(columns).fill('');
            const newTableData = [...tableData];
            newTableData.splice(selectedCell.rowIndex, 0, newRow);
            setTableData(newTableData);
        }
        setShowMoreTray(false);
    };

    const addRowBelow = () => {
        if (selectedCell.rowIndex !== null) {
            const newRow = Array(columns).fill('');
            const newTableData = [...tableData];
            newTableData.splice(selectedCell.rowIndex + 1, 0, newRow);
            setTableData(newTableData);
        }
        setShowMoreTray(false);
    };

    const removeRow = () => {
        if (selectedCell.rowIndex !== null && tableData.length > 2) {
            const newTableData = [...tableData];
            newTableData.splice(selectedCell.rowIndex, 1);
            setTableData(newTableData);
            setSelectedCell({ rowIndex: null, colIndex: null });
        }
        setShowMoreTray(false);
    };

    const removeTable = () => {
        if (onTableRemove) {
            onTableRemove();
        }
        setShowMoreTray(false);
    };

    // Close tray when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMoreTray && !event.target.closest('.more-tray-container')) {
                setShowMoreTray(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMoreTray]);

    // Default styles (can be overridden by props)
    const defaultContainerStyle = {
        display: 'flex',
        padding: '32px 0',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
        alignSelf: 'stretch',
        width: '100%',
        position: 'relative',
        ...containerStyle
    };

    const defaultTableStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        borderRadius: '12px',
        width: '100%',
        minWidth: '800px',
        ...style
    };

    const defaultHeaderStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        borderRadius: '12px 12px 0 0',
        background: '#0E1328',
        width: '100%',
        ...headerStyle
    };

    const defaultCellStyle = {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontFamily: 'Lato',
        width: '100%',
        ...cellStyle
    };

    return (
        <div className={className} style={defaultContainerStyle}>
            {/* More Icon - Only show when a cell is selected */}
            {selectedCell.rowIndex !== null && selectedCell.colIndex !== null && (
                <div
                    className="more-tray-container"
                    style={{
                        display: 'inline-flex',
                        height: '20px',
                        padding: '0 4px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        flexShrink: 0,
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        background: '#333',
                        boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.08)',
                        cursor: 'pointer',
                        position: 'absolute',
                        left: '-50px',
                        top: '48px',
                        zIndex: 10,
                    }}
                    onClick={handleMoreClick}
                >
                    <img 
                        src={more} 
                        alt="more options" 
                        style={{
                            width: '24px',
                            height: '24px',
                            aspectRatio: '1/1',
                        }}
                    />
                </div>
            )}

            {/* More Options Tray - Only show when both cell is selected and tray is toggled */}
            {selectedCell.rowIndex !== null && selectedCell.colIndex !== null && showMoreTray && (
                <div
                    className="more-tray-container"
                    style={{
                        display: 'flex',
                        width: '181px',
                        padding: '8px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '4px',
                        borderRadius: '12px',
                        background: '#0E1328',
                        boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.24)',
                        position: 'absolute',
                        left: '-50px',
                        top: '80px',
                        zIndex: 20,
                    }}
                >
                    {/* Add Row Above */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            width: '100%',
                            transition: 'background 0.2s ease',
                        }}
                        onClick={addRowAbove}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div style={{ width: '20px', height: '20px' }}>
                            <img src={addRow} alt='add row above' style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div
                            style={{
                                flex: '1 0 0',
                                color: '#FFF',
                                fontFamily: 'Lato',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: '24px',
                            }}
                        >
                            Add Row Above
                        </div>
                    </div>

                    {/* Add Row Below */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            width: '100%',
                            transition: 'background 0.2s ease',
                        }}
                        onClick={addRowBelow}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div style={{ width: '20px', height: '20px' }}>
                            <img src={addbelow} alt='add row below' style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div
                            style={{
                                flex: '1 0 0',
                                color: '#FFF',
                                fontFamily: 'Lato',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: '24px',
                            }}
                        >
                            Add Row Below
                        </div>
                    </div>

                    {/* Remove Row */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            cursor: tableData.length > 2 ? 'pointer' : 'not-allowed',
                            opacity: tableData.length > 2 ? 1 : 0.5,
                            borderRadius: '8px',
                            width: '100%',
                            transition: 'background 0.2s ease',
                        }}
                        onClick={tableData.length > 2 ? removeRow : undefined}
                        onMouseEnter={(e) => {
                            if (tableData.length > 2) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div style={{ width: '20px', height: '20px' }}>
                            <img src={del} alt='remove row' style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div
                            style={{
                                flex: '1 0 0',
                                color: '#FFF',
                                fontFamily: 'Lato',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: '24px',
                            }}
                        >
                            Remove Row
                        </div>
                    </div>

                    {/* Remove Table */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            width: '100%',
                            transition: 'background 0.2s ease',
                        }}
                        onClick={removeTable}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div style={{ width: '20px', height: '20px' }}>
                            <img src={del} alt='remove table' style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div
                            style={{
                                flex: '1 0 0',
                                color: '#EE4A4D',
                                fontFamily: 'Lato',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                lineHeight: '24px',
                            }}
                        >
                            Remove Table
                        </div>
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div style={defaultTableStyle}>
                {/* Header Row */}
                <div style={defaultHeaderStyle}>
                    {Array(columns).fill(null).map((_, colIndex) => (
                        <div
                            key={`header-${colIndex}`}
                            style={{
                                display: 'flex',
                                padding: '16px 20px',
                                alignItems: 'center',
                                gap: '8px',
                                flex: '1 0 0',
                            }}
                        >
                            <input
                                type="text"
                                // ADDED: id and name attributes for header cells
                                id={`table-header-${colIndex}`}
                                name={`table-header-${colIndex}`}
                                value={tableData[0][colIndex]}
                                onChange={(e) => handleCellChange(0, colIndex, e.target.value)}
                                placeholder={headerPlaceholder}
                                style={{
                                    ...defaultCellStyle,
                                    color: '#FFFFFF',
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    lineHeight: '28px',
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Data Rows */}
                {tableData.slice(1).map((row, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        style={{
                            display: 'flex',
                            padding: '0 8px',
                            alignItems: 'flex-start',
                            alignSelf: 'stretch',
                            background: '#FFF',
                            width: '100%',
                        }}
                    >
                        {row.map((cell, colIndex) => (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                style={{
                                    display: 'flex',
                                    padding: '4px',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flex: '1 0 0',
                                    borderBottom: rowIndex === tableData.length - 2 ? 'none' : '1px solid rgba(14, 19, 40, 0.12)',
                                    minHeight: '56px',
                                }}
                                onClick={() => handleCellClick(rowIndex + 1, colIndex)}
                            >
                                <input
                                    type="text"
                                    // ADDED: id and name attributes for data cells
                                    id={`table-cell-${rowIndex + 1}-${colIndex}`}
                                    name={`table-cell-${rowIndex + 1}-${colIndex}`}
                                    value={cell}
                                    onChange={(e) => handleCellChange(rowIndex + 1, colIndex, e.target.value)}
                                    placeholder={cellPlaceholder}
                                    style={{
                                        ...defaultCellStyle,
                                        color: '#0E1328',
                                        fontSize: '18px',
                                        fontWeight: 400,
                                        lineHeight: '24px',
                                        padding: '12px 16px 12px 8px',
                                        // Individual cell highlighting
                                        border: selectedCell.rowIndex === rowIndex + 1 && selectedCell.colIndex === colIndex 
                                            ? '2px solid #0E1328' 
                                            : '2px solid #FFF',
                                        borderRadius: selectedCell.rowIndex === rowIndex + 1 && selectedCell.colIndex === colIndex 
                                            ? '8px' 
                                            : '4px',
                                        background: selectedCell.rowIndex === rowIndex + 1 && selectedCell.colIndex === colIndex 
                                            ? '#F0F8FF' 
                                            : 'transparent',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onFocus={() => handleCellClick(rowIndex + 1, colIndex)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReusableTable;
