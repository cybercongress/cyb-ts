import { Tab } from '@cybercongress/gravity';

function Btn({ onSelect, checkedSwitch, text, ...props }) {
  return (
    <Tab
      isSelected={checkedSwitch}
      onSelect={onSelect}
      color="#36d6ae"
      boxShadow="0px 0px 10px #36d6ae"
      minWidth="100px"
      marginX={0}
      paddingX={10}
      paddingY={10}
      fontSize="18px"
      height={42}
      {...props}
    >
      {text}
    </Tab>
  );
}

// eslint-disable-next-line import/prefer-default-export
export { Btn };
