import React, { PureComponent } from "react";
import withWeb3 from "../../components/web3/withWeb3";
import { ActionBar, ContainerCard } from "../../components";
import { Statistics } from "./statistics";
import { VitalikJae } from "./vitalikJae";
import {
    asyncForEach,
    formatNumber,
    roundNumber,
    run
} from "../../utils/utils";
import { wsURL } from "../../utils/config";

const url =
    "https://herzner1.cybernode.ai/cyber12psudf4rpaw4jwhuyx3y8sejhsynae7ggvzvy8";

const currenciesUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=eth";

class Got extends PureComponent {
    controller = new AbortController();
    ws = new WebSocket(wsURL);

    constructor(props) {
        super(props);
        this.state = {
            ATOMsRaised: 0,
            ETHRaised: 0,
            dataTxs: null,
            difference: {},
            arow: 0,
            loading: true,
            raised: null
        };
    }

    componentDidMount() {
        const { web3 } = this.props;
        this.connect();
        const subscription = web3.eth.subscribe(
            "logs",
            {
                address: "0x6c9c39d896b51e6736dbd3da710163903a3b091b",
                topics: [
                    "0xe054057d0479c6218d6ec87be73f88230a7e4e1f064cee6e7504e2c4cd9d6150"
                ]
            },
            (error, result) => {
                if (!error) {
                    run(this.getStatistics);
                    run(this.getArbitrage);
                    console.log(result);
                }
            }
        );

        subscription.unsubscribe((error, success) => {
            if (success) console.log("Successfully unsubscribed!");
        });
    }

    componentWillUnmount() {
        this.controller.abort();
        // unsubscribes the subscription
    }

    connect = () => {
        this.ws.onopen = () => {
            console.log("connected");
        };
        this.ws.onmessage = async evt => {
            const message = JSON.parse(evt.data);
            console.log("txs", message);
            this.setState({
                dataTxs: message,
                loading: false
            });
            this.getEthAtomCourse();
        };

        this.ws.onclose = () => {
            console.log("disconnected");
        };
    };

    getEthAtomCourse = async () => {
        const {
            contract: { methods }
        } = this.props;
        // if(this.state.loading){
        const dailyTotals = await methods.dailyTotals(59).call();
        let ETHRaised = 0;
        let ATOMsRaised = 0;

        ETHRaised = Math.floor((dailyTotals / Math.pow(10, 18)) * 1000) / 1000;

        await asyncForEach(
            Array.from(Array(this.state.dataTxs.length).keys()),
            async item => {
                ATOMsRaised +=
                    Number.parseInt(
                        this.state.dataTxs[item].tx.value.msg[0].value.amount[0]
                            .amount
                    ) *
                    10 ** -1;
            }
        );

        // const response = await fetch(url, {
        //   signal: this.controller.signal
        // });
        // const data = await response.json();
        //  console.log(this.state.dataTxs);
        const currencies = await fetch(currenciesUrl, {
            signal: this.controller.signal
        });
        const course = await currencies.json();
        const raised = {
            ATOMsRaised,
            ETHRaised,
            course
        };
        // console.log(raised);
        this.setState({
            raised
        });
        // return raised;
        await this.getStatistics();
        this.getArbitrage();
        // }
    };

    getStatistics = async () => {
        const { raised } = this.state;
        console.log(raised);
        this.setState({
            ETHRaised: raised.ETHRaised,
            ATOMsRaised: raised.ATOMsRaised
        });
    };

    getArbitrage = () => {
      const { raised } = this.state;
        let ethRaised = 0;
        let AtomRaised = 0;
        let ethCYB = 0;
        let atomsCYB = 0;
        let difference = {};
        let arow = 0;
        let win = "";
        // debugger;s
        const cyb = 10 * Math.pow(10, 4);
            ethCYB = roundNumber(raised.ETHRaised / cyb, 7);
            atomsCYB = roundNumber(
                (raised.ATOMsRaised / cyb) *
                raised.course.cosmos.eth,
                7
            );
            ethRaised = roundNumber(raised.ETHRaised, 7);
            AtomRaised = roundNumber(
                (raised.ATOMsRaised) *
                raised.course.cosmos.eth,
                7
            );
            if (ethRaised > AtomRaised) {
                arow = -1 * (1 - AtomRaised / ethRaised) * 90;
                win = "eth";
                difference = {
                    win: "atom",
                    diff: ethCYB / atomsCYB
                };
            } else {
                arow = (1 - ethRaised / AtomRaised) * 90;
                win = "atom";
                difference = {
                    win: "eth",
                    diff: atomsCYB / ethCYB
                };
            }
            console.log('arow, win, difference', arow, win, difference);
            this.setState({
                arow,
                win,
                difference
            });
    };

    render() {
        const { ATOMsRaised, ETHRaised, difference, arow, win } = this.state;
        console.log(ATOMsRaised);
        const cyb = 10 * Math.pow(10, 4);
        return (
            <span>
                <main className="block-body">
                    {/* <span className="caption">Game of Thrones</span> */}
                    <Statistics
                        firstLeftTitle="ETH/CYB"
                        firstLeftValue={roundNumber(ETHRaised / cyb, 6)}
                        secondLeftTitle="Raised, ETH"
                        secondLeftValue={formatNumber(ETHRaised)}
                        secondRightTitle="Raised, ATOMs"
                        secondRightValue={formatNumber(ATOMsRaised)}
                        firstRightTitle="ATOM/CYB"
                        firstRightValue={roundNumber(ATOMsRaised / cyb, 6)}
                    />
                    <VitalikJae win={win} diff={difference} arow={arow} />
                    <ContainerCard>
                        <div className="container-text">
                            {/* <div className="paragraph">
                Get <a>THC</a> and participate <br /> in foundation
              </div>
              <div className="paragraph">Get 10% of CYBs for ETH</div> */}
                            {difference.win === "eth" && (
                                <div className="difference-container">
                                    <div className="difference-container-value">
                                        {roundNumber(difference.diff, 2)} x
                                    </div>
                                    <span className="difference-container-text">
                                        more profitable now
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="container-text">
                            {/* <div className="paragraph">
                Don't Get <a>THC</a>
              </div>
              <div className="paragraph">Get 10% of CYBs for ATOM</div> */}
                            {difference.win === "atom" && (
                                <div className="difference-container">
                                    <div className="difference-container-value">
                                        {roundNumber(difference.diff, 2)} x
                                    </div>
                                    <span className="difference-container-text">
                                        more profitable now
                                    </span>
                                </div>
                            )}
                        </div>
                    </ContainerCard>
                </main>
                <ActionBar />
            </span>
        );
    }
}

export default withWeb3(Got);
