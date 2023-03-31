import { Button } from '@cybercongress/gravity';

function ButtonImgText({ img, text = 'Send', ...props }) {
  return (
    <Button marginX={10} {...props}>
      {text}{' '}
      {img && (
        <img
          style={{
            width: 20,
            height: 20,
            marginLeft: '5px',
            paddingTop: '2px',
            objectFit: 'contain',
          }}
          src={img}
          alt="img"
        />
      )}
    </Button>
  );
}

export default ButtonImgText;
