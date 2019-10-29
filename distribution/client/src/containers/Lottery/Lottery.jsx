import React from 'react';
import { Provider, Subscribe } from 'unstated';
import {
    ScrollContainer,
    MainContainer,
    Pane,
    Text,
    Input,
    Button,
    CardAccount
} from '@cybercongress/ui';
import lotteryContainer from './lotteryContainer';

const showResult = true,
    result = {
        addressEth: '0x92dF5e8886dA04fe4EB648d46e1Eeaaaa92256E5',
        balanceEth: 10,
        addressCyberd: 'cyber1f9yjqmxh6prsmgpcaqj8lmjnxg644n5074zznm',
        balanceCyberd: 100
    },
    isInvalidAddress = false;

const Lottery = () => (
    // <Provider>
    //     <Subscribe to={ [lotteryContainer] }>
    //         { (container) => {
    //             const { showResult, result, isInvalidAddress } = container.state;

    // return (
    <ScrollContainer>
        <MainContainer>
            <Pane
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                paddingBottom={60}
            >
                <Pane
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    marginBottom={42}
                >
                    <Text lineHeight={1.5} color="#fff" fontSize="29px">
                        Try your luck!
                    </Text>
                    <Text lineHeight={1.5} color="#fff" fontSize="29px">
                        Check if you have some CYB tokens
                    </Text>
                </Pane>
                <Pane
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    marginBottom={50}
                >
                    <Input
                        noFocus
                        width="100%"
                        height={42}
                        marginRight={20}
                        backgroundColor="transparent"
                        outline="0"
                        style={{
                            caretColor: '#36d6ae'
                        }}
                        placeholder="paste your Ethereum address"
                        //   onChange={ container.onAddressChange }
                        isInvalid={isInvalidAddress}
                    />
                    <Button
                        style={{
                            color: '#fff',
                            backgroundImage:
                                'linear-gradient(to top, #ec407a, #e91e63)'
                        }}
                        paddingX={50}
                        height={42}
                        className="btn-check"
                        //   onClick={ () => container.checkTicket() }
                    >
                        Check
                    </Button>
                </Pane>
                {showResult && (
                    <Pane>
                        <CardAccount
                            addressEth={result.addressEth}
                            balanceEth={result.balanceEth}
                            addressCyberd={result.addressCyberd}
                            balanceCyberd={result.balanceCyberd}
                        />
                    </Pane>
                )}
            </Pane>
        </MainContainer>
    </ScrollContainer>
    //             );
    //         } }
    //     </Subscribe>
    // </Provider>
);

export default Lottery;
