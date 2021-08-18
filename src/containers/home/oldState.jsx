<div style={{ position: `${!result ? 'relative' : ''}` }}>
  <main
    onMouseMove={(e) => this.showCoords(e)}
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
          boxShadow: `0 0 ${boxShadow}px 1.5px #00ffa387`,
          textAlign: 'center',
        }}
        value={valueSearchInput}
        onChange={(e) => this.onChangeInput(e)}
        onKeyPress={this.handleKeyPress}
        className="search-input"
        id="search-input-home"
        autoComplete="off"
        autoFocus
      />
      <Pane marginTop={50}>
        {/* <Link to="/search/get%20EUL">Get EUL</Link>
              <span style={{ color: '#36d6ae', margin: '0px 5px' }}>|</span> */}
        <Link to="/search/what%20is%20cyber">What is Cyber?</Link>
        {/* <span style={{ color: '#36d6ae', margin: '0px 5px' }}>|</span>
              <Link to="/gol">Game of Links</Link> */}
      </Pane>
      <Link style={{ position: 'absolute', top: '52%' }} to="/degenbox">
        <img src={bender} alt="bender" style={{ height: 170 }} />
      </Link>
    </Pane>
  </main>
  <StartState
    targetColor={targetColor}
    valueSearchInput={valueSearchInput}
    onClickBtn={this.onCklicBtn}
  />
</div>;
