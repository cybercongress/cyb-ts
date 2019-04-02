import { Container } from 'unstated';

class StatisticContainer extends Container {
    state = {
        showBandwidth: false,

        bwRemained: 0,
        bwMaxValue: 0,

        cidsCount: 0,
        linksCount: 0,
        accsCount: 0,
        txCount: 0,
        blockNumber: 0,

        totalCyb: 0,
        stakedCyb: 0,
        linkPrice: 0,
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

        const bondedTokens = +chainStatistics.bondedTokens;
        const notBondedTokens = +chainStatistics.notBondedTokens;

        const totalCyb = bondedTokens + notBondedTokens;
        const stakedCyb = (bondedTokens / totalCyb * 100).toFixed(0);
        const linkPrice = (400 * +chainStatistics.bandwidthPrice).toFixed(0);

        this.setState({
            defaultAddress: addressInfo.address,
            balance: addressInfo.balance,

            bwRemained: addressInfo.remained,
            bwMaxValue: addressInfo.max_value,

            cidsCount: chainStatistics.cidsCount,
            linksCount: chainStatistics.linksCount,
            accsCount: chainStatistics.accsCount,
            txCount: chainStatistics.txCount,
            blockNumber: +chainStatistics.height,

            totalCyb,
            stakedCyb,
            linkPrice,
        });
    };
}

export default new StatisticContainer();
