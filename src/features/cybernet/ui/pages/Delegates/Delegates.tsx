import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';
import useCybernetTexts from '../../useCybernetTexts';
import { useDelegates } from '../../hooks/useDelegate';
import DelegatesTable from './DelegatesTable/DelegatesTable';

function Delegates() {
  const { loading, error } = useDelegates();

  const { getText } = useCybernetTexts();

  useAdviserTexts({
    isLoading: loading,
    loadingText: `loading ${getText('delegate', true)}`,
    error: error?.message,
    defaultText: `choose ${getText('delegate')} for learning`,
  });

  return (
    <Display
      noPaddingX
      noPaddingY
      title={<DisplayTitle title={getText('delegate', true)} />}
    >
      <DelegatesTable />
    </Display>
  );
}

export default Delegates;
