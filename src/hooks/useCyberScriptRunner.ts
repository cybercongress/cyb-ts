import { useEffect, useState } from 'react';
import { useCyberScriptEngine } from 'src/contexts/cyberScriptEngine';

type cyberScriptStatus = 'pending' | 'running' | 'done' | 'error';
export type scriptType = 'particle' | 'search';
type UseCyberScriptReturn = {
  result: any;
  status: cyberScriptStatus;
  run: (code: scriptType, params: any) => void;
};

function useCyberScriptRunner(): UseCyberScriptReturn {
  const [result, setResult] = useState([]);
  const [status, setStatus] = useState<cyberScriptStatus>('pending');
  const [scriptType, setScriptType] = useState<string | undefined>();
  const [params, setParams] = useState<{}>();
  const { isLoaded, runScript } = useCyberScriptEngine();

  useEffect(() => {
    try {
      const executeScript = async () => {
        console.log('----useCyberScripts', isLoaded, scriptType, params);

        if (isLoaded && scriptType && params) {
          setStatus('running');
          // let result = cyb::getPassportByNickname("dasein").await;
          const injectCode = `react_to_particle("${params?.cid}", "${params?.contentType}", "${params?.preview}")`;
          const content = `
pub async fn main(refId) {
  cyb::log("testtttttt" + refId);
  let result = ${injectCode}.await;
  // cyb::log("inside "+result);
  callback();
  result
}`;
          const result = await runScript(content, console.log, 'abrrrrrrrrr');

          console.log('--res', result);
          setResult(result);
          setStatus('done');
        }
      };
      executeScript();
    } catch (e) {
      console.log('Python execute error', e);
      setStatus('error');
    }

    return () => {
      // rp.vmStore.destroy('main');
      console.log('destroy');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, scriptType, params]);

  return {
    result,
    status,
    run: (scriptType: scriptType, params: any) => {
      setScriptType(scriptType);
      setParams(params);
    },
  };
}

export default useCyberScriptRunner;
