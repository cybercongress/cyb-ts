import UnderConstruction from '../UnderConstruction/UnderConstruction';
import { useAdviser } from 'src/features/adviser/context';
import { useEffect } from 'react';

function Karma() {
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        the invisible power of cyber graph influence <br />
        more karma more particles weight
      </>
    );
  }, [setAdviser]);

  return <UnderConstruction />;
}

export default Karma;
