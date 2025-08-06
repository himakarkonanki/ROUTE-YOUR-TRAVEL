import React from 'react'
import addRow from '../assets/icons/add_row_above.svg'
import addbelow from '../assets/icons/add_row_below.svg'
import del from '../assets/icons/delete.svg'

function EditorBar({ onAddRowAbove, onAddRowBelow, onRemoveRow, onRemoveTable }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}
        >
            {/* Add Row Above */}
            <div
                onClick={onAddRowAbove}
                style={{
                    display: 'flex',
                    width: '181px',
                    padding: '8px',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    background: '#0E1328',
                    boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.24)',
                    cursor: 'pointer',
                }}
            >
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={addRow} alt='add row above' style={{ width: '16px', height: '16px' }} />
                </div>
                <div style={{ color: '#FFF', fontFamily: 'Lato', fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}>
                    Add row to up
                </div>
            </div>

            {/* Add Row Below */}
            <div
                onClick={onAddRowBelow}
                style={{
                    display: 'flex',
                    width: '181px',
                    padding: '8px',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    background: '#0E1328',
                    boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.24)',
                    cursor: 'pointer',
                }}
            >
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={addbelow} alt='add row below' style={{ width: '16px', height: '16px' }} />
                </div>
                <div style={{ color: '#FFF', fontFamily: 'Lato', fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}>
                    Add row to down
                </div>
            </div>

            {/* Remove Row */}
            <div
                onClick={onRemoveRow}
                style={{
                    display: 'flex',
                    width: '181px',
                    padding: '8px',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    background: '#0E1328',
                    boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.24)',
                    cursor: 'pointer',
                }}
            >
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={del} alt='remove row' style={{ width: '16px', height: '16px' }} />
                </div>
                <div style={{ color: '#FFF', fontFamily: 'Lato', fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}>
                    Remove row
                </div>
            </div>

            {/* Remove Table */}
            <div
                onClick={onRemoveTable}
                style={{
                    display: 'flex',
                    width: '181px',
                    padding: '8px',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '12px',
                    background: '#0E1328',
                    boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.24)',
                    cursor: 'pointer',
                }}
            >
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={del} alt='delete table' style={{ width: '16px', height: '16px' }} />
                </div>
                <div style={{ color: '#EE4A4D', fontFamily: 'Lato', fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}>
                    Remove table
                </div>
            </div>
        </div>
    )
}

export default EditorBar
