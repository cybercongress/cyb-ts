import React, { useState } from 'react';

const RowTableTakeoff = ({
  item,
  children,
  pinAddress,
  statePin,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="container-row-pin-padding0">
        <div
          {...props}
          onClick={() => setOpen(!open)}
          className={`table-rows-box ${
            pinAddress ? 'table-rows-box-open' : ''
          }`}
        >
          {children}
        </div>
      </div>
      <div className={`box ${open ? 'open' : 'close'}`}>{item}</div>
    </div>
  );
};

export default RowTableTakeoff;
