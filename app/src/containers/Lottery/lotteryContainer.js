import React from 'react';
import { Container } from 'unstated';

class LotteryContainer extends Container {
    state = {
        showResult: false,
        result: null,
    };

    addressInput = React.createRef();

    checkTicket = async () => {
        const address = this.addressInput.current.value;

        const result = await window.cyber.checkLotteryTicket(address);

        console.log('Lottery results: ', result);

        this.setState({
            showResult: true,
            result,
        });
    };
}

export default new LotteryContainer();
