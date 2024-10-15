import { useAppSelector } from 'src/redux/hooks';
import styles from './Header.module.scss';
import HeaderSwapItem from './ui/HeaderSwapItem/HeaderSwapItem';
import HeaderItem from './ui/HeaderItem/HeaderItem';
import HeaderIbcItem from './ui/HeaderIbcItem/HeaderIbcItem';

function Header() {
  const { selectPlan } = useAppSelector((state) => state.energy);

  return (
    <div className={styles.containerHeader}>
      <HeaderItem title="token to spend">
        <span>choose token to spend</span>
      </HeaderItem>
      <HeaderItem title={`package ${selectPlan?.keyPackage}$`}>
        <HeaderSwapItem />
      </HeaderItem>
      <HeaderItem title="send to bostrom">
        <HeaderIbcItem />
      </HeaderItem>
    </div>
  );
}

export default Header;
