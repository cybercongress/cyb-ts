import React, { useEffect, useState, useContext } from 'react';
import { Pane, Input, Button } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Web3Utils from 'web3-utils';
import { connect } from 'react-redux';
import { setDefaultAccount } from '../../../redux/actions/pocket';
import {
  PocketCard,
  ContainerAddressInfo,
  Address,
  ButtonIcon,
  FormatNumber,
} from '../components';
import {
  Copy,
  Dots,
  Tooltip,
  LinkWindow,
  NumberCurrency,
  ValueImg,
  DenomArr,
} from '../../../components';
import {
  trimString,
  formatCurrency,
  formatNumber,
  exponentialToDecimal,
  formatCurrencyNumber,
  getDecimal,
  getDisplayAmount,
} from '../../../utils/utils';
import { decFnc } from '../../teleport/utils';
import { getDrop, getBalance, getTotalEUL } from '../../../utils/search/utils';
import useGetGol from '../../gol/getGolHooks';
import { COSMOS, CYBER, INFINITY } from '../../../utils/config';
import { deleteAccount, deleteAddress, renameKeys } from '../utils';
import { useAddressInfo, useGetBalanceEth } from '../hooks/pubkeyCard';
import coinDecimalsConfig from '../../../utils/configToken';
import { AppContext } from '../../../context';

const editOutline = require('../../../image/create-outline.svg');
const editDone = require('../../../image/ionicons_svg_ios-checkmark-circle.svg');
const deleteIcon = require('../../../image/trash-outline.svg');
const cyb = require('../../../image/cybTrue.svg');

const RowBalance = ({ children, ...props }) => (
  <Pane display="flex" justifyContent="space-between" width="100%" {...props}>
    {children}
  </Pane>
);

export const reduceAmounToken = (amount, token, reverse) => {
  let amountReduce = amount;

  if (token.includes('ibc')) {
    if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, token)) {
      const { coinDecimals } = coinDecimalsConfig[token];
      if (reverse) {
        amountReduce = decFnc(parseFloat(amount), coinDecimals, reverse);
      } else {
        amountReduce = decFnc(parseFloat(amount), coinDecimals, reverse);
      }
    }
  }

  return amountReduce;
};

const DetailsBalance = ({
  total,
  divisor = COSMOS.DIVISOR_ATOM,
  currency = CYBER.DENOM_CYBER,
  address,
  ...props
}) => {
  return (
    <Pane width="100%" {...props}>
      <RowBalance>
        <div>liquid</div>
        {currency === CYBER.DENOM_CYBER ? (
          <FormatNumberTokens value={total.available} text={currency} />
        ) : (
          <FormatNumberTokens
            value={Math.floor((total.available / divisor) * 1000) / 1000}
            text={currency}
          />
        )}
      </RowBalance>
      <RowBalance>
        {currency === CYBER.DENOM_CYBER ? (
          <>
            <Link to="/halloffame">
              <div>staked</div>
            </Link>
            <FormatNumberTokens value={total.delegation} text={currency} />
          </>
        ) : (
          <>
            <div>staked</div>
            <FormatNumberTokens
              value={formatNumber(
                Math.floor((total.delegation / divisor) * 1000) / 1000
              )}
              text={currency}
            />
          </>
        )}
      </RowBalance>
      <RowBalance>
        {currency === CYBER.DENOM_CYBER ? (
          <>
            <Link to={`network/bostrom/contract/${address}/heroes`}>
              <div>unstaking</div>
            </Link>
            <FormatNumberTokens value={total.unbonding} text={currency} />
          </>
        ) : (
          <>
            <div>unstaking</div>
            <FormatNumberTokens
              value={Math.floor((total.unbonding / divisor) * 1000) / 1000}
              text={currency}
            />
          </>
        )}
      </RowBalance>
      <RowBalance>
        {currency === CYBER.DENOM_CYBER ? (
          <>
            <Link to={`network/bostrom/contract/${address}/heroes`}>
              <div>rewards</div>
            </Link>
            <FormatNumberTokens value={total.rewards} text={currency} />
          </>
        ) : (
          <>
            <div>rewards</div>
            <FormatNumberTokens
              value={Math.floor((total.rewards / divisor) * 1000) / 1000}
              text={currency}
            />
          </>
        )}
      </RowBalance>
    </Pane>
  );
};

const FormatNumberTokens = ({ text, value, ...props }) => {
  const { traseDenom } = useContext(AppContext);
  const { coinDecimals } = traseDenom(text);
  // console.log(text, value);
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 55px"
      gridGap="5px"
      fontSize="15px"
      {...props}
    >
      <Pane
        // paddingRight={5}
        whiteSpace="nowrap"
        display="flex"
        alignItems="center"
      >
        <span>{formatNumber(getDisplayAmount(value, coinDecimals))}</span>
      </Pane>
      {text && (
        <DenomArr
          marginImg="0 3px 0 0"
          flexDirection="row-reverse"
          justifyContent="flex-end"
          denomValue={text}
          onlyImg
        />
      )}
    </Pane>
  );
};

const DetailsBalanceTokens = ({
  total,
  currency = CYBER.DENOM_CYBER,
  address,
  ...props
}) => {
  return (
    <Pane width="100%" {...props}>
      <RowBalance marginBottom={3}>
        <div>liquid</div>
        <FormatNumberTokens value={total.liquid} text={currency} />
      </RowBalance>
      <RowBalance>
        <>
          <Link to="/mint">
            <div>vested</div>
          </Link>
          <FormatNumberTokens value={total.vested} text={currency} />
        </>
      </RowBalance>
    </Pane>
  );
};

const CosmosAddressInfo = ({
  address,
  loading,
  totalCosmos,
  onClickDeleteAddress,
  network,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <ContainerAddressInfo>
      <Address
        network={network}
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
            <Dots /> ATOM
          </span>
        ) : (
          <>
            <RowBalance
              onClick={() => setOpen(!open)}
              marginBottom={3}
              className="cosmos-address-balance"
            >
              {open ? (
                <div>total</div>
              ) : (
                <div className="details-balance">details</div>
              )}
              <FormatNumberTokens
                value={
                  ((totalCosmos.total / COSMOS.DIVISOR_ATOM) * 1000) / 1000
                }
                text="atom"
              />
            </RowBalance>
            {open && (
              <DetailsBalance
                total={totalCosmos}
                paddingLeft={15}
                divisor={COSMOS.DIVISOR_ATOM}
                currency="atom"
              />
            )}
          </>
        )}
      </Pane>
    </ContainerAddressInfo>
  );
};

const CYBNetworkInfo = ({
  address,
  onClickDeleteAddress,
  loading,
  gol,
  gift,
  openCyber,
  loadingGift,
  network,
  ...props
}) => {
  return (
    <ContainerAddressInfo>
      <Address
        network={network}
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <Link to={`/network/bostrom/contract/${address.bech32}`}>
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
            <RowBalance {...props} className="cosmos-address-balance">
              {openCyber ? (
                <div>total</div>
              ) : (
                <div className="details-balance">details</div>
              )}
              <NumberCurrency
                amount={Math.floor(gol) + Math.floor(gift)}
                currencyNetwork="cyb"
              />
            </RowBalance>
            {openCyber && (
              <Pane
                width="100%"
                paddingLeft={15}
                flexDirection="column"
                display="flex"
                alignItems="flex-end"
              >
                <RowBalance>
                  <div>game of links</div>
                  <NumberCurrency
                    amount={Math.floor(gol)}
                    currencyNetwork="CYB"
                  />
                </RowBalance>
                <RowBalance>
                  <div>gift</div>
                  <Pane>
                    {loadingGift ? (
                      <span>
                        <Dots /> CYB
                      </span>
                    ) : (
                      <NumberCurrency
                        amount={Math.floor(gift)}
                        currencyNetwork="CYB"
                      />
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

const BalanceToken = ({
  onClickOpen,
  open,
  balanceToken,
  currency,
  address,
}) => {
  return (
    <>
      {' '}
      <RowBalance
        onClick={onClickOpen}
        className="cosmos-address-balance"
        marginBottom={4}
      >
        {open ? (
          <div>total</div>
        ) : (
          <div className="details-balance">details</div>
        )}
        {/* <NumberCurrency
                    amount={balanceToken.hydrogen.total}
                    currencyNetwork="H"
                  /> */}
        <FormatNumberTokens value={balanceToken.total} text={currency} />
        {/* <Pane>{formatCurrency(totalCyber.total, 'eul')}</Pane> */}
      </RowBalance>
      {open && (
        <DetailsBalanceTokens
          total={balanceToken}
          address={address.bech32}
          paddingLeft={15}
          currency={currency}
        />
      )}
    </>
  );
};

const EULnetworkInfo = ({
  totalCyber,
  address,
  loading,
  openEul,
  onClickDeleteAddress,
  network,
  balanceToken,
  ...props
}) => {
  return (
    <ContainerAddressInfo>
      <Address
        network={network}
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <Link to={`/network/bostrom/contract/${address.bech32}`}>
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
            <RowBalance
              {...props}
              marginBottom={4}
              className="cosmos-address-balance"
            >
              {openEul ? (
                <div>total</div>
              ) : (
                <div className="details-balance">details</div>
              )}
              {/* <NumberCurrency
                amount={totalCyber.total}
                currencyNetwork={CYBER.DENOM_CYBER}
              /> */}
              <FormatNumberTokens
                value={totalCyber.total}
                text={CYBER.DENOM_CYBER}
              />
              {/* <Pane>{formatCurrency(totalCyber.total, 'eul')}</Pane> */}
            </RowBalance>
            {openEul && (
              <DetailsBalance
                total={totalCyber}
                address={address.bech32}
                paddingLeft={15}
              />
            )}

            {Object.keys(balanceToken).map((key) => {
              // console.log('Object', Object.keys(balanceToken[key].length))
              if (Object.keys(balanceToken[key]).length > 0) {
                return (
                  <BalanceToken
                    key={key}
                    onClickOpen={props[`onClickOpen${key}`]}
                    open={props[`open${key}`]}
                    balanceToken={balanceToken[key]}
                    currency={key}
                    address={address}
                  />
                );
              }
              return (
                <FormatNumberTokens
                  key={key}
                  value={balanceToken[key]}
                  text={key}
                  marginBottom={4}
                />
              );
            })}
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
  network,
  balanceToken,
}) => {
  // const [openCyber, setOpenCyber] = useState(false);
  const [openEul, setOpenEul] = useState(false);
  const [openmilliampere, setOpenmilliampere] = useState(false);
  const [openmillivolt, setOpenmillivolt] = useState(false);
  const [openliquidpussy, setOpenliquidpussy] = useState(false);
  const [openhydrogen, setOpenhydrogen] = useState(false);
  const [opentocyb, setOpentocyb] = useState(false);
  // const { totalGol } = useGetGol(address.bech32);
  // console.log(`balanceToken`, balanceToken)
  return (
    <>
      <EULnetworkInfo
        address={address}
        loading={loading}
        totalCyber={totalCyber}
        onClickDeleteAddress={onClickDeleteAddress}
        openEul={openEul}
        openmilliampere={openmilliampere}
        openmillivolt={openmillivolt}
        openliquidpussy={openliquidpussy}
        openhydrogen={openhydrogen}
        opentocyb={opentocyb}
        onClick={() => setOpenEul(!openEul)}
        network={network}
        balanceToken={balanceToken}
        onClickOpenliquidpussy={() => setOpenliquidpussy(!openliquidpussy)}
        onClickOpenhydrogen={() => setOpenhydrogen(!openhydrogen)}
        onClickOpentocyb={() => setOpentocyb(!opentocyb)}
        onClickOpenmilliampere={() => setOpenmilliampere(!openmilliampere)}
        onClickOpenmillivolt={() => setOpenmillivolt(!openmillivolt)}
      />
      {/* <CYBNetworkInfo
        address={address}
        loading={loading}
        loadingGift={loadingGift}
        totalCyber={totalCyber}
        gol={totalGol}
        gift={gift}
        openCyber={openCyber}
        onClickDeleteAddress={onClickDeleteAddress}
        onClick={() => setOpenCyber(!openCyber)}
        network={network}
      /> */}
    </>
  );
};

const EthAddressInfo = ({
  address,
  web3,
  contractToken,
  onClickDeleteAddress,
  network,
}) => {
  const { eth, gol } = useGetBalanceEth(address, contractToken);

  return (
    <ContainerAddressInfo>
      <Address
        network={network}
        address={address}
        onClickDeleteAddress={onClickDeleteAddress}
        addressLink={
          <LinkWindow to={`http://etherscan.io/address/${address.bech32}`}>
            <div>{trimString(address.bech32, 6, 6)}</div>
          </LinkWindow>
        }
      />
      <Pane flexDirection="column" display="flex" alignItems="flex-end">
        <FormatNumberTokens
          value={exponentialToDecimal(parseFloat(eth).toPrecision(6))}
          text="eth"
        />
        <FormatNumberTokens value={parseFloat(gol)} text="GOL" />
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
  defaultAccount,
  setDefaultAccountProps,
  ...props
}) {
  const [gift, setGift] = useState(0);
  const [loading, setLoading] = useState(true);
  const { totalCyber, totalCosmos, loadingInfo, balanceToken } = useAddressInfo(
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
      } else {
        setLoading(false);
        setGift(0);
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
      if (nameCard === defaultAccount.name) {
        setDefaultAccountProps(inputEditName, defaultAccount.account);
      }
      setInputEditName('');
      setEditStage(false);
      if (updateFunc) {
        updateFunc();
      }
    }
  };

  return (
    <PocketCard
      display="flex"
      paddingTop={20}
      flexDirection="column"
      position="relative"
      {...props}
      id="tess"
    >
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        marginBottom="10px"
        id="containerNameCard"
      >
        <Pane
          width="100%"
          id="containerNameCardv1"
          height="30px"
          display="flex"
          alignItems="center"
        >
          <Pane
            display="flex"
            flex={1}
            fontSize="18px"
            className="pocket-card-accountName-contaiter"
            alignItems="center"
            id="containerNameCardv2"
          >
            {!editStage && (
              <>
                <span id="nameCard" className="pocket-card-accountName-text">
                  {name}
                </span>
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
            <Pane
              position="relative"
              color="#ff9100"
              fontSize="18px"
              display="flex"
              alignItems="center"
            >
              Active
              {/* <img
                style={{ width: 30, height: 30, marginLeft: 10 }}
                src={cyb}
                alt="cyb"
              /> */}
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
          onClickDeleteAddress={() => deleteAddress(name, 'cyber', updateFunc)}
          network="cyber"
          balanceToken={balanceToken}
        />
      )}

      {pocket.cosmos && (
        <CosmosAddressInfo
          address={pocket.cosmos}
          loading={loadingInfo}
          totalCosmos={totalCosmos}
          onClickDeleteAddress={() => deleteAddress(name, 'cosmos', updateFunc)}
          network="cosmos"
        />
      )}

      {pocket.eth && (
        <EthAddressInfo
          address={pocket.eth}
          web3={web3}
          contractToken={contractToken}
          onClickDeleteAddress={() => deleteAddress(name, 'eth', updateFunc)}
          network="eth"
        />
      )}
    </PocketCard>
  );
}

const mapDispatchprops = (dispatch) => {
  return {
    setDefaultAccountProps: (name, account) =>
      dispatch(setDefaultAccount(name, account)),
  };
};

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps, mapDispatchprops)(PubkeyCard);
