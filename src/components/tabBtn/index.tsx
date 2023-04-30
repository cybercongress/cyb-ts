import { Link } from 'react-router-dom';
import { Tab } from '@cybercongress/gravity';

export type TabBtnProps = {
  key: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  to: string;
};

function TabBtn({ key, text, isSelected, onSelect, to }: TabBtnProps) {
  return (
    <Link to={to}>
      <Tab
        key={key}
        style={{
          textTransform: 'lowercase',
        }}
        isSelected={isSelected}
        onSelect={onSelect}
        paddingX={10}
        paddingY={20}
        marginX={3}
        borderRadius={5}
        color="#36d6ae"
        boxShadow="0px 0px 5px #36d6ae"
        fontSize="16px"
        whiteSpace="nowrap"
        width="100%"
      >
        {text}
      </Tab>
    </Link>
  );
}

export default TabBtn;
