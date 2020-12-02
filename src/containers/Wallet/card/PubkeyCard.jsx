import React, { useEffect, useState } from 'react';
import { Pane, Input, Button } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Web3Utils from 'web3-utils';
import {
  PocketCard,
  ContainerAddressInfo,
  Address,
  ButtonIcon,
} from '../components';
import {
  Copy,
  Dots,
  Tooltip,
  FormatNumber,
  LinkWindow,
} from '../../../components';
import {
  trimString,
  formatCurrency,
  formatNumber,
  exponentialToDecimal,
  formatCurrencyNumber,
  getDecimal,
} from '../../../utils/utils';
import { getDrop, getBalance, getTotalEUL } from '../../../utils/search/utils';
import useGetGol from '../../gol/getGolHooks';
import { COSMOS, CYBER, INFINITY } from '../../../utils/config';
import { deleteAccount, deleteAddress, renameKeys } from '../utils';
import { useAddressInfo, useGetBalanceEth } from '../hooks/pubkeyCard';

const editOutline = require('../../../image/create-outline.svg');
const editDone = require('../../../image/ionicons_svg_ios-checkmark-circle.svg');
const deleteIcon = require('../../../image/trash-outline.svg');
const cyb = require('../../../image/cybTrue.svg');

const RowBalance = ({ children, ...props }) => (
  <Pane display="flex" justifyContent="space-between" width="100%" {...props}>
    {children}
  </Pane>
);

const DetailsBalance = ({
  total,
  divisor = COSMOS.DIVISOR_ATOM,
  currency = CYBER.DENOM_CYBER,
  ...props
}) => {
  return (
    <Pane width="100%" {...props}>
      <RowBalance>
        <div>liquid</div>
        {currency === CYBER.DENOM_CYBER ? (
          <NumberCurrency amount={total.available} currencyNetwork={currency} />
        ) : (
          <FormatNumber
            number={formatNumber(
              Math.floor((total.available / divisor) * 1000) / 1000,
              3
            )}
            currency={currency}
          />
        )}
      </RowBalance>
      <RowBalance>
        <div>staked</div>
        {currency === CYBER.DENOM_CYBER ? (
          <NumberCurrency
            amount={total.delegation}
            currencyNetwork={currency}
          />
        ) : (
          <FormatNumber
            number={formatNumber(
              Math.floor((total.delegation / divisor) * 1000) / 1000,
              3
            )}
            currency={currency}
          />
        )}
      </RowBalance>
      <RowBalance>
        <div>unstaking</div>
        {currency === CYBER.DENOM_CYBER ? (
          <NumberCurrency amount={total.unbonding} currencyNetwork={currency} />
        ) : (
          <FormatNumber
            number={formatNumber(
              Math.floor((total.unbonding / divisor) * 1000) / 1000,
              3
            )}
            currency={currency}
          />
        )}
      </RowBalance>
      <RowBalance>
        <div>unclaimed rewards</div>
        {currency === CYBER.DENOM_CYBER ? (
          <NumberCurrency amount={total.rewards} currencyNetwork={currency} />
        ) : (
          <FormatNumber
            number={formatNumber(
              Math.floor((total.rewards / divisor) * 1000) / 1000,
              3
            )}
            currency={currency}
          />
        )}
      </RowBalance>
    </Pane>
  );
};

const NumberCurrency = ({
  amount,
  fontSizeDecimal,
  currencyNetwork,
  prefixCustom,
  decimalDigits,
  ...props
}) => {
  const { number, currency } = formatCurrencyNumber(
    amount,
    currencyNetwork,
    decimalDigits,
    prefixCustom
  );
  return (
    <Pane
      display="grid"
      gridTemplateColumns="1fr 45px"
      gridGap="5px"
      {...props}
    >
      <Pane display="flex" alignItems="center">
        <span>{formatNumber(Math.floor(number))}</span>.
        <div style={{ width: 30, fontSize: `${fontSizeDecimal || 14}px` }}>
          {getDecimal(number)}
        </div>
      </Pane>
      <div>{currency}</div>
    </Pane>
  );
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
              <FormatNumber
                number={formatNumber(
                  ((totalCosmos.total / COSMOS.DIVISOR_ATOM) * 1000) / 1000,
                  3
                )}
                currency="ATOM"
              />
            </RowBalance>
            {open && (
              <DetailsBalance
                total={totalCosmos}
                paddingLeft={15}
                divisor={COSMOS.DIVISOR_ATOM}
                currency="ATOM"
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
  ...props
}) => {
  return (
    <ContainerAddressInfo>
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
            <RowBalance {...props} className="cosmos-address-balance">
              <div>total</div>
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

const EULnetworkInfo = ({
  totalCyber,
  address,
  loading,
  openEul,
  onClickDeleteAddress,
  ...props
}) => {
  return (
    <ContainerAddressInfo>
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
            <RowBalance {...props} className="cosmos-address-balance">
              <div>total</div>
              <NumberCurrency amount={totalCyber.total} currencyNetwork="eul" />
              {/* <Pane>{formatCurrency(totalCyber.total, 'eul')}</Pane> */}
            </RowBalance>
            {openEul && <DetailsBalance total={totalCyber} paddingLeft={15} />}
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
}) => {
  const [openCyber, setOpenCyber] = useState(false);
  const [openEul, setOpenEul] = useState(false);
  const gol = useGetGol(address.bech32);

  return (
    <>
      <EULnetworkInfo
        address={address}
        loading={loading}
        totalCyber={totalCyber}
        onClickDeleteAddress={onClickDeleteAddress}
        openEul={openEul}
        onClick={() => setOpenEul(!openEul)}
      />
      <CYBNetworkInfo
        address={address}
        loading={loading}
        loadingGift={loadingGift}
        totalCyber={totalCyber}
        gol={gol}
        gift={gift}
        openCyber={openCyber}
        onClickDeleteAddress={onClickDeleteAddress}
        onClick={() => setOpenCyber(!openCyber)}
      />
    </>
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
        <FormatNumber
          number={formatNumber(
            exponentialToDecimal(parseFloat(eth).toPrecision(6)),
            3
          )}
          currency="ETH"
        />
        <NumberCurrency amount={parseFloat(gol)} />
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
            <Pane
              position="relative"
              color="#76ff03"
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
          onClickDeleteAddress={() => deleteAddress(name, 'eth', updateFunc)}
        />
      )}
    </PocketCard>
  );
}

export default PubkeyCard;
