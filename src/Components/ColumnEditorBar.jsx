import React from 'react'
import addColumn from '../assets/icons/add_row_above.svg' // You'll need left column icon
import addColumnRight from '../assets/icons/add_row_below.svg' // You'll need right column icon
import del from '../assets/icons/delete.svg'

function ColumnEditorBar({ onAddColumnLeft, onAddColumnRight, onRemoveColumn }) {
    return (
        <div
            style={{
                background: '#0E1328',
                borderRadius: '16px',
                boxShadow: '0 3px 8px 0 rgba(0,0,0,0.24)',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: '220px',
                alignItems: 'stretch',
            }}
        >
            <style>{`
                .col-editor-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-radius: 8px;
                    padding: 10px 16px;
                    font-family: Lato, sans-serif;
                    font-size: 17px;
                    font-weight: 500;
                    line-height: 24px;
                    color: #FFF;
                    background: transparent;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .col-editor-btn:hover {
                    background: rgba(255,255,255,0.06);
                }
                .col-editor-btn img {
                    width: 20px;
                    height: 20px;
                    filter: none;
                    transition: filter 0.15s;
                }
                .col-editor-btn.remove {
                    color: #EE4A4D;
                }
                .col-editor-btn.remove img {
                    filter: invert(36%) sepia(97%) saturate(749%) hue-rotate(330deg) brightness(97%) contrast(92%);
                }
            `}</style>
            {/* Add Column Left */}
            <div className="col-editor-btn" onClick={onAddColumnLeft}>
                <img src={addColumn} alt='add column left' />
                Add column to left
            </div>
            {/* Add Column Right */}
            <div className="col-editor-btn" onClick={onAddColumnRight}>
                <img src={addColumnRight} alt='add column right' />
                Add column to right
            </div>
            {/* Remove Column */}
            <div className="col-editor-btn remove" onClick={onRemoveColumn}>
                <img src={del} alt='remove column' />
                Remove column
            </div>
        </div>
    )
}

export default ColumnEditorBar
