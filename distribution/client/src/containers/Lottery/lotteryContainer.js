import { Container } from 'unstated';

class LotteryContainer extends Container {
    state = {
        showResult: false,
        result: null,
        address: null,
        isInvalidAddress: false,
    };

    checkTicket = async () => {
        const { address } = this.state;

        if (!/0x[a-fA-F0-9]{40}/.test(address)) {
            this.setState({
                isInvalidAddress: true,
            });
        } else {
            const result = await window.cyber.checkLotteryTicket(address);

            console.log('Lottery results: ', result);

            this.setState({
                showResult: true,
                result,
                isInvalidAddress: false,
            });
        }
    };

    onAddressChange = (event) => {
        this.setState({
            address: event.target.value,
            isInvalidAddress: false,
        });
    }
}

export default new LotteryContainer();
