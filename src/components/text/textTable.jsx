import { Text } from '@cybercongress/gravity';

function TextTable({ children, fontSize, color, display, ...props }) {
  return (
    <Text
      fontSize={`${fontSize || 16}px`}
      color={`${color || '#fff'}`}
      display={`${display || 'inline-flex'}`}
      alignItems="center"
      {...props}
    >
      {children}
    </Text>
  );
}

export default TextTable;
