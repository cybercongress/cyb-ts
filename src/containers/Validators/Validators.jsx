import React from 'react';
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
  TextEv as Text,
} from '@cybercongress/gravity';
import validatorsContainer from './validatorsContainer';
import validatorsData from './validatorsData';

class Validators extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validators: [],
      showJailed: false,
      activeValidatorsCount: 0,
    };
  }

  async componentDidMount() {
    this.getValidators();
  }

  getValidators = async () => {
    // let validators = await window.cyber.getValidators();
    let validators = validatorsData;

    validators = validators
      .slice(0)
      .sort((a, b) => (+a.tokens > +b.tokens ? -1 : 1));

    const activeValidatorsCount = validators.filter(
      validator => !validator.jailed
    ).length;

    this.setState({
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
    const { validators, showJailed, activeValidatorsCount } = this.state;

    const validatorRows = validators
      .filter(validator => validator.jailed === showJailed)
      .map((validator, index) => {
        const height = validator.jailed
          ? validator.unbonding_height
          : validator.bond_height || 0;
        const commission = (validator.commission.rate * 100).toFixed(0);
        const powerFloat = validator.tokens / 1000000000;
        const power = Math.round(powerFloat * 1) / 1;

        let statusColor;

        switch (validator.status) {
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

        const statusTooltip = (
          <Pane display="flex" alignItems="center">
            <Tooltip
              appearance="card"
              content={
                <Pane
                  display="flex"
                  alignItems="center"
                  paddingX={18}
                  paddingY={18}
                >
                  <Text>
                    Validator status:&nbsp;
                    {validator.status === 0 && 'unbonded'}
                    {validator.status === 1 && 'unbonding'}
                    {validator.status === 2 && 'bonded'}
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

        return (
          <Table.Row
            borderBottom="none"
            //   boxShadow='0px 0px 0.1px 0px #ddd'
            //   className='validators-table-row'
            isSelectable
            key={index}
          >
            <Table.TextCell textAlign="center" width={35} flex="none">
              {statusTooltip}
            </Table.TextCell>
            <Table.TextCell
              textAlign="end"
              flexBasis={60}
              flexShrink={0}
              flexGrow={0}
              isNumber
            >
              <span style={{ color: '#fff', fontSize: 13 }}>{index + 1}</span>
            </Table.TextCell>
            <Table.TextCell>
              <span style={{ color: '#fff', fontSize: 13 }}>
                {validator.description.moniker}
              </span>
            </Table.TextCell>
            <Table.TextCell
              textAlign="end"
              flexBasis={80}
              flexShrink={0}
              flexGrow={0}
              isNumber
            >
              <span style={{ color: '#fff', fontSize: 13 }}>{power}</span>
            </Table.TextCell>
            <Table.TextCell textAlign="end" flexGrow={1}>
              <span style={{ color: '#fff', fontSize: 13 }}>{commission}</span>
            </Table.TextCell>
            <Table.TextCell textAlign="end" flexGrow={3}>
              <span style={{ color: '#fff', fontSize: 13 }}>
                {validator.operator_address}
              </span>
            </Table.TextCell>
            <Table.TextCell
              textAlign="end"
              flexShrink={0}
              flexGrow={0.8}
              isNumber
            >
              <span style={{ color: '#fff', fontSize: 13 }}>{height}</span>
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
            <Table.TextHeaderCell
              textAlign="end"
              flexBasis={60}
              flexShrink={0}
              flexGrow={0}
            >
              <span style={{ color: '#fff', fontSize: 16 }}>Rank</span>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell flexGrow={1}>
              <span style={{ color: '#fff', fontSize: 16 }}>Name</span>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell
              textAlign="end"
              flexBasis={80}
              flexShrink={0}
              flexGrow={0}
            >
              <span style={{ color: '#fff', fontSize: 16 }}>Power (GCYB)</span>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell flexGrow={1} textAlign="end">
              <span style={{ color: '#fff', fontSize: 16 }}>
                Commission (%)
              </span>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="end" flexGrow={3}>
              <span style={{ color: '#fff', fontSize: 16 }}>Address</span>
            </Table.TextHeaderCell>
            <Table.TextHeaderCell textAlign="end" flexShrink={0} flexGrow={0.8}>
              <span style={{ color: '#fff', fontSize: 16 }}>
                {showJailed ? 'Unbonding height' : 'Bond height'}
              </span>
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
