import React from 'react'
import addRow from '../assets/icons/add_row_above.svg'
import addbelow from '../assets/icons/add_row_.svg'
import del from '../assets/icons/delete.svg'

function EditorBar() {
    return (
        <div
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
            }}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                }}
            >
                <img src={addRow} alt='add row' />
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
                Add Row to up
            </div>


        </div>

    )
}

export default EditorBar