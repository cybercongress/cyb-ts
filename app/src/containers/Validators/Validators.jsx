import React from 'react';
import { Provider, Subscribe } from 'unstated';
import {
    MainContainer, Title, Table, WalletTabs, WalletTab,
} from '@cybercongress/ui';
import validatorsContainer from '../validatorsContainer';

class Validators extends React.Component {
    async componentWillMount() {
        await validatorsContainer.getValidators();
    }

    render() {
        return (
            <Provider>
                <Subscribe to={ [validatorsContainer] }>
                    {(container) => {
                        const { validators, showJailed } = container.state;

                        const validatorsSorted = validators
                            .slice(0)
                            .sort((a, b) => (+a.tokens > +b.tokens ? -1 : 1));

                        const validatorRows = validatorsSorted
                            .filter(x => x.jailed === showJailed)
                            .map((validator, index) => {
                                const height = validator.jailed
                                    ? validator.unbonding_height : (validator.bond_height || 0);

                                return (
                                    <tr key={ validator.description.moniker }>
                                        <td>{ index + 1 }</td>
                                        <td>{ validator.description.moniker }</td>
                                        <td>{ validator.tokens }</td>
                                        <td>{ validator.operator_address }</td>
                                        <td>{ height }</td>
                                    </tr>
                                );
                            });

                        return (
                            <MainContainer>
                                <Title
                                  style={ {
                                    marginLeft: '0px', marginBottom: '30px', textAlign: 'center',
                                  } }
                                >
                                    Validators statistics:
                                </Title>

                                <WalletTabs>
                                    <WalletTab
                                      onClick={ container.showActive }
                                      isActive={ !showJailed }
                                    >
                                        Active
                                    </WalletTab>
                                    <WalletTab
                                      onClick={ container.showJailed }
                                      isActive={ showJailed }
                                    >
                                        Jailed
                                    </WalletTab>
                                </WalletTabs>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Power</th>
                                            <th>Address</th>
                                            <th>
                                                { showJailed ? 'Unbonding height' : 'Bond height' }
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {validatorRows}
                                    </tbody>
                                </Table>
                            </MainContainer>
                        );
                    }}
                </Subscribe>
            </Provider>
        );
    }
}

export default Validators;
