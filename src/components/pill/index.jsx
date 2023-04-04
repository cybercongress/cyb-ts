import { Pane } from '@cybercongress/gravity';

function PillNumber({ children, active, ...props }) {
  return (
    <Pane
      display="flex"
      fontSize="14px"
      borderRadius="20px"
      paddingY="5px"
      paddingX="8px"
      alignItems="center"
      lineHeight="1"
      justifyContent="center"
      backgroundColor={active ? '#000' : '#36d6ae'}
      color={active ? '#36d6ae' : '#000'}
      {...props}
    >
      {children}
    </Pane>
  );
}

export default PillNumber;
