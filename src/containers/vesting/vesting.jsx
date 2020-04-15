import React, { PureComponent } from 'react';
import { toBN } from 'web3-utils';
import { Pane, Text } from '@cybercongress/gravity';
import injectWeb3Vesting from '../../components/web3/web3Vesting';
import { Loading, LinkWindow } from '../../components';
import { asyncForEach } from '../../utils/utils';

import TableVesting from './table';
import BalancePane from './balancePane';
import ActionBarVesting from './actionBar';
import { AUCTION } from '../../utils/config';

const dateFormat = require('dateformat');

const DEFAULT_PROOF = 'Processing by cyber~Congress';

const MILLISECONDS_IN_SECOND = 1000;

class Vesting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      balance: 0,
      spendableBalance: 0,
      accounts: null,
      tableLoading: true,
      loading: true,
      endTime: null,
    };
  }

  async componentDidMount() {
    const { accounts, contractVesting } = this.props;
    const end = await contractVesting.methods.vestingEnd().call();
    if (end * MILLISECONDS_IN_SECOND < Date.parse(new Date())) {
      const endTime = dateFormat(
        new Date(end * MILLISECONDS_IN_SECOND),
        'dd/mm/yyyy, HH:MM:ss'
      );
      this.setState({
        endTime,
      });
    }

    await this.setState({
      accounts,
    });

    if (accounts !== null) {
      this.getBalance();
      this.getVesting();
    } else {
      console.log('accounts null');
    }

    window.ethereum.on('accountsChanged', async accountsChanged => {
      const defaultAccounts = accountsChanged[0];
      const tmpAccount = defaultAccounts;
      await this.setState({
        accounts: tmpAccount.toLowerCase(),
      });
      this.getBalance();
      this.getVesting();
    });

    contractVesting.events.NewLock(
      {
        filter: { lockAddress: accounts },
      },
      (error, event) => {
        console.log('NewLock', event);
        this.newLockUpdate(event);
      }
    );

    contractVesting.events.NewProof(
      {
        filter: { lockAddress: accounts },
      },
      (error, event) => {
        this.newProofUpdate(event);
        console.log('NewProof', event);
      }
    );
  }

  newLockUpdate = async dataEvent => {
    const { table, accounts } = this.state;
    const { contractTokenManager } = this.props;
    if (accounts === dataEvent.returnValues.lockAddress.toLowerCase()) {
      let data = [];

      const {
        vestingId,
        lockAddress,
        amount,
        account,
      } = dataEvent.returnValues;

      const { start } = await contractTokenManager.methods
        .getVesting(lockAddress, vestingId)
        .call();

      data = [
        {
          id: parseInt(vestingId, 10),
          amount,
          start: dateFormat(
            new Date(start * MILLISECONDS_IN_SECOND),
            'dd/mm/yyyy, hh:MM:ss tt'
          ),
          recipient: account,
          proof: DEFAULT_PROOF,
        },
        ...table,
      ];

      this.setState({ table: data });
      this.getBalance();
    }
  };

  newProofUpdate = async dataEvent => {
    const { table, accounts } = this.state;
    const data = [...table];
    if (accounts === dataEvent.returnValues.claimer.toLowerCase()) {
      data.forEach((element, index) => {
        if (element.id === parseInt(dataEvent.returnValues.vestingId, 10)) {
          table[index].proof = dataEvent.returnValues.proofTx;
        }
      });
      console.log('newProofUpdate', data);
      this.setState({ table: data });
    }
  };

  getBalance = async () => {
    const { contractTokenManager, contractToken } = this.props;
    const { accounts } = this.state;

    console.log('accounts', accounts);

    const balance = await contractToken.methods.balanceOf(accounts).call();
    const spendableBalance = await contractTokenManager.methods
      .spendableBalanceOf(accounts)
      .call();

    this.setState({
      balance,
      loading: false,
      spendableBalance,
    });
  };

  getVesting = async () => {
    const { contractTokenManager, contractVesting } = this.props;
    const { accounts } = this.state;
    const data = [];

    const vestingsLengths = await contractTokenManager.methods
      .vestingsLengths(accounts)
      .call();

    await asyncForEach(
      Array.from(Array(parseInt(vestingsLengths, 10)).keys()),
      async item => {
        let getProof;

        const { amount, start } = await contractTokenManager.methods
          .getVesting(accounts, item)
          .call();

        const getClaimAddress = await contractVesting.methods
          .getClaimAddress(accounts, item)
          .call();

        if (getClaimAddress.length === 0) {
          return;
        }

        getProof = await contractVesting.methods
          .getProof(accounts, item)
          .call();

        if (getProof.length === 0) {
          getProof = DEFAULT_PROOF;
        }

        data.push({
          id: item,
          amount,
          start: dateFormat(
            new Date(start * MILLISECONDS_IN_SECOND),
            'dd/mm/yyyy, hh:MM:ss tt'
          ),
          recipient: getClaimAddress,
          proof: getProof,
        });
      }
    );

    const table = data.reverse();

    this.setState({ table, tableLoading: false });
  };

  render() {
    const {
      accounts,
      spendableBalance,
      balance,
      table,
      tableLoading,
      loading,
      endTime,
    } = this.state;
    const { web3, contractVesting } = this.props;
    console.log('table', table);

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <Loading />
        </div>
      );
    }

    return (
      <div>
        <main className="block-body">
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            {endTime === null ? (
              <Text fontSize="16px" color="#fff">
                Vesting allow you to get 1 EUL for each vested GOL. Also GOLs
                allow you to participate in decisions of{' '}
                <LinkWindow to="https://mainnet.aragon.org/#/eulerfoundation/home/">
                  Euler Foundation
                </LinkWindow>
              </Text>
            ) : (
              <Text fontSize="16px" color="#fff">
                Vecting end {endTime}
              </Text>
            )}
          </Pane>
          <BalancePane
            marginTop={30}
            marginBottom={50}
            balance={balance}
            spendableBalance={spendableBalance}
            accounts={accounts}
          />

          {!tableLoading ? (
            <TableVesting data={table} />
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading />
            </div>
          )}
        </main>
        <ActionBarVesting
          available={spendableBalance}
          contractVesting={contractVesting}
          web3={web3}
          endTime={endTime}
        />
      </div>
    );
  }
}

export default injectWeb3Vesting(Vesting);
