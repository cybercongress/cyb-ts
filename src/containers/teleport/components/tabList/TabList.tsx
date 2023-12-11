import { useNavigate } from 'react-router-dom';
import { TabButton, TabList } from 'src/components';
import { Position } from 'src/components/tabButton/TabButton';
import { TypePages } from '../../type';

type TabListProps = {
  selected: TypePages;
};

function TabListTeleport({ selected }: TabListProps) {
  const navigate = useNavigate();

  return (
    <TabList>
      {Object.keys(TypePages).map((key, index) => {
        let type;

        if (index === 0) {
          type = Position.Left;
        }

        if (index === Object.keys(TypePages).length - 1) {
          type = Position.Right;
        }

        return (
          <TabButton
            key={key}
            type={type}
            isSelected={selected === key}
            onSelect={() => navigate(key)}
          >
            {key}
          </TabButton>
        );
      })}
    </TabList>
  );
}

export default TabListTeleport;
