import { useEffect, useState, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import { SigningStargateClient } from '@cosmjs/stargate';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { reduceBalances, formatNumber } from '../../utils/utils';
import coinDecimalsConfig from '../../utils/configToken';
import { getCoinDecimals } from '../teleport/utils';
import { DenomArr } from '../../components';
import { getKeplr } from '../ibc/useSetupIbc';
import ActionBarAssets from './ActionBarAssets';

function AssetsRow({ denom, allBalances, deposit, withdraw, disabledBtns }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (
      allBalances !== null &&
      Object.prototype.hasOwnProperty.call(allBalances, denom)
    ) {
      setBalance(getCoinDecimals(allBalances[denom], denom));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBalances]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '30% 30% 1fr 1fr',
        alignItems: 'center',
        height: '42px',
      }}
    >
      <div>
        <DenomArr
          marginImg="0px 5px 0px 0px"
          flexDirection="row-reverse"
          denomValue={denom}
        />
      </div>
      <div>{formatNumber(balance)}</div>
      <div style={{ width: '160px' }}>
        {denom.includes('ibc') && (
          <button
            disabled={disabledBtns}
            type="button"
            className="btn"
            onClick={() => deposit(denom)}
          >
            deposit
          </button>
        )}
      </div>
      <div style={{ width: '160px' }}>
        {denom.includes('ibc') && (
          <button type="button" className="btn" onClick={() => withdraw(denom)}>
            withdraw
          </button>
        )}
      </div>
    </div>
  );
}

const createClient = async (denom, keplrCybre) => {
  let client = null;
  if (denom.includes('ibc')) {
    if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
      const keplr = await getKeplr();
      const { rpc, prefix, chainId } = coinDecimalsConfig[denom];
      await keplr.enable(chainId);
      const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
      const options = { prefix };
      client = await SigningStargateClient.connectWithSigner(
        rpc,
        offlineSigner,
        options
      );
    } else {
      client = null;
    }
  } else {
    client = keplrCybre;
  }

  return client;
};

function Assets({ defaultAccount }) {
  const { jsCyber, keplr } = useContext(AppContext);
  const [totalSupply, setTotalSupply] = useState(null);
  const [allBalances, setAllBalances] = useState(null);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [ibcClient, setIbcClient] = useState(null);
  const [selectDenom, setSelectDenom] = useState(null);
  const [typeIbcTxs, setTypeIbcTxs] = useState(null);

  useEffect(() => {
    const getAssets = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.totalSupply();
        setTotalSupply(response);
      }
    };
    getAssets();
  }, [jsCyber]);

  useEffect(() => {
    const getAllBalances = async () => {
      if (jsCyber !== null && addressActive !== null) {
        const response = await jsCyber.getAllBalances(addressActive.bech32);
        const dataReduceBalances = reduceBalances(response);
        setAllBalances(dataReduceBalances);
      }
    };
    getAllBalances();
  }, [jsCyber, addressActive]);

  const depositOnClick = useCallback(
    async (denom) => {
      const client = await createClient(denom, keplr);
      if (client !== null) {
        setSelectDenom(denom);
        setIbcClient(client);
        setTypeIbcTxs('deposit');
        console.log('client', client);
      }
    },
    [keplr]
  );

  const withdrawOnClick = useCallback(
    async (denom) => {
      if (keplr !== null) {
        setSelectDenom(denom);
        setIbcClient(keplr);
        setTypeIbcTxs('withdraw');
        console.log('client', keplr);
      }
    },
    [keplr]
  );

  return (
    <>
      <main
        className="block-body"
        style={{ display: 'flex', flexDirection: 'column', gridGap: '20px' }}
      >
        {totalSupply !== null &&
          totalSupply.map((item, i) => {
            if (!item.denom.includes('ibc')) {
              return (
                <AssetsRow
                  key={i}
                  denom={item.denom}
                  allBalances={allBalances}
                  deposit={depositOnClick}
                  withdraw={withdrawOnClick}
                  disabledBtns={keplr === null}
                />
              );
            }
            if (
              Object.prototype.hasOwnProperty.call(
                coinDecimalsConfig,
                item.denom
              )
            ) {
              return (
                <AssetsRow
                  key={i}
                  denom={item.denom}
                  allBalances={allBalances}
                  deposit={depositOnClick}
                  withdraw={withdrawOnClick}
                  disabledBtns={keplr === null}
                />
              );
            }
            return null;
          })}
      </main>
      <ActionBarAssets
        typeIbcTxs={typeIbcTxs}
        client={ibcClient}
        denom={selectDenom}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Assets);
