import React, { PureComponent } from 'react';
import {
  Button,
  Input,
  Pane,
  SearchItem,
  Text,
  TextInput,
} from '@cybercongress/gravity';
import Electricity from './electricity';

import ActionBarContainer from './actionBar';

import { getIpfsHash, search, getRankGrade } from '../../utils/search/utils';
import { formatNumber } from '../../utils/utils';
import { Loading } from '../../components';

const cyb = require('../../image/logo-cyb-v2.svg');
const cyber = require('../../image/cyber.png');

const tilde = require('../../image/tilde.svg');

// const grade = {
//   from: 0.0001,
//   to: 0.1,
//   value: 4
// };

class Home extends PureComponent {
  constructor(props) {
    super(props);
    localStorage.setItem('LAST_DURA', '');
    this.state = {
      valueSearchInput: '',
      result: false,
      searchResults: [],
      loading: false,
      targetColor: false,
      boxShadow: 3,
      keywordHash: '',
    };
  }

  componentDidMount() {
    document.onkeypress = (e) => {
      document.getElementById('search-input-home').focus();
    };
  }

  onChangeInput = async e => {
    const { value } = e.target;
    if (value.length === 0) {
      await this.setState({
        result: false,
      });
    }
    await this.setState({
      valueSearchInput: value,
    });
  };

  handleKeyPress = async e => {
    const { valueSearchInput } = this.state;
    if (valueSearchInput.length > 0) {
      if (e.key === 'Enter') {
        this.setState({
          targetColor: true,
        });
        this.chengColorButton();
        this.setState({
          loading: true,
        });
        this.getSearch(valueSearchInput);
      }
    }
  };

  onCklicBtn = () => {
    const { valueSearchInput } = this.state;
    if (valueSearchInput.length > 0) {
      this.setState({
        loading: true,
      });
      this.getSearch(valueSearchInput);
    }
  };

  chengColorButton = () => {
    setTimeout(() => {
      this.setState({
        targetColor: false,
      });
    }, 200);
  };

  getSearch = async valueSearchInput => {
    let searchResults = [];
    const keywordHash = await getIpfsHash(valueSearchInput);
    searchResults = await search(keywordHash);
    searchResults.map((item, index) => {
      searchResults[index].cid = item.cid;
      searchResults[index].rank = formatNumber(item.rank, 6);
      searchResults[index].grade = getRankGrade(item.rank);
    });
    console.log('searchResults', searchResults);
    this.setState({
      searchResults,
      keywordHash,
      result: true,
      loading: false,
    });
  };

  showCoords = event => {
    let boxShadow = 0;

    const mX = event.pageX;
    const mY = event.pageY;
    const from = { x: mX, y: mY };

    const element = document.getElementById('search-input-home');
    const off = element.getBoundingClientRect();
    const { width } = off;
    const { height } = off;

    const nx1 = off.left;
    const ny1 = off.top;
    const nx2 = nx1 + width;
    const ny2 = ny1 + height;
    const maxX1 = Math.max(mX, nx1);
    const minX2 = Math.min(mX, nx2);
    const maxY1 = Math.max(mY, ny1);
    const minY2 = Math.min(mY, ny2);
    const intersectX = minX2 >= maxX1;
    const intersectY = minY2 >= maxY1;
    const to = {
      x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
      y: intersectY ? mY : ny2 < mY ? ny2 : ny1,
    };
    const distX = to.x - from.x;
    const distY = to.y - from.y;
    const hypot = Math.sqrt(distX * distX + distY * distY);
    // consoleelement = document.getElementById('some-id');.log(width, height);
    // console.log(`X coords: ${x}, Y coords: ${y}`);
    if (width > hypot) {
      boxShadow = ((width - hypot) / 100) * 2.5;
    }

    if (boxShadow < 5) {
      boxShadow = 6;
    }
    this.setState({
      boxShadow,
    });
  };

  render() {
    const {
      valueSearchInput,
      result,
      searchResults,
      loading,
      targetColor,
      boxShadow,
      keywordHash,
    } = this.state;

    const searchItems = searchResults.map(item => (
      <SearchItem
        key={item.cid}
        hash={item.cid}
        rank={item.rank}
        grade={item.grade}
        status="success"
        // onClick={e => (e, links[cid].content)}
      >
        {item.cid}
      </SearchItem>
    ));

    return (
      <div style={{ position: 'relative' }}>
        <main onMouseMove={e => this.showCoords(e)} className="block-body-home">
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex={result ? 0.3 : 0.9}
            transition="flex 0.5s"
            minHeight={100}
          >
            <input
              style={{
                width: '60%',
                height: 41,
                fontSize: 20,
                boxShadow: `0 0 ${boxShadow}px 0 #00ffa387`,
                textAlign: 'center',
              }}
              placeholder="joint for validators"
              value={valueSearchInput}
              onChange={e => this.onChangeInput(e)}
              onKeyPress={this.handleKeyPress}
              className="search-input"
              id="search-input-home"
              autoComplete="off"
            />
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bottom: '30%',
                }}
              >
                <Loading />
              </div>
            )}
          </Pane>
          {result && (
            <Pane
              width="90%"
              marginX="auto"
              marginY={0}
              display="flex"
              flexDirection="column"
            >
              <Text
                fontSize="20px"
                marginBottom={20}
                color="#949292"
                lineHeight="20px"
              >
                {`I found ${searchItems.length} results`}
              </Text>
              <Pane>{searchItems}</Pane>
            </Pane>
          )}

        </main>
        <ActionBarContainer
          home={!result}
          valueSearchInput={valueSearchInput}
          targetColor={targetColor}
          link={searchResults.length === 0 && result}
          keywordHash={keywordHash}
          onCklicBtnSearch={this.onCklicBtn}
        />
      </div>
    );
  }
}

export default Home;
