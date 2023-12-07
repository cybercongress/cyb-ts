import style from './TabList.module.scss';

type Props = {
  children: React.ReactNode;
};

function TabList({ children }: Props) {
  return <div className={style.wrapper}>{children}</div>;
}

export default TabList;
