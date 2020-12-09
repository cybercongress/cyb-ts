import React from 'react';
import { Button } from '@cybercongress/gravity';

const ButtonImgText = ({ img, text = 'Send', ...props }) => (
  <Button marginX={10} {...props}>
    {text}{' '}
    {img && (
      <img
        style={{
          width: 20,
          height: 20,
          marginLeft: '5px',
          paddingTop: '2px',
        }}
        src={img}
        alt="img"
      />
    )}
  </Button>
);

export default ButtonImgText;
