import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Pane, Dialog, Tablist } from '@cybercongress/gravity';
import { Link, Switch, Route, Router } from 'react-router-dom';
import Dinamics from '../funding/dinamics';
import Statistics from '../funding/statistics';
import Table from './table';
import ActionBarTakeOff from '../funding/actionBar';
import {
  asyncForEach,
  formatNumber,
  trimString,
  getTimeRemaining,
} from '../../utils/utils';
import { Loading, LinkWindow, Copy, TabBtn } from '../../components';
import {
  COSMOS,
  TAKEOFF,
  TAKEOFF_SUPPLY,
  GENESIS_SUPPLY,
  CYBER,
} from '../../utils/config';
import {
  cybWon,
  funcDiscount,
  getEstimation,
  getDataPlot,
  getRewards,
  //   getGroupAddress,
  funcDiscountRevers,
} from '../../utils/fundingMath';
import { getTxCosmos } from '../../utils/search/utils';
// import PopapAddress from './popap';
import Details from '../funding/details';
import Quotes from '../funding/quotes';

import { getGroupAddress } from './utils';
import testTx from './test';

function PortPages({ mobile }) {
  // async componentDidMount() {
  //   // const encoded = Buffer.from(
  //   //   'cyber1hmkqhy8ygl6tnl5g8tc503rwrmmrkjcq4878e0'
  //   // ).toString('hex');
  //   // const decoded = Buffer.from(encoded, 'hex').toString();
  //   // console.log('encoded', `0x${encoded}`);
  //   // console.log('decoded', decoded);

  //   this.chekPathname();
  //   this.tableData();
  // }

  // componentDidUpdate(prevProps) {
  //   const { location } = this.props;
  //   if (prevProps.location.pathname !== location.pathname) {
  //     this.chekPathname();
  //   }
  // }

  const tableData = async () => {
    const groupsAddress = getGroupAddress(testTx);
    this.setState({
      groups: groupsAddress,
    });
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (
      pathname.match(/progress/gm) &&
      pathname.match(/progress/gm).length > 0
    ) {
      this.select('progress');
    } else if (
      pathname.match(/leaderboard/gm) &&
      pathname.match(/leaderboard/gm).length > 0
    ) {
      this.select('leaderboard');
    } else {
      this.select('manifest');
    }
  };

  const initClock = () => {
    try {
      const deadline = `${COSMOS.TIME_END}`;
      const startTime = Date.parse(deadline) - Date.parse(new Date());
      if (startTime <= 0) {
        this.setState({
          time: 'end',
        });
      } else {
        initializeClock(deadline);
      }
    } catch (error) {
      this.setState({
        time: '∞',
      });
    }
  };

  const initializeClock = (endtime) => {
    let timeinterval;
    const updateClock = () => {
      const t = getTimeRemaining(endtime);
      if (t.total <= 0) {
        clearInterval(timeinterval);
        this.setState({
          time: 'end',
        });
        return true;
      }
      const hours = `0${t.hours}`.slice(-2);
      const minutes = `0${t.minutes}`.slice(-2);
      this.setState({
        time: `${t.days}d:${hours}h:${minutes}m`,
      });
    };

    updateClock();
    timeinterval = setInterval(updateClock, 10000);
  };

  onClickPopapAdress = () => {
    this.setState({
      popapAdress: false,
    });
  };

  onClickPopapAdressTrue = () => {
    this.setState({
      popapAdress: true,
    });
  };

  select = (selected) => {
    this.setState({ selected });
  };

  // render() {
  //   const {
  //     groups,
  //     atomLeff,
  //     currentPrice,
  //     dataPlot,
  //     dataAllPin,
  //     dataRewards,
  //     pin,
  //     loader,
  //     popapAdress,
  //     time,
  //     selected,
  //     estimation,
  //     amount,
  //   } = this.state;
  //   const { mobile } = this.props;
  let content;

  // if (loader) {
  //   return (
  //     <div
  //       style={{
  //         width: '100%',
  //         height: '50vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <Loading />
  //       <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
  //         Recieving transactions
  //       </div>
  //     </div>
  //   );
  // }

  if (selected === 'progress') {
    content = (
      <Dinamics
        mobile={mobile}
        cap={40 * estimation + 1000000}
        data3d={dataPlot}
      />
    );
  }

  if (selected === 'leaderboard') {
    content = <Table mobile={mobile} data={groups} pin={pin} />;
  }

  if (selected === 'manifest') {
    content = <Details />;
  }

  return (
    <span>
      {/* {popapAdress && (
          <PopapAddress
            address={COSMOS.ADDR_FUNDING}
            onClickPopapAdress={this.onClickPopapAdress}
          />
        )} */}

      <main className="block-body takeoff">
        <Quotes />
        {!pin && (
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginTop={5}
            marginBottom={20}
          >
            <Text fontSize="16px" color="#fff">
              Takeoff is the key element during the{' '}
              <Link to="/gol">Game of Links</Link> on the path for deploying
              Superintelligence. Please, thoroughly study details before
              donating. But remember - the more you wait, the higher the price.
            </Text>
          </Pane>
        )}
        {pin && (
          <Table
            styles={{ marginBottom: 20, marginTop: 0 }}
            data={groups}
            onlyPin
            pin={pin}
          />
        )}
        <Statistics
          atomLeff={100000 - estimation}
          time={time}
          price={currentPrice}
          discount={TAKEOFF.DISCOUNT_TILT_ANGLE}
          amount={amount}
        />
        <Tablist className="tab-list" marginY={20}>
          <TabBtn
            text="Leaderboard"
            isSelected={selected === 'leaderboard'}
            to="/port/leaderboard"
          />
          <TabBtn
            text="Manifest"
            isSelected={selected === 'manifest'}
            to="/port"
          />
          <TabBtn
            text="Progress"
            isSelected={selected === 'progress'}
            to="/port/progress"
          />
        </Tablist>
        {content}
      </main>
      <ActionBarTakeOff
        initClock={this.initClock}
        end={100000 - estimation}
        onClickPopapAdressTrue={this.onClickPopapAdressTrue}
        mobile={mobile}
        time={time}
      />
    </span>
  );
  // }
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(PortPages);
