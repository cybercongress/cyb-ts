import React, { Component } from 'react';
import { Provider, Subscribe } from 'unstated';
import {
  ScrollContainer,
  MainContainer,
  Pane,
  Tablist,
  Tab,
  TableEv as Table,
  Pill,
  Tooltip,
  Text,
} from '@cybercongress/gravity';

import {
  getValidators,
  getValidatorsUnbonding,
  getValidatorsUnbonded,
  selfDelegationShares,
  stakingPool,
} from '../../utils/search/utils';
import {
  getDelegator,
  formatNumber,
  asyncForEach,
  formatValidatorAddress,
} from '../../utils/utils';
import { FormatNumber } from '../../components';

import validatorsContainer from './validatorsContainer';
import validatorsData from './validatorsData';

const StatusTooltip = ({ status }) => {
  let statusColor;

  switch (status) {
    case 0:
      statusColor = 'red';
      break;
    case 1:
      statusColor = 'yellow';
      break;
    case 2:
      statusColor = 'green';
      break;
    default:
      statusColor = 'neutral';
      break;
  }

  return (
    <Pane display="flex" alignItems="center">
      <Tooltip
        appearance="card"
        content={
          <Pane display="flex" alignItems="center" paddingX={18} paddingY={18}>
            <Text>
              Validator status:&nbsp;
              {status === 0 && 'unbonded'}
              {status === 1 && 'unbonding'}
              {status === 2 && 'bonded'}
            </Text>
          </Pane>
        }
      >
        <Pill
          height={7}
          width={7}
          borderRadius="50%"
          paddingX={4}
          paddingY={0}
          // marginX={20}
          isSolid
          color={statusColor}
        />
      </Tooltip>
    </Pane>
  );
};

const TextTable = ({ children, fontSize, color, display, ...props }) => (
  <Text
    fontSize={`${fontSize || 13}px`}
    color={`${color || '#fff'}`}
    display={`${display || 'inline-flex'}`}
    {...props}
  >
    {children}
  </Text>
);

class Validators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validators: [],
      showJailed: false,
      activeValidatorsCount: 0,
      loading: true,
      bondedTokens: 0,
    };
  }

  async componentDidMount() {
    await this.getSupply();
    this.getValidators();
  }

  getSupply = async () => {
    const bondedTokens = await stakingPool();
    this.setState({
      bondedTokens: bondedTokens.bonded_tokens,
    });
  };

  getValidators = async () => {
    const { bondedTokens } = this.state;

    let validators = await getValidators();
    const validatorsJailed = await getValidatorsUnbonding();
    const validatorsUnbonded = await getValidatorsUnbonded();

    validators.push(...validatorsJailed, ...validatorsUnbonded);

    validators = validators
      .slice(0)
      .sort((a, b) => (+a.tokens > +b.tokens ? -1 : 1));

    const activeValidatorsCount = validators.filter(
      validator => !validator.jailed
    ).length;

    await asyncForEach(
      Array.from(Array(validators.length).keys()),
      async item => {
        const delegatorAddress = getDelegator(
          validators[item].operator_address
        );

        const getSelfDelegation = await selfDelegationShares(
          delegatorAddress,
          validators[item].operator_address
        );

        const height = validators[item].jailed
          ? validators[item].unbonding_height
          : validators[item].bond_height || 0;

        const commission = formatNumber(
          validators[item].commission.commission_rates.rate * 100,
          2
        );

        const powerFloat = validators[item].tokens * 10 ** -9;
        const power = formatNumber(Math.floor(powerFloat * 1000) / 1000, 3);

        const shares =
          (getSelfDelegation.shares / validators[item].delegator_shares) * 100;

        const staking = (validators[item].tokens / bondedTokens) * 100;

        validators[item].height = height;
        validators[item].commission = commission;
        validators[item].power = power;
        validators[item].shares = formatNumber(
          Math.floor(shares * 100) / 100,
          2
        );
        validators[item].stakingPool = formatNumber(
          Math.floor(staking * 100) / 100,
          2
        );
      }
    );

    this.setState({
      loading: false,
      validators,
      activeValidatorsCount,
    });
  };

  showActive = () => {
    this.setState({ showJailed: false });
  };

  showJailed = () => {
    this.setState({ showJailed: true });
  };

  render() {
    const {
      validators,
      showJailed,
      activeValidatorsCount,
      loading,
    } = this.state;

    console.log(validators);

    if (loading) {
      return <div>...</div>;
    }

    const validatorRows = validators
      .filter(validator => validator.jailed === showJailed)
      .map((validator, index) => {
        return (
          <Table.Row
            borderBottom="none"
            //   boxShadow='0px 0px 0.1px 0px #ddd'
            //   className='validators-table-row'
            isSelectable
            key={validator.operator_address}
          >
            <Table.TextCell textAlign="center" width={35} flex="none">
              <StatusTooltip status={validator.status} />
            </Table.TextCell>
            <Table.TextCell textAlign="end" flexBasis={60} flex="none" isNumber>
              <TextTable>{index + 1}</TextTable>
            </Table.TextCell>
            <Table.TextCell>
              <TextTable>{validator.description.moniker}</TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end">
              <TextTable>
                {formatValidatorAddress(validator.operator_address)}
              </TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end">
              <TextTable>
                <FormatNumber
                  number={validator.commission}
                  fontSizeDecimal={11.5}
                />{' '}
                %
              </TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end" isNumber flex={1.5}>
              <TextTable>
                <FormatNumber
                  style={{ marginRight: 5 }}
                  number={validator.power}
                  fontSizeDecimal={11.5}
                />
                (
                <FormatNumber
                  number={validator.stakingPool}
                  fontSizeDecimal={11.5}
                />
                %)
              </TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end" flex={0.5}>
              <TextTable>
                <FormatNumber
                  number={validator.shares}
                  fontSizeDecimal={11.5}
                />
                %
              </TextTable>
            </Table.TextCell>
            <Table.TextCell textAlign="end" isNumber>
              <TextTable>{validator.height}</TextTable>
            </Table.TextCell>
          </Table.Row>
        );
      });
    return (
      <main className="block-body">
        <Pane
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Tablist marginBottom={24}>
            <Tab
              key="Active"
              id="Active"
              isSelected={!showJailed}
              onSelect={e => this.showActive()}
              paddingX={50}
              paddingY={20}
              marginX={3}
              borderRadius={4}
              color="#36d6ae"
              boxShadow="0px 0px 10px #36d6ae"
              fontSize="16px"
            >
              Active
            </Tab>
            <Tab
              key="Jailed"
              id="Jailed"
              isSelected={showJailed}
              onSelect={e => this.showJailed()}
              paddingX={50}
              paddingY={20}
              marginX={3}
              borderRadius={4}
              color="#36d6ae"
              boxShadow="0px 0px 10px #36d6ae"
              fontSize="16px"
            >
              Jailed
            </Tab>
          </Tablist>
        </Pane>

        <Table>
          <Table.Head
            style={{
              backgroundColor: '#000',
              borderBottom: '1px solid #ffffff80',
            }}
          >
            <Table.TextHeaderCell textAlign="center" width={35} flex="none" />
            <Table.TextHeaderCell textAlign="end" flexBasis={60} flex="none">
              <TextTable fontSize={15}>#</TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              <TextTable fontSize={15}>Moniker</TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="end">
              <TextTable fontSize={15}>Operator</TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="end">
              <TextTable fontSize={15} whiteSpace="nowrap">
                Commission (%)
              </TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell flex={1.5} textAlign="end">
              <TextTable fontSize={15}>Power (GCYB)</TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell flex={0.5} textAlign="end">
              <TextTable fontSize={15}>Self (%)</TextTable>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="end">
              <TextTable fontSize={15} whiteSpace="nowrap">
                {showJailed ? 'Unbonding height' : 'Bond height'}
              </TextTable>
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body style={{ backgroundColor: '#000', overflowY: 'hidden' }}>
            {validatorRows}
          </Table.Body>
        </Table>
      </main>
    );
  }
}

export default Validators;
