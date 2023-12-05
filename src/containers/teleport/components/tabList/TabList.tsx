import { useNavigate } from 'react-router-dom';

import ButtonTeleport from 'src/containers/warp/components/buttonGroup/indexBtn';
import { TypePages } from '../../type';
import s from './TabList.module.scss';

type TabListProps = {
  selected: TypePages;
};

function TabList({ selected }: TabListProps) {
  const navigate = useNavigate();

  const handleHistory = (to: string) => {
    navigate(to);
  };

  return (
    <div className={s.wrapper}>
      <ButtonTeleport
        status="left"
        isSelected={selected === TypePages.swap}
        onClick={() => handleHistory(TypePages.swap)}
      >
        {TypePages.swap}
      </ButtonTeleport>
      <ButtonTeleport
        status="center"
        isSelected={selected === TypePages.bridge}
        onClick={() => handleHistory(TypePages.bridge)}
      >
        {TypePages.bridge}
      </ButtonTeleport>
      <ButtonTeleport
        status="right"
        isSelected={selected === TypePages.send}
        onClick={() => handleHistory(TypePages.send)}
      >
        {TypePages.send}
      </ButtonTeleport>
    </div>
  );
}

export default TabList;
