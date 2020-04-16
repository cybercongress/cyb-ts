import React, { PureComponent } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { StartState } from './stateActionBar';
import { Loading } from '../../components';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueSearchInput: '',
      result: false,
      searchResults: [],
      loading: false,
      targetColor: false,
      boxShadow: 3,
      keywordHash: '',
      resultNull: false,
      query: '',
      drop: false,
    };
    this.routeChange = this.routeChange.bind(this);
  }

  routeChange = newPath => {
    const { history } = this.props;
    const path = newPath;
    history.push(path);
  };

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
    const { funcUpdate } = this.props;

    if (valueSearchInput.length > 0) {
      if (e.key === 'Enter') {
        this.setState({
          targetColor: true,
        });
        this.chengColorButton();
        this.setState({
          loading: true,
        });
        this.routeChange(`/search/${valueSearchInput}`);
        funcUpdate(valueSearchInput);
      }
    }
  };

  onCklicBtn = () => {
    const { valueSearchInput } = this.state;
    const { funcUpdate } = this.props;

    if (valueSearchInput.length > 0) {
      this.setState({
        loading: true,
      });
      this.routeChange(`/search/${valueSearchInput}`);
      funcUpdate(valueSearchInput);
    }
  };

  chengColorButton = () => {
    setTimeout(() => {
      this.setState({
        targetColor: false,
      });
    }, 200);
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
      loading,
      targetColor,
      boxShadow,
    } = this.state;

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Loading />
          <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
            Searching
          </div>
        </div>
      );
    }

    return (
      <div style={{ position: `${!result ? 'relative' : ''}` }}>
        <main
          onMouseMove={e => this.showCoords(e)}
          className={!result ? 'block-body-home' : 'block-body'}
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
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
              value={valueSearchInput}
              onChange={e => this.onChangeInput(e)}
              onKeyPress={this.handleKeyPress}
              className="search-input"
              id="search-input-home"
              autoComplete="off"
              autoFocus
            />
            <Link style={{ marginTop: 50 }} to="/gol">
              <Pane>Join Game of Links</Pane>
            </Link>
          </Pane>
        </main>
        <StartState
          targetColor={targetColor}
          valueSearchInput={valueSearchInput}
          onClickBtn={this.onCklicBtn}
        />
      </div>
    );
  }
}

export default Home;
