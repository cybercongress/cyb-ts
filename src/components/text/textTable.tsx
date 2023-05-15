import { Text } from '@cybercongress/gravity';

interface TextTableProps {
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  display?: string;
}

function TextTable({
  children,
  fontSize,
  color,
  display,
  ...props
}: TextTableProps) {
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
