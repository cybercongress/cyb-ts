import { Container } from 'unstated';

class StatisticContainer extends Container {
    state = {
        showBandwidth: false,

        bwRemained: 0,
        bwMaxValue: 0,

        cidsCount: 0,
        linksCount: 0,
        accsCount: 0,
        blockNumber: 0,
        time: 0,
    };

    init = () => {
        if (!window.cyber) {
            return;
        }

        window.cyber
            .onNewBlock((event) => {
                this.setState({
                    blockNumber: this.state.blockNumber + 1,
                    time: 0,
                });
            });

        setInterval(() => {
            this.setState({
                time: this.state.time + 1,
            });
        }, 1000);

        this.getStatistics();
    };

    getStatistics = async () => {
        const [addressInfo, chainStatistics] = await Promise.all([
            window.cyber.getDefaultAddress(),
            window.cyber.getStatistics(),
        ]);

        const lastBlockMs = chainStatistics.latest_block_time;
        const diffMSeconds = new Date().getTime() - new Date(lastBlockMs).getTime();

        this.setState({
            defaultAddress: addressInfo.address,
            balance: addressInfo.balance,

            bwRemained: addressInfo.remained,
            bwMaxValue: addressInfo.max_value,

            cidsCount: chainStatistics.cidsCount,
            linksCount: chainStatistics.linksCount,
            accsCount: chainStatistics.accsCount,
            blockNumber: +chainStatistics.height,
            time: Math.round(diffMSeconds / 1000),
        });
    };

    onQueryUpdate = (query) => {
        if (query === '') {
            this.getStatistics();
        }
    };

    handleMouseEnter = () => {
        this.setState({ showBandwidth: true });
    };

    handleMouseLeave = () => {
        this.setState({ showBandwidth: false });
    };
}

export default new StatisticContainer();
