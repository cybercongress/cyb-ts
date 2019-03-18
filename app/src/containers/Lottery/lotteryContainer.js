import React from 'react';
import { Container } from 'unstated';

class LotteryContainer extends Container {
    state = {
        showResult: false,
        winningTicket: false,
    };

    addressInput = React.createRef();

    checkTicket = () => {
        const address = this.addressInput.current.value;

    };

    showResult = () => {
        this.setState({ showResult: true });
    };
}

export default new LotteryContainer();
