import { Container } from 'unstated';

class ChainContainer extends Container {
    state = {
        showBandwidth: false,

        defaultAddress: null,
        balance: 0,

        bwRemained: 0,
        bwMaxValue: 0,

        cidsCount: 0,
        linksCount: 0,
        accsCount: 0,
        blockNumber: 0,
        time: 0,

        validators: [],
        jailedFilter: false,
    };

    init = async () => {
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

        await this.getStatistics();
    };

    getStatistics = async () => new Promise((resolve) => {
        Promise.all([
            window.cyber.getDefaultAddress(),
            window.cyber.getStatistics(),
            window.cyber.getValidators(),
        ])
            .then(([addressInfo, chainStatistics, validators]) => {
                const lastBlockMs = chainStatistics.latest_block_time;
                const diffMSeconds = new Date().getTime() - new Date(lastBlockMs).getTime();

                this.setState({
                    validators,

                    defaultAddress: addressInfo.address,
                    balance: addressInfo.balance,

                    bwRemained: addressInfo.remained,
                    bwMaxValue: addressInfo.max_value,

                    cidsCount: chainStatistics.cidsCount,
                    linksCount: chainStatistics.linksCount,
                    accsCount: chainStatistics.accsCount,
                    blockNumber: +chainStatistics.height,
                    time: Math.round(diffMSeconds / 1000),
                }, resolve);
            });
    });

    handleMouseEnter = () => {
        this.setState({ showBandwidth: true });
    };

    handleMouseLeave = () => {
        this.setState({ showBandwidth: false });
    };

    showActive = () => {
        this.setState({ jailedFilter: false });
    };

    showJailed = () => {
        this.setState({ jailedFilter: true });
    };
}

export default new ChainContainer();
