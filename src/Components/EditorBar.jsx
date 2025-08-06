
import React from 'react';
import addRow from '../assets/icons/add_row_above.svg';
import addbelow from '../assets/icons/add_row_below.svg';
import del from '../assets/icons/delete.svg';

const optionStyle = {
  display: 'flex',
  width: '181px',
  padding: '8px',
  alignItems: 'center',
  gap: '8px',
  borderRadius: '12px',
  background: '#0E1328',
  boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.24)',
  cursor: 'pointer',
  transition: 'background 0.15s',
  marginBottom: '8px',
};

const iconStyle = {
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const textStyle = {
  color: '#FFF',
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
};

const removeTableTextStyle = {
  ...textStyle,
  color: '#EE4A4D',
};

function EditorBar({ onAddRowAbove, onAddRowBelow, onRemoveRow, onRemoveTable }) {
  // Inline style for hover effect
  const [hovered, setHovered] = React.useState(null);

  const getBg = (idx) =>
    hovered === idx ? { background: '#232949' } : {};
  const getTextColor = (idx) =>
    idx === 3
      ? { color: '#EE4A4D' }
      : hovered === idx
      ? { color: '#FFF' }
      : { color: '#FFF' };

  // All icons white except for delete (Remove table), which is red (no filter)
  const getIconFilter = (idx) =>
    idx === 3 ? '' : 'invert(1)';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        background: 'rgba(14,19,40,0.98)',
        borderRadius: '16px',
        boxShadow: '0 3px 8px 0 rgba(0,0,0,0.24)',
        padding: '8px 0',
        minWidth: '181px',
        zIndex: 20,
      }}
    >
      {/* Add Row Above */}
      <div
        onClick={onAddRowAbove}
        style={{ ...optionStyle, ...getBg(0) }}
        onMouseEnter={() => setHovered(0)}
        onMouseLeave={() => setHovered(null)}
      >
        <div style={iconStyle}>
          <img src={addRow} alt="add row above" style={{ width: 16, height: 16, filter: 'invert(1)' }} />
        </div>
        <div style={{ ...textStyle, ...getTextColor(0) }}>Add row to up</div>
      </div>

      {/* Add Row Below */}
      <div
        onClick={onAddRowBelow}
        style={{ ...optionStyle, ...getBg(1) }}
        onMouseEnter={() => setHovered(1)}
        onMouseLeave={() => setHovered(null)}
      >
        <div style={iconStyle}>
          <img src={addbelow} alt="add row below" style={{ width: 16, height: 16, filter: 'invert(1)' }} />
        </div>
        <div style={{ ...textStyle, ...getTextColor(1) }}>Add row to down</div>
      </div>

      {/* Remove Row */}
      <div
        onClick={onRemoveRow}
        style={{ ...optionStyle, ...getBg(2) }}
        onMouseEnter={() => setHovered(2)}
        onMouseLeave={() => setHovered(null)}
      >
        <div style={iconStyle}>
          <img src={del} alt="remove row" style={{ width: 16, height: 16, filter: getIconFilter(2) }} />
        </div>
        <div style={{ ...textStyle, ...getTextColor(2) }}>Remove row</div>
      </div>

      {/* Remove Table */}
      <div
        onClick={onRemoveTable}
        style={{ ...optionStyle, ...getBg(3) }}
        onMouseEnter={() => setHovered(3)}
        onMouseLeave={() => setHovered(null)}
      >
        <div style={iconStyle}>
          <img src={del} alt="delete table" style={{ width: 16, height: 16 }} />
        </div>
        <div style={removeTableTextStyle}>Remove table</div>
      </div>
    </div>
  );
}

export default EditorBar;
