import React from 'react';
import { Provider, Subscribe } from 'unstated';
import {
    MainContainer, Title, Input, Button,
} from '@cybercongress/ui';
import lotteryContainer from './lotteryContainer';

class Lottery extends React.Component {

    render() {

        return (
            <Provider>
                <Subscribe to={ [lotteryContainer] }>
                    { (container) => {
                        const { showResult, result } = container.state;

                        return (
                            <MainContainer>
                                <Title
                                    style={ {
                                        marginLeft: '0px',
                                        marginBottom: '30px',
                                        textAlign: 'center',
                                    } }
                                >
                                    Lottery
                                </Title>

                                <Input
                                    inputRef={ container.addressInput }
                                />

                                <Button onClick={ container.checkTicket }>Check</Button>

                                {showResult && result
                                    && (
                                        <span>
                                            your address: {result.address}
                                            yoor balance: {result.balance} CYB
                                        </span>
                                )}

                                {showResult && !result
                                    && (
                                        <span>
                                            you lose :(
                                        </span>
                                )}

                            </MainContainer>
                        )}
                    }
                </Subscribe>
            </Provider>
        );
    }
}

export default Lottery;
