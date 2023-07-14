import { Input, LinkWindow, ContainerGradient, Button } from '../../components';
import { MainContainer } from '../portal/components';
import BtnPasport from '../portal/pasport/btnPasport';
import Select from '../teleport/components/select';
import CodeSnipet from './ipfsComponents/codeSnipet';
import {
  ContainerKeyValue,
  renderOptions,
} from './ipfsComponents/utilsComponents';

const ipfsDaemon = `$ ipfs daemon
Initializing daemon... 
API server listening on /ip4/127.0.0.1/tcp/5001
`;

const ipfsHeaders = `$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'`;

function ErrorIpfsSettings({ stateErrorIpfsSettings }) {
  const {
    valueInput,
    valueSelect,
    setValueInput,
    dataOpts,
    onClickReConnect,
    onChangeSelect,
    pending,
    setNewUrl,
  } = stateErrorIpfsSettings;

  return (
    // <MainContainer>
    <div
      // title=""
      togglingDisable
      styleLampContent="red"
      style={{
        minHeight: 'auto',
        height: 'unset',
        display: 'grid',
        gap: '20px',
      }}
    >
      <h4>Could not connect to the IPFS API</h4>
      <ContainerKeyValue>
        <div>client</div>

        <Select
          width="300px"
          valueSelect={valueSelect}
          textSelectValue={valueSelect !== '' ? valueSelect : ''}
          onChangeSelect={(item) => onChangeSelect(item)}
          custom
          disabled={pending}
        >
          {renderOptions(dataOpts, valueSelect)}
        </Select>
      </ContainerKeyValue>

      <div>
        Check out the installation guide in the{' '}
        <LinkWindow to="https://docs.ipfs.tech/how-to/command-line-quick-start/">
          IPFS Docs
        </LinkWindow>{' '}
        , or try these common fixes:
      </div>
      <div>
        1. Is your IPFS daemon running? Try starting or restarting it from your
        terminal:
      </div>
      <CodeSnipet src={ipfsDaemon} />
      <div>
        2. Is your IPFS API configured to allow{' '}
        <LinkWindow to="https://github.com/ipfs/ipfs-webui#configure-ipfs-api-cors-headers">
          cross-origin (CORS)
        </LinkWindow>{' '}
        requests? If not, run these commands and then start your daemon from the
        terminal:
      </div>
      <CodeSnipet src={ipfsHeaders} />
      <div>
        3. Is your IPFS API on a port other than 5001? If your node is
        configured with a{' '}
        <LinkWindow to="https://github.com/ipfs/kubo/blob/master/docs/config.md#addresses">
          custom API address
        </LinkWindow>
        , enter it here.
      </div>
      {valueSelect === 'external' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px',
            gap: '20px',
            position: 'relative',
          }}
        >
          <BtnPasport
            style={{ maxWidth: '100px', position: 'static' }}
            typeBtn="blue"
            onClick={() => setNewUrl()}
          >
            edit
          </BtnPasport>
          <Input
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
        </div>
      )}

      <Button
        style={{ maxWidth: '100px' }}
        typeBtn="blue"
        onClick={() => onClickReConnect()}
      >
        reconnect
      </Button>
    </div>
    // </MainContainer>
  );
}

export default ErrorIpfsSettings;
