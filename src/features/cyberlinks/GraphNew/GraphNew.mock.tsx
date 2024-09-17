function GraphNewMock(): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 10,
        color: 'white',
        top: '50%',
      }}
    >
      2d graph is disabled for netlify builds
    </div>
  );
}

export default GraphNewMock;
