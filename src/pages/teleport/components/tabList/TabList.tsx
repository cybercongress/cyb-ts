import { TabButton, TabList } from 'src/components';
import { TypePages } from '../../type';

type TabListProps = {
  selected: TypePages;
};

function TabListTeleport({ selected }: TabListProps) {
  return (
    <TabList>
      <TabButton
        selected={selected}
        options={Object.keys(TypePages).map((key) => ({ to: key, text: key }))}
      />
    </TabList>
  );
}

export default TabListTeleport;
