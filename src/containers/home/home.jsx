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
    if (valueSearchInput.length > 0) {
      if (e.key === 'Enter') {
        console.log('f');
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
      loading: false,
    });
  };

  render() {
    const {
      valueSearchInput,
      result,
      searchResults,
      loading,
      targetColor,
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
      <main className="block-body-home">
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={result ? 0.3 : 0.9}
          transition="flex 0.5s"
        >
          <input
            style={{
              width: '60%',
              height: 41,
              marginRight: 15,
              fontSize: 20,
            }}
            placeholder="joint for validators"
            value={valueSearchInput}
            onChange={e => this.onChangeInput(e)}
            onKeyPress={this.handleKeyPress}
            className="search-input"
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

        {!result && (
          <Pane
            position="absolute"
            bottom={0}
            left="50%"
            marginRight="-50%"
            transform="translate(-50%, -50%)"
          >
            <button
              className="btn-home"
              onClick={e => this.onCklicBtn()}
              style={{
                backgroundColor: `${targetColor ? '#3ab793' : '#000'}`,
                color: `${targetColor ? '#fff' : '#3ab793'}`,
                opacity: `${valueSearchInput.length !== 0 ? 1 : 0}`,
              }}
            >
              cyber
            </button>

            <a
              style={{
                fontSize: '60px',
                transition: '0.4s',
                display: `${valueSearchInput.length === 0 ? 'block' : 'none'}`,
                opacity: `${valueSearchInput.length === 0 ? 1 : 0}`,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                marginRight: '-50%',
                left: '50%',
                bottom: '0px',
                height: '42px',
              }}
              href="https://cybercongress.ai"
              target="_blank"
            >
              ~
            </a>
          </Pane>
        )}
      </main>
    );
  }
}

export default Home;
