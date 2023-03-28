import { Pane } from '@cybercongress/gravity';
import { Copy, Tooltip } from '../../../components';
import { trimString, formatNumber, getDecimal } from '../../../utils/utils';

import imgLedger from '../../../image/ledger.svg';
import imgKeplr from '../../../image/keplr-icon.svg';
import imgMetaMask from '../../../image/mm-logo.svg';
import imgRead from '../../../image/duplicate-outline.svg';
import imgHelp from '../../../image/ionicons_svg_ios-help-circle-outline.svg';
import deleteIcon from '../../../image/trash-outline.svg';
import imgEth from '../../../image/Ethereum_logo_2014.svg';
import imgCyber from '../../../image/large-green.png';
import imgCosmos from '../../../image/cosmos-2.svg';

const imgData = {
  ledger: imgLedger,
  keplr: imgKeplr,
  MetaMask: imgMetaMask,
  'read-only': imgRead,
  cyber: imgCyber,
  cosmos: imgCosmos,
  eth: imgEth,
};

export function FormatNumber({ number, fontSizeDecimal, currency, ...props }) {
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 45px"
      gridGap="5px"
      {...props}
    >
      <Pane display="flex" alignItems="center">
        <span>{formatNumber(Math.floor(number))}</span>.
        <div style={{ width: 25, fontSize: `${fontSizeDecimal || 14}px` }}>
          {getDecimal(number)}
        </div>
      </Pane>
      <div>{currency}</div>
    </Pane>
  );
}

export function ButtonIcon({
  icon,
  onClickButtonIcon,
  width = 25,
  height = 25,
  customClass = '',
  textTooltip = '',
  ...props
}) {
  return (
    <Pane {...props}>
      {/* //   <Tooltip placement="bottom" tooltip={<Pane>{textTooltip}</Pane>}> */}
      <button
        className={`container-buttonIcon ${customClass}`}
        type="button"
        onClick={onClickButtonIcon}
      >
        <img src={icon} alt="edit" style={{ width, height }} />
      </button>
      {/* //   </Tooltip> */}
    </Pane>
  );
}

export function ContainerAddressInfo({ children, ...props }) {
  return (
    <Pane
      width="100%"
      display="grid"
      gridTemplateColumns="0.8fr 1fr"
      gridGap="5px"
      alignItems="baseline"
      className="cosmos-address-container"
      {...props}
    >
      {children}
    </Pane>
  );
}

function InfoAddress({ pk, hdpath, ...props }) {
  return (
    <Pane {...props}>
      <Tooltip
        placement="bottom"
        tooltip={
          <>
            {pk && <Pane>pk: {trimString(pk, 4, 4)}</Pane>}
            {hdpath && (
              <Pane>
                path:{' '}
                {`${hdpath[0]}/${hdpath[1]}/${hdpath[2]}/${hdpath[3]}/${hdpath[4]}`}
              </Pane>
            )}
          </>
        }
      >
        <img style={{ width: 15, height: 15 }} src={imgHelp} alt="imgHelp" />
      </Tooltip>
    </Pane>
  );
}

export function Address({
  address,
  addressLink,
  onClickDeleteAddress,
  network,
}) {
  return (
    <Pane
      className="cosmos-address"
      display="flex"
      marginBottom={5}
      alignItems="center"
    >
      <img
        style={{ width: 18, height: 15, marginRight: 8, objectFit: 'contain' }}
        src={imgData[network]}
        alt="imgAddress"
      />
      <img
        style={{ width: 15, height: 15, marginRight: 8, objectFit: 'contain' }}
        src={imgData[address.keys]}
        alt="imgAddress"
      />
      <Pane width={135}>{addressLink}</Pane>
      <Pane display="flex" className="img-method-addedAddress">
        {address.pk && (
          <InfoAddress marginLeft={5} hdpath={address.path} pk={address.pk} />
        )}
        <Copy style={{ marginLeft: 2 }} text={address.bech32} />
        <ButtonIcon
          marginLeft={5}
          width={16}
          height={16}
          icon={deleteIcon}
          textTooltip="delete address"
          onClickButtonIcon={onClickDeleteAddress}
        />
      </Pane>
    </Pane>
  );
}

export function Vitalik() {
  return (
    <Pane
      height="23px"
      width="23px"
      boxShadow="0 0 2px 1px #009688"
      borderRadius="50%"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <Pane
        height="4px"
        width="7px"
        boxShadow="0 0 2px 1px #009688"
        borderRadius="50%"
        transform="rotate(25deg)"
        marginBottom="3px"
      />
      <Pane
        height="4px"
        width="7px"
        boxShadow="0 0 2px 1px #009688"
        borderRadius="50%"
        transform="rotate(-25deg)"
        marginBottom="3px"
      />
    </Pane>
  );
}

export function PocketCard({ children, select, ...props }) {
  return (
    <Pane
      boxShadow={select ? '0 0 8px 1px #00b0ff' : '0px 0px 5px #36d6ae'}
      className="container-card-pocket cursor-pointer"
      width="100%"
      maxWidth="unset"
      height="auto"
      paddingX={20}
      paddingY={20}
      {...props}
    >
      {children}
    </Pane>
  );
}
