import TabItem, { Position } from '../Tabs/TabItem';
import style from './TabList.module.scss';

type optionsProps = {
  to?: string;
  onClick?: () => void;
  key: string;
  text?: string;
};

export type Props = {
  options: optionsProps[];
  selected: string;
};

function TabList({ options, selected }: Props) {
  return (
    <div className={style.wrapper}>
      {options.map((item, index) => {
        const type =
          index === 0
            ? Position.Left
            : index === options.length - 1
            ? Position.Right
            : undefined;

        const isSelected = selected === item.key;
        return (
          <TabItem
            key={index}
            type={type}
            isSelected={isSelected}
            to={item.to}
            onClick={item.onClick}
            text={item.text || item.key}
          />
        );
      })}
    </div>
  );
}

export default TabList;
