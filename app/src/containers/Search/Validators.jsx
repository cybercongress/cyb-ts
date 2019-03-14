import React from 'react';
import {
    Title, Table, WalletTabs, WalletTab,
} from '@cybercongress/ui';
import { Subscribe } from 'unstated';
import chainContainer from '../chainContainer';

const Validators = () => (
    <Subscribe to={ [chainContainer] }>
        {(container) => {
            const { validators, jailedFilter } = container.state;

            const validatorsSorted = validators
                .slice(0)
                .sort((a, b) => (+a.tokens > +b.tokens ? -1 : 1));

            const validatorRows = validatorsSorted
                .filter(x => x.jailed === jailedFilter)
                .map((validator, index) => (
                    <tr key={ validator.description.moniker }>
                        <td>{index + 1}</td>
                        <td>{validator.description.moniker}</td>
                        <td>{validator.tokens}</td>
                        <td>{validator.operator_address}</td>
                        <td>{validator.bond_height}</td>
                    </tr>
                ));

            return (
                <div>
                    <Title style={ { marginLeft: '0px', marginBottom: '30px', textAlign: 'center' } }>
                        Validators statistics:
                    </Title>

                    <WalletTabs>
                        <WalletTab
                          onClick={ container.showActive }
                          isActive={ !jailedFilter }
                        >
                            Active
                        </WalletTab>
                        <WalletTab
                          onClick={ container.showJailed }
                          isActive={ jailedFilter }
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
                                <th>Bond height</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validatorRows}
                        </tbody>
                    </Table>
                </div>
            );
        }}
    </Subscribe>
);

export default Validators;
