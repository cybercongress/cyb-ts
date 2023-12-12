import { TabList } from 'src/components';
import { TypePages } from '../../type';

type TabListProps = {
  selected: TypePages;
};

function TabListTeleport({ selected }: TabListProps) {
  return (
    <TabList
      selected={selected}
      options={Object.keys(TypePages).map((key) => ({ to: key, key }))}
    />
  );
}

export default TabListTeleport;
