import { Container } from 'unstated';

class LotteryContainer extends Container {
    state = {
        showResult: false,
        result: null,
        address: null,
    };

    checkTicket = async () => {
        const { address } = this.state;

        const result = await window.cyber.checkLotteryTicket(address);

        console.log('Lottery results: ', result);

        this.setState({
            showResult: true,
            result,
        });
    };

    onAddressChange = (event) => {
        this.setState({
            address: event.target.value,
        });
    }
}

export default new LotteryContainer();
