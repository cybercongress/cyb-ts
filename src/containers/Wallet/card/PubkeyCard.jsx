import React, { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { PocketCard } from '../components';
import { Copy, Dots } from '../../../components';
import { trimString, formatCurrency, formatNumber } from '../../../utils/utils';
import { getDrop, getBalance, getTotalEUL } from '../../../utils/search/utils';
import useGetGol from '../../gol/getGolHooks';
import { COSMOS } from '../../../utils/config';

const imgLedger = require('../../../image/ledger.svg');
const imgKeplr = require('../../../image/keplr-icon.svg');

const RowBalance = ({ children, ...props }) => (
  <Pane display="flex" justifyContent="space-between" width="100%" {...props}>
    {children}
  </Pane>
);

const useAddressInfo = (accounts) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [totalCyber, setTotalCyber] = useState(0);
  const [totalCosmos, setTotalCosmos] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      setLoadingInfo(true);
      const responseCyber = await getBalance(accounts.cyber.bech32);
      const responseCosmos = await getBalance(
        accounts.cosmos.bech32,
        COSMOS.GAIA_NODE_URL_LSD
      );

      const responseTotalCyber = await getTotalEUL(responseCyber);
      setTotalCyber(responseTotalCyber);

      const responseTotalCosmos = await getTotalEUL(responseCosmos);
      setTotalCosmos(responseTotalCosmos);
      setLoadingInfo(false);
    };
    feachData();
  }, [accounts]);

  return {
    totalCyber,
    totalCosmos,
    loadingInfo,
  };
};

const CosmosAddressInfo = ({ address, loading, totalCosmos }) => {
  const [open, setOpen] = useState(false);

  return (
    <Pane
      width="100%"
      display="grid"
      gridTemplateColumns="200px 1fr"
      alignItems="baseline"
      onClick={() => setOpen(!open)}
      className="cosmos-address-container"
    >
      <Pane
        className="cosmos-address"
        display="flex"
        marginBottom={5}
        alignItems="center"
      >
        <a
          target="_blanmarginBottomValue={5}k"
          rel="noopener noreferrer"
          href={`https://www.mintscan.io/account/${address}`}
        >
          <div>{trimString(address, 10, 3)}</div>
        </a>
        <Copy text={address} />
      </Pane>
      <Pane flexDirection="column" display="flex" alignItems="flex-end">
        {loading ? (
          <span>
            <Dots /> CYB
          </span>
        ) : (
          <>
            <RowBalance className="cosmos-address-balance">
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
    </Pane>
  );
};

const CyberAddressInfo = ({
  address,
  loading,
  loadingGift,
  totalCyber,
  gol,
  gift,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Pane
      width="100%"
      display="grid"
      gridTemplateColumns="200px 1fr"
      alignItems="baseline"
      onClick={() => setOpen(!open)}
      className="cosmos-address-container"
      {...props}
    >
      <Pane
        className="cosmos-address"
        display="flex"
        marginBottom={5}
        alignItems="center"
      >
        <Link to={`/network/euler/contract/${address}`}>
          <div>{trimString(address, 9, 3)}</div>
        </Link>
        <Copy text={address} />
      </Pane>
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
    </Pane>
  );
};

function PubkeyCard({ pocket, ...props }) {
  const [gift, setGift] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pubkeyImg, setPubkeyImg] = useState(false);
  const gol = useGetGol(pocket.cyber.bech32);
  const { totalCyber, totalCosmos, loadingInfo } = useAddressInfo(pocket);

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

  useEffect(() => {
    if (pocket.pk && pocket.pk.length > 0) {
      if (pocket.keys === 'ledger') {
        setPubkeyImg(imgLedger);
      } else if (pocket.keys === 'keplr') {
        setPubkeyImg(imgKeplr);
      } else {
        setPubkeyImg(false);
      }
    } else {
      setPubkeyImg(false);
    }
  }, [pocket]);

  return (
    <PocketCard display="flex" flexDirection="column" {...props}>
      {pubkeyImg && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          marginBottom="15px"
        >
          <Pane display="flex" alignItems="center">
            <img
              style={{ width: 20, height: 20, marginRight: 5 }}
              src={pubkeyImg}
              alt="pubkeyImg"
            />
            <Pane>pubkey</Pane>
          </Pane>

          <Pane color="#8fa3ad" fontSize="18px">
            {trimString(pocket.pk, 6, 6)}
          </Pane>
        </Pane>
      )}
      <CyberAddressInfo
        address={pocket.cyber.bech32}
        loading={loadingInfo}
        loadingGift={loading}
        totalCyber={totalCyber}
        gift={gift}
        gol={gol}
        marginBottom={10}
      />

      <CosmosAddressInfo
        address={pocket.cosmos.bech32}
        loading={loadingInfo}
        totalCosmos={totalCosmos}
      />
    </PocketCard>
  );
}

export default PubkeyCard;
