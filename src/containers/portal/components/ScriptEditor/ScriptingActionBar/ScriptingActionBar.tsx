import { useState } from 'react';
import { AppIPFS } from 'src/utils/ipfs/ipfs';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import {
  isCID,
  getTextFromIpfsContent,
  getIpfsTextContent,
} from 'src/utils/ipfs/helpers';

import { Controlled as CodeMirror } from 'react-codemirror2';

import ActionBarContainer from 'src/components/actionBar';
import { Button, Input } from 'src/components';
import { Pane } from '@cybercongress/gravity';

import { ScriptExecutionResult } from 'src/types/scripting';

import StepsBar from '../StepsBar/StepsBar';

import { highlightErrors, compileScript } from '../utils';

import styles from '../ScriptEditor.module.scss';

function ScriptingActionBar({
  isChanged,
  nickname,
  node,

  addToLog,
  onSaveClick,
  onCancelClick,
  resetPlayGround,
  resetToDefault,
  compileAndTest,
}: {
  isChanged: boolean;
  nickname: string;
  node: AppIPFS;
  addToLog: (log: string[]) => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  resetPlayGround: () => void;
  resetToDefault: () => void;
  compileAndTest: (name: string, params?: any) => void;
}) {
  const [testCid, seTestCid] = useState('');

  const [actionBarStep, setActionBarStep] = useState(0);

  const onTestMoonDomainClick = async () => {
    resetPlayGround();

    compileAndTest('moon_domain_resolver');
    setActionBarStep(0);
  };

  const onTestClick = async () => {
    resetPlayGround();

    if (!isCID(testCid)) {
      addToLog([`🚫 '${testCid}' - is not correct CID.`]);
      return;
    }
    addToLog([
      '💡 Prepare data....',
      '',
      `🚧 Fetching particle '${testCid}'...`,
    ]);

    const { contentType = '???', content = '' } = await getIpfsTextContent(
      node,
      testCid
    );
    const preview =
      content.length > 144 ? `${content.slice(1, 144)}....` : content;

    addToLog([
      `   ☑️ Content-type: ${contentType}`,
      `   ☑️ Preview: ${preview}`,
      '',
      '💭 Execute script....',
    ]);

    compileAndTest('personal_processor', {
      cid: testCid,
      contentType,
      content,
    });
    setActionBarStep(0);
  };

  const onTestPersonalProcessorClick = () => setActionBarStep(2);

  const onTestStepClick = () => setActionBarStep(1);

  const actionBarSteps = [
    <div key="step_0" className={styles.stepWraperJustified}>
      <Button onClick={onTestStepClick}>test cybscript</Button>

      <Button onClick={resetToDefault}>reset to default</Button>
    </div>,
    <div key="step_1" className={styles.stepWrapper}>
      <Button
        onClick={onTestMoonDomainClick}
      >{`test ${nickname}.moon resolver`}</Button>
      <Button onClick={onTestPersonalProcessorClick}>
        test personal processor
      </Button>
    </div>,
    <div key="step_2" className={styles.stepWrapper}>
      <Input
        value={testCid}
        onChange={(e) => seTestCid(e.target.value)}
        placeholder="Enter particle CID to apply script...."
      />
      <Button onClick={onTestClick}>Test particle processor</Button>
    </div>,
  ];

  return (
    <ActionBarContainer
      additionalButtons={
        isChanged
          ? [
              { text: 'cancel', onClick: onCancelClick },
              { text: 'save', onClick: onSaveClick },
            ]
          : []
      }
    >
      <Pane className={styles.actionPanel}>
        <StepsBar
          steps={actionBarSteps}
          currentStep={actionBarStep}
          setCurrentStep={(value) => setActionBarStep(value)}
        />
      </Pane>
    </ActionBarContainer>
  );
}

export default ScriptingActionBar;
