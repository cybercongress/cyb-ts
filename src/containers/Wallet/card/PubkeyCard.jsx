import React, { useEffect, useState } from 'react';
import { Pane, Input, Button } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Web3Utils from 'web3-utils';
import { PocketCard } from '../components';
import { Copy, Dots, Tooltip, LinkWindow } from '../../../components';
import {
  trimString,
  formatCurrency,
  formatNumber,
  exponentialToDecimal,
} from '../../../utils/utils';
import { getDrop, getBalance, getTotalEUL } from '../../../utils/search/utils';
import useGetGol from '../../gol/getGolHooks';
import { COSMOS, INFINITY } from '../../../utils/config';
import { deleteAccount, deleteAddress, renameKeys } from '../utils';

const imgLedger = require('../../../image/ledger.svg');
const imgKeplr = require('../../../image/keplr-icon.svg');
const imgMetaMask = require('../../../image/mm-logo.svg');
const imgRead = require('../../../image/duplicate-outline.svg');
const imgHelp = require('../../../image/ionicons_svg_ios-help-circle-outline.svg');
const editOutline = require('../../../image/create-outline.svg');
const editDone = require('../../../image/ionicons_svg_ios-checkmark-circle.svg');
const deleteIcon = require('../../../image/trash-outline.svg');

const imgData = {
  ledger: imgLedger,
  keplr: imgKeplr,
  MetaMask: imgMetaMask,
  'read-only': imgRead,
};

const Vitalik = () => (
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

const ButtonIcon = ({
  icon,
  onClickButtonIcon,
  width = 25,
  height = 25,
  customClass = '',
  textTooltip = '',
  ...props
}) => {
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
};

const RowBalance = ({ children, ...props }) => (
  <Pane display="flex" justifyContent="space-between" width="100%" {...props}>
    {children}
  </Pane>
);

const ContainerAddressInfo = ({ children, ...props }) => (
  <Pane
    width="100%"
    display="grid"
    gridTemplateColumns="210px 1fr"
    alignItems="baseline"
    className="cosmos-address-container"
    {...props}
  >
    {children}
  </Pane>
);

const InfoAddress = ({ pk, hdpath, ...props }) => {
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
};

const Address = ({ address, addressLink, onClickDeleteAddress }) => (
  <Pane
    className="cosmos-address"
    display="flex"
    marginBottom={5}
    alignItems="center"
  >
    <img
      style={{ width: 15, height: 15, marginRight: 8 }}
      src={imgData[address.keys]}
      alt="imgAddress"
    />
    {addressLink}
    {address.pk && (
      <InfoAddress marginLeft={5} hdpath={address.path} pk={address.pk} />
    )}
    <Copy style={{ marginLeft: 2 }} text={address.bech32} />
    <ButtonIcon
      width={16}
      height={16}
      icon={deleteIcon}
      textTooltip="delete address"
      onClickButtonIcon={onClickDeleteAddress}
    />
  </Pane>
);

const useAddressInfo = (accounts, updateCard) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [totalCyber, setTotalCyber] = useState(0);
  const [totalCosmos, setTotalCosmos] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      setLoadingInfo(true);
      if (accounts.cyber) {
        const responseCyber = await getBalance(accounts.cyber.bech32);
        const responseTotalCyber = await getTotalEUL(responseCyber);
        setTotalCyber(responseTotalCyber);
      }
      if (accounts.cosmos) {
        const responseCosmos = await getBalance(
          accounts.cosmos.bech32,
          COSMOS.GAIA_NODE_URL_LSD
        );
        const responseTotalCosmos = await getTotalEUL(responseCosmos);
        setTotalCosmos(responseTotalCosmos);
      }
      setLoadingInfo(false);
    };
    feachData();
  }, [accounts, updateCard]);

  return {
    totalCyber,
    totalCosmos,
    loadingInfo,
  };
};

const useGetBalanceEth = (address, web3, contractToken) => {
  const [balanceEth, setBalanceEth] = useState({
    eth: INFINITY,
    gol: INFINITY,
  });

  useEffect(() => {
    if (web3 && web3 !== null) {
      const feachData = async () => {
        const { givenProvider } = web3;
        if (givenProvider !== null) {
          const responseEth = await web3.eth.getBalance(address.bech32);
          const eth = Web3Utils.fromWei(responseEth, 'ether');
          setBalanceEth((item) => ({ ...item, eth }));
          const responseGol = await contractToken.methods
            .balanceOf(address.bech32)
            .call();
          setBalanceEth((item) => ({ ...item, gol: responseGol }));
        }
      };
      feachData();
    }
  }, [web3, address, contractToken]);

  return balanceEth;
};

const CosmosAddressInfo = ({
  address,
  loading,
  totalCosmos,
  onClickDeleteAddress,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <ContainerAddressInfo>
      <Address
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <LinkWindow to={`https://www.mintscan.io/account/${address.bech32}`}>
            <div>{trimString(address.bech32, 10, 3)}</div>
          </LinkWindow>
        }
      />
      <Pane flexDirection="column" display="flex" alignItems="flex-end">
        {loading ? (
          <span>
            <Dots /> CYB
          </span>
        ) : (
          <>
            <RowBalance
              onClick={() => setOpen(!open)}
              className="cosmos-address-balance"
            >
              <div>total</div>
              <div>
                {formatNumber(
                  ((totalCosmos.total / COSMOS.DIVISOR_ATOM) * 1000) / 1000
                )}{' '}
                ATOM
              </div>
            </RowBalance>
            {open && (
              <Pane width="100%" paddingLeft={15}>
                <RowBalance>
                  <div>liquid</div>
                  <div>
                    {formatNumber(
                      ((totalCosmos.available / COSMOS.DIVISOR_ATOM) * 1000) /
                        1000
                    )}{' '}
                    ATOM
                  </div>
                </RowBalance>
                <RowBalance>
                  <div>staked</div>
                  <div>
                    {formatNumber(
                      ((totalCosmos.delegation / COSMOS.DIVISOR_ATOM) * 1000) /
                        1000
                    )}{' '}
                    ATOM
                  </div>
                </RowBalance>
                <RowBalance>
                  <div>unstaking</div>
                  <div>
                    {formatNumber(
                      ((totalCosmos.unbonding / COSMOS.DIVISOR_ATOM) * 1000) /
                        1000
                    )}{' '}
                    ATOM
                  </div>
                </RowBalance>
                <RowBalance>
                  <div>unclaimed rewards</div>
                  <div>
                    {formatNumber(
                      ((totalCosmos.rewards / COSMOS.DIVISOR_ATOM) * 1000) /
                        1000
                    )}{' '}
                    ATOM
                  </div>
                </RowBalance>
              </Pane>
            )}
          </>
        )}
      </Pane>
    </ContainerAddressInfo>
  );
};

const CyberAddressInfo = ({
  address,
  loading,
  loadingGift,
  totalCyber,
  gift,
  onClickDeleteAddress,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const gol = useGetGol(address.bech32);

  return (
    <ContainerAddressInfo onClick={() => setOpen(!open)} {...props}>
      <Address
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <Link to={`/network/euler/contract/${address.bech32}`}>
            <div>{trimString(address.bech32, 9, 3)}</div>
          </Link>
        }
      />
      <Pane flexDirection="column" display="flex" alignItems="flex-end">
        {loading ? (
          <span>
            <Dots /> CYB
          </span>
        ) : (
          <>
            <RowBalance className="cosmos-address-balance">
              <div>total</div>
              <Pane>{formatCurrency(totalCyber.total, 'eul')}</Pane>
            </RowBalance>
            {open && (
              <Pane
                width="100%"
                paddingLeft={15}
                flexDirection="column"
                display="flex"
                alignItems="flex-end"
              >
                <RowBalance>
                  <div>game of links</div>
                  <Pane>{formatCurrency(Math.floor(gol), 'CYB')}</Pane>
                </RowBalance>
                <RowBalance>
                  <div>gift</div>
                  <Pane>
                    {loadingGift ? (
                      <span>
                        <Dots /> CYB
                      </span>
                    ) : (
                      formatCurrency(Math.floor(gift), 'CYB')
                    )}
                  </Pane>
                </RowBalance>
              </Pane>
            )}
          </>
        )}
      </Pane>
    </ContainerAddressInfo>
  );
};

const EthAddressInfo = ({
  address,
  web3,
  contractToken,
  onClickDeleteAddress,
}) => {
  const { eth, gol } = useGetBalanceEth(address, web3, contractToken);

  return (
    <ContainerAddressInfo>
      <Address
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <LinkWindow to={`http://etherscan.io/address/${address.bech32}`}>
            <div>{trimString(address.bech32, 6, 6)}</div>
          </LinkWindow>
        }
      />
      <Pane flexDirection="column" display="flex" alignItems="flex-end">
        <Pane marginBottom={10}>
          {exponentialToDecimal(parseFloat(eth).toPrecision(6))} ETH
        </Pane>
        <Pane>{formatNumber(parseFloat(gol))} GoL</Pane>
      </Pane>
    </ContainerAddressInfo>
  );
};

function PubkeyCard({
  pocket,
  updateCard,
  updateFunc,
  defaultAccounts,
  nameCard,
  web3,
  contractToken,
  ...props
}) {
  const [gift, setGift] = useState(0);
  const [loading, setLoading] = useState(true);
  const { totalCyber, totalCosmos, loadingInfo } = useAddressInfo(
    pocket,
    updateCard
  );
  const [editStage, setEditStage] = useState(false);
  const [inputEditName, setInputEditName] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setName(nameCard);
    setInputEditName(nameCard);
  }, [nameCard, pocket]);

  useEffect(() => {
    const feachData = async () => {
      if (pocket.cosmos) {
        const dataDrop = await getDrop(pocket.cosmos.bech32);
        if (dataDrop !== 0) {
          setGift(dataDrop.gift);
        }
        setLoading(false);
      }
    };
    feachData();
  }, [pocket]);

  const onClickEditNameAccount = async () => {
    if (inputEditName === nameCard) {
      setEditStage(false);
    } else {
      setName(inputEditName);
      const localStoragePocketAccount = await localStorage.getItem(
        'pocketAccount'
      );
      const localStoragePocket = await localStorage.getItem('pocket');
      if (localStoragePocketAccount !== null) {
        const dataPocketAccount = JSON.parse(localStoragePocketAccount);
        const newKeys = {
          [nameCard]: inputEditName,
        };
        const renamedObj = renameKeys(dataPocketAccount, newKeys);
        localStorage.setItem('pocketAccount', JSON.stringify(renamedObj));
      }
      if (localStoragePocket !== null) {
        const dataPocket = JSON.parse(localStoragePocket);
        const key0 = Object.keys(dataPocket)[0];
        if (key0 === nameCard) {
          const newObject = {
            [inputEditName]: { ...dataPocket[key0] },
          };
          localStorage.setItem('pocket', JSON.stringify(newObject));
        }
      }
      setInputEditName('');
      setEditStage(false);
    }
  };

  return (
    <PocketCard
      display="flex"
      paddingTop={20}
      flexDirection="column"
      position="relative"
      {...props}
    >
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        marginBottom="10px"
      >
        <Pane width="100%" height="30px" display="flex" alignItems="center">
          <Pane
            display="flex"
            flex={1}
            fontSize="18px"
            className="pocket-card-accountName-contaiter"
            alignItems="center"
          >
            {!editStage && (
              <>
                <span className="pocket-card-accountName-text">{name}</span>
                <ButtonIcon
                  width={18}
                  height={18}
                  icon={editOutline}
                  customClass="button-edit-accountName"
                  textTooltip="edit"
                  marginLeft={5}
                  onClickButtonIcon={() => setEditStage(true)}
                />
                <ButtonIcon
                  width={18}
                  height={18}
                  icon={deleteIcon}
                  customClass="button-edit-accountName"
                  textTooltip="delete accoutn"
                  onClickButtonIcon={() => deleteAccount(name, updateFunc)}
                />
              </>
            )}
            {editStage && (
              <>
                <Input
                  value={inputEditName}
                  onChange={(e) => setInputEditName(e.target.value)}
                  width="150px"
                  marginRight={10}
                  height={32}
                  fontSize="20px"
                  autoFocus
                />
                <button
                  className="container-buttonIcon"
                  type="button"
                  onClick={() => onClickEditNameAccount()}
                >
                  <img
                    src={editDone}
                    alt="edit"
                    style={{ width: 25, height: 25 }}
                  />
                </button>
              </>
            )}
          </Pane>
          {defaultAccounts && (
            <Pane position="relative">
              <Vitalik />
            </Pane>
          )}
        </Pane>
      </Pane>
      {pocket.cyber && (
        <CyberAddressInfo
          address={pocket.cyber}
          loading={loadingInfo}
          loadingGift={loading}
          totalCyber={totalCyber}
          gift={gift}
          marginBottom={10}
          onClickDeleteAddress={() => deleteAddress(name, 'cyber', updateFunc)}
        />
      )}

      {pocket.cosmos && (
        <CosmosAddressInfo
          address={pocket.cosmos}
          loading={loadingInfo}
          totalCosmos={totalCosmos}
          onClickDeleteAddress={() => deleteAddress(name, 'cosmos', updateFunc)}
        />
      )}

      {pocket.eth && (
        <EthAddressInfo
          address={pocket.eth}
          web3={web3}
          contractToken={contractToken}
          onClickDeleteAddress={() => deleteAddress(name, 'cosmos', updateFunc)}
        />
      )}
    </PocketCard>
  );
}

export default PubkeyCard;
