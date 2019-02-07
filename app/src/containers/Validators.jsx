import React from 'react';

import {
	Title,
	Table,
	TableCybLink,
	WalletTabs,
	WalletTab
} from '@cybercongress/ui';

class Validators extends React.Component {
	state = {
		jailedFilter: false,
	}

	showActive = () => {
		this.setState({ jailedFilter: false })
	}

	showJailed = () => {
		this.setState({ jailedFilter: true })
	}

	render() {
		const { validators } = this.props;
		const { jailedFilter } = this.state;
		const validatorsSorted = validators.slice(0).sort((a, b) => +a.tokens > +b.tokens ? 1 : -1);
        const validatorRows = validatorsSorted.filter(x => x.jailed === jailedFilter).map((validator, index) => (
            <tr key={validator.description.moniker}>
                <td>{index}</td>
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
                      onClick={ this.showActive }
                      isActive={ !jailedFilter }
                    >
                        Active
                    </WalletTab>
                    <WalletTab
                      onClick={ this.showJailed }
                      isActive={ jailedFilter }
                    >
                        Jailed
                    </WalletTab>
                </WalletTabs>
                <TableCybLink>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Power</th>
                            <th>Address</th>
                            <th>Boun height</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validatorRows}
                    </tbody>
                </TableCybLink>
            </div>
		);
	}
}

export default Validators;
