import React from 'react'

function Statistics() {
  return (
    <div
      marginTop={10}
      marginBottom={50}
      display="grid"
      gridTemplateColumns="300px 300px 300px"
      gridGap="20px"
      justifyContent="center"
    >
      <CardStatisics
        title={<ValueImg text="milliampere" />}
        value={formatNumber(vestedA)}
      />
      <CardStatisics
        title={<ValueImg text="millivolt" />}
        value={formatNumber(vestedV)}
      />
      <CardStatisics
        title="My Energy"
        value={`${formatNumber(vestedA * vestedV)} W`}
      />
    </div>
  );
}

export default Statistics;
