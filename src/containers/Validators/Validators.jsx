import React, { Component } from 'react';
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
  Icon,
} from '@cybercongress/gravity';

import { Link, Route } from 'react-router-dom';

import LocalizedStrings from 'react-localization';
import {
  getValidators,
  getValidatorsUnbonding,
  getValidatorsUnbonded,
  selfDelegationShares,
  stakingPool,
  getDelegations,
} from '../../utils/search/utils';
import {
  getDelegator,
  formatNumber,
  asyncForEach,
  formatValidatorAddress,
  roundNumber,
  formatCurrency,
} from '../../utils/utils';
import { FormatNumber, Loading, LinkWindow } from '../../components';
import ActionBarContainer from './ActionBarContainer';
import { i18n } from '../../i18n/en';
import { CYBER } from '../../utils/config';

const T = new LocalizedStrings(i18n);

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
    <Pane marginRight={10} display="flex" alignItems="center">
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
    alignItems="center"
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
      loading: true,
      bondedTokens: 0,
      validatorSelect: [],
      selectedIndex: '',
      language: 'en',
      addressLedger: null,
      selected: 'active',
    };
  }

  async componentDidMount() {
    const localStorageStory = localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      const address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address.bech32 });
    }
    this.init();
    this.chekPathname();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekPathname();
    }
  }

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (pathname.match(/jailed/gm) && pathname.match(/jailed/gm).length > 0) {
      this.setState({ selected: 'jailed', showJailed: true });
    } else {
      this.setState({ selected: 'active', showJailed: false });
    }
  };

  init = async () => {
    await this.getSupply();
    this.getValidators();
    this.setState({
      validatorSelect: [],
      selectedIndex: '',
    });
  };

  getSupply = async () => {
    const bondedTokens = await stakingPool();
    this.setState({
      bondedTokens: bondedTokens.bonded_tokens,
    });
  };

  getValidators = async () => {
    const { bondedTokens, addressLedger } = this.state;
    let delegationsData = [];

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

    if (addressLedger !== null) {
      const responseDelegations = await getDelegations(addressLedger);
      delegationsData = responseDelegations;
    }

    if (delegationsData.length > 0) {
      delegationsData.forEach(item => {
        validators.forEach((itemValidators, j) => {
          if (itemValidators.operator_address === item.validator_address) {
            validators[j].delegation = item.balance;
          }
        });
      });
    }

    await asyncForEach(
      Array.from(Array(validators.length).keys()),
      async item => {
        const delegatorAddress = getDelegator(
          validators[item].operator_address
        );
        let shares = 0;

        const height = validators[item].unbonding_height;

        const commission = formatNumber(
          validators[item].commission.commission_rates.rate * 100,
          2
        );

        const getSelfDelegation = await selfDelegationShares(
          delegatorAddress,
          validators[item].operator_address
        );

        if (getSelfDelegation && validators[item].delegator_shares > 0) {
          shares =
            (getSelfDelegation / validators[item].delegator_shares) * 100;
        }

        const staking = (validators[item].tokens / bondedTokens) * 100;

        validators[item].height = height;
        validators[item].commission = commission;
        validators[item].power = validators[item].tokens;
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
    console.log(validators);
    this.setState({
      loading: false,
      validators,
      activeValidatorsCount,
    });
  };

  selectValidators = (validator, index) => {
    const { validatorSelect, selectedIndex } = this.state;

    let selectValidator = {};

    if (selectedIndex === index) {
      this.setState({
        selectedIndex: '',
      });
    } else {
      this.setState({
        selectedIndex: index,
      });
    }
    if (validatorSelect !== validator) {
      selectValidator = validator;
      return this.setState({
        validatorSelect: selectValidator,
      });
    }
    return this.setState({
      validatorSelect: selectValidator,
    });
  };

  render() {
    const {
      validators,
      showJailed,
      loading,
      validatorSelect,
      selectedIndex,
      language,
      addressLedger,
      selected,
    } = this.state;

    T.setLanguage(language);

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Loading />
          <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
            Loading
          </div>
        </div>
      );
    }

    const validatorRows = validators
      .filter(validator =>
        showJailed ? validator.status < 2 : validator.status === 2
      )
      .map((validator, index) => {
        return (
          <Table.Row
            borderBottom="none"
            // backgroundColor={index === selectedIndex ? '#ffffff29' : '#000'}
            boxShadow={index === selectedIndex ? '0px 0px 7px #3ab793db' : ''}
            //   className='validators-table-row'
            onSelect={() => this.selectValidators(validator, index)}
            isSelectable
            key={validator.operator_address}
          >
            <Table.TextCell
              paddingX={5}
              textAlign="start"
              flexBasis={60}
              flex="none"
              isNumber
            >
              <TextTable>{index + 1}</TextTable>
            </Table.TextCell>
            <Table.TextCell paddingX={5}>
              <TextTable>
                <StatusTooltip status={validator.status} />
                <Link
                  to={`/network/euler-5/hero/${validator.operator_address}`}
                >
                  {validator.description.moniker}
                </Link>
              </TextTable>
            </Table.TextCell>
            <Table.TextCell paddingX={5} flex={0.7} textAlign="end">
              <TextTable>
                <FormatNumber
                  number={validator.commission}
                  fontSizeDecimal={11.5}
                />
                &ensp;%
              </TextTable>
            </Table.TextCell>
            <Table.TextCell paddingX={5} textAlign="end" isNumber>
              <TextTable>
                <Tooltip
                  content={`${formatNumber(parseFloat(validator.power))} 
                ${CYBER.DENOM_CYBER.toUpperCase()}`}
                >
                  <TextTable>
                    {formatCurrency(
                      validator.power,
                      CYBER.DENOM_CYBER.toUpperCase()
                    )}
                  </TextTable>
                </Tooltip>
              </TextTable>
            </Table.TextCell>
            <Table.TextCell paddingX={5} textAlign="end" isNumber>
              <TextTable>
                <FormatNumber
                  number={validator.stakingPool}
                  fontSizeDecimal={11.5}
                />
                &ensp;%
              </TextTable>
            </Table.TextCell>
            <Table.TextCell paddingX={5} textAlign="end">
              <TextTable>
                <FormatNumber
                  number={validator.shares}
                  fontSizeDecimal={11.5}
                />
                &ensp;%
              </TextTable>
            </Table.TextCell>
            <Table.TextCell paddingX={5} textAlign="end" isNumber>
              <Tooltip
                content={`${formatNumber(
                  Math.floor(
                    parseFloat(
                      validator.delegation !== undefined
                        ? validator.delegation
                        : 0
                    )
                  )
                )} 
                ${CYBER.DENOM_CYBER.toUpperCase()}`}
              >
                <TextTable>
                  {formatCurrency(
                    parseFloat(
                      validator.delegation !== undefined
                        ? validator.delegation
                        : 0
                    ),
                    CYBER.DENOM_CYBER.toLocaleUpperCase()
                  )}
                </TextTable>
              </Tooltip>
            </Table.TextCell>
            {showJailed && (
              <Table.TextCell paddingX={5} flex={1} textAlign="end" isNumber>
                <TextTable>{validator.height}</TextTable>
              </Table.TextCell>
            )}
          </Table.Row>
        );
      });
    return (
      <div>
        <main className="block-body">
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            <Text fontSize="16px" color="#fff">
              If all heroes collectively will be able to gather 100 heroes, and
              this number can last for 10000 blocks, additionally 2 TCYB will be
              allocated to heroes who take part in{' '}
              <Link to="/search/Genesis">Genesis</Link>. If the number of heroes
              will increase to or over 146, additional 3 TCYB will be allocated.
              All rewards in that discipline will be distributed to validators
              per capita.
            </Text>
          </Pane>
          <Pane
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Tablist marginBottom={24}>
              <Link to="/heroes">
                <Tab
                  key="Active"
                  id="Active"
                  isSelected={selected === 'active'}
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
              </Link>
              <Link to="/heroes/jailed">
                <Tab
                  key="Jailed"
                  id="Jailed"
                  isSelected={selected === 'jailed'}
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
              </Link>
            </Tablist>
          </Pane>

          <Table>
            <Table.Head
              style={{
                backgroundColor: '#000',
                borderBottom: '1px solid #ffffff80',
                marginTop: '10px',
                paddingBottom: '10px',
              }}
            >
              <Table.TextHeaderCell
                paddingX={5}
                textAlign="center"
                flexBasis={60}
                flex="none"
              >
                <TextTable fontSize={14}>#</TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell textAlign="center" paddingX={5}>
                <TextTable fontSize={13}>
                  {T.validators.table.moniker}
                </TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flex={0.7} paddingX={5} textAlign="center">
                <TextTable fontSize={13} whiteSpace="nowrap">
                  {T.validators.table.commissionProcent}
                </TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell paddingX={5} textAlign="center">
                <TextTable fontSize={13}>{T.validators.table.power}</TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell paddingX={5} textAlign="center">
                <TextTable fontSize={13}>Power, %</TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell paddingX={5} textAlign="center">
                <TextTable fontSize={14}>
                  {T.validators.table.selfProcent}
                </TextTable>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell paddingX={5} textAlign="center">
                <TextTable fontSize={14}>
                  {T.validators.table.bondedTokens}{' '}
                  <Tooltip
                    position="bottom"
                    content="Amount of EUL ( tokens you bonded to validator in )"
                  >
                    <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
                  </Tooltip>
                </TextTable>
              </Table.TextHeaderCell>
              {showJailed && (
                <Table.TextHeaderCell paddingX={5} flex={1} textAlign="end">
                  <TextTable fontSize={14}>
                    {T.validators.table.unbonding}
                  </TextTable>
                </Table.TextHeaderCell>
              )}
            </Table.Head>
            <Table.Body
              style={{
                backgroundColor: '#000',
                overflowY: 'hidden',
                padding: 7,
              }}
            >
              {validatorRows}
            </Table.Body>
          </Table>
        </main>
        <ActionBarContainer
          updateTable={this.init}
          validators={validatorSelect}
          validatorsAll={validators}
          addressLedger={addressLedger}
        />
      </div>
    );
  }
}

export default Validators;
