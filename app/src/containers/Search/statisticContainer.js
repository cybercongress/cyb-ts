import { Container } from 'unstated';

class StatisticContainer extends Container {
    state = {
        showBandwidth: false,

        bwRemained: 0,
        bwMaxValue: 0,

        linkPrice: 0,

        cidsCount: 0,
        linksCount: 0,
        accsCount: 0,
        blockNumber: 0,
    };

    init = () => {
        if (!window.cyber) {
            return;
        }

        window.cyber
            .onNewBlock(() => {
                this.setState(state => ({
                    blockNumber: state.blockNumber + 1,
                }));
            });
    };

    getStatistics = async () => {
        const [addressInfo, chainStatistics] = await Promise.all([
            window.cyber.getDefaultAddress(),
            window.cyber.getStatistics(),
        ]);

        this.setState({
            defaultAddress: addressInfo.address,
            balance: addressInfo.balance,

            bwRemained: addressInfo.remained,
            bwMaxValue: addressInfo.max_value,

            cidsCount: chainStatistics.cidsCount,
            linksCount: chainStatistics.linksCount,
            accsCount: chainStatistics.accsCount,
            blockNumber: +chainStatistics.height,
        });
    };
}

export default new StatisticContainer();
