import { MainContainer, NoItems } from 'src/components';
import { useCyberClient } from 'src/contexts/queryCyberClient';
import Loader2 from 'src/components/ui/Loader2';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import Code from './code';
import ActionBar from './actionBar';

import styles from './styles.scss';

function Codes() {
  const { hooks } = useCyberClient();

  const { data, isLoading, error, refetch } = hooks.cosmwasm.wasm.v1.useCodes({
    request: {},
  });

  useAdviserTexts({
    defaultText: 'Codes',
    error: error?.message,
    isLoading,
  });

  const codes = data?.codeInfos?.reverse() || [];

  return (
    <>
      <MainContainer>
        <div className={styles.containerCodes}>
          {isLoading ? (
            <Loader2 />
          ) : codes.length > 0 ? (
            codes.map((item) => {
              return <Code data={item} key={item.id} />;
            })
          ) : (
            <NoItems text="No codes found" />
          )}
        </div>
      </MainContainer>
      <ActionBar updateFnc={refetch} />
    </>
  );
}

export default Codes;
