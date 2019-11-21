import React, { PureComponent } from 'react';
import { Button, Input, Pane, SearchItem, Text } from '@cybercongress/gravity';
import { Electricity } from './electricity';
import { getIpfsHash, search, getRankGrade } from '../../utils/search/utils';
import { formatNumber } from '../../utils/utils';

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
    };
  }

  // componentDidMount() {
  //   localStorage.setItem('LAST_DURA', '');
  // }

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
    if (e.key === 'Enter') {
      let searchResults = [];
      searchResults = await search(await getIpfsHash(valueSearchInput));
      searchResults.map((item, index) => {
        searchResults[index].cid = item.cid;
        searchResults[index].rank = formatNumber(item.rank, 6);
        searchResults[index].grade = getRankGrade(item.rank);
      });
      console.log('searchResults', searchResults);
      this.setState({
        searchResults,
        result: true,
      });
    }
  };

  render() {
    const { valueSearchInput, result, searchResults } = this.state;

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
      <main className="block-body-home">
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={result ? 0.3 : 0.9}
          transition="flex 0.5s"
        >
          <Input
            width="60%"
            placeholder="joint for validators"
            value={valueSearchInput}
            onChange={e => this.onChangeInput(e)}
            onKeyPress={this.handleKeyPress}
          />
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
              {`The answer for ${searchItems.length}`}
            </Text>
            <Pane>{searchItems}</Pane>
          </Pane>
        )}
        {!result && (
          <Pane
            position="absolute"
            bottom={0}
            left="50%"
            marginRight="-50%"
            transform="translate(-50%, -50%)"
          >
            {/* <Pane
              width="60%"
              display="flex"
              justifyContent="space-between"
              marginY={0}
              marginX="auto"
            >
              <a href="https://cyberd.ai/" target="_blank">
                <img style={{ height: 100 }} src={cyber} />
              </a>
              <Electricity />
              <a href="https://cyb.ai/" target="_blank">
                <img style={{ width: 100, height: 100 }} src={cyb} />
              </a>
            </Pane> */}
            <a
              style={{ fontSize: '60px' }}
              href="https://cybercongress.ai"
              target="_blank"
            >
              {/* <img style={{ width: 20, height: 20 }} src={tilde} alt="tilde" /> */}
              ~
            </a>
          </Pane>
        )}
      </main>
    );
  }
}

export default Home;
