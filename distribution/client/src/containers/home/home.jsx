import React, { PureComponent } from 'react';
import { Button, Input, Pane, SearchItem } from '@cybercongress/gravity';
import { Electricity } from './electricity';

const tilde = require('../../image/tilde.svg');

const grade = {
  from: 0.0001,
  to: 0.1,
  value: 4
};
const grade1 = {
  from: 0.0001,
  to: 0.1,
  value: 6
};
const grade2 = {
  from: 0.0001,
  to: 0.1,
  value: 1
};

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueSearchInput: '',
      result: false
    };
  }

  onChangeInput = async e => {
    await this.setState({
      valueSearchInput: e.target.value
    });
  };

  render() {
    const { valueSearchInput } = this.state;
    console.log(valueSearchInput.length);
    return (
      <main className="block-body-home">
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={valueSearchInput.length ? 0.3 : 0.7}
          transition="flex 0.5s"
        >
          <Input
            width="60%"
            placeholder="joint for validators"
            value={valueSearchInput}
            onChange={e => this.onChangeInput(e)}
          />
        </Pane>
        {valueSearchInput.length > 0 && (
          <Pane>
            <SearchItem
              key="1"
              hash="sdfsdfsdf2345fsdfs"
              rank={4}
              grade={grade}
              status="success"
              // onClick={e => container.openLink(e, links[cid].content)}
            >
              {valueSearchInput}
            </SearchItem>
            <SearchItem
              key="2"
              hash="sdfsdfsdf2345fsdfs"
              rank={6}
              grade={grade1}
              status="loading"
              // onClick={e => container.openLink(e, links[cid].content)}
            >
              {valueSearchInput}
            </SearchItem>
            <SearchItem
              key="3"
              hash="sdfsdfsdf2345fsdfs"
              rank={1}
              grade={grade2}
              status="success"
              // onClick={e => container.openLink(e, links[cid].content)}
            >
              {valueSearchInput}
            </SearchItem>
          </Pane>
        )}
        {valueSearchInput.length === 0 && (
          <Pane
            flex={0.3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-around"
          >
            <Pane width="60%" marginY={0} marginX="auto">
              <Electricity />
            </Pane>
            <a href="https://cybercongress.ai" target="_blank">
              <img style={{ width: 20, height: 20 }} src={tilde} alt="tilde" />
            </a>
          </Pane>
        )}
      </main>
    );
  }
}

export default Home;
