const getGroupAddress = (data) => {
  const groupsAddress = data.reverse().reduce((obj, item) => {
    obj[item.sender] = obj[item.sender] || [];
    obj[item.sender].push({
      amountEth: item.eth,
      //   price: item.price,
      ethTxhash: item.eth_txhash,
      block: item.block,
      cyberHash: item.cyber_hash,
      eul: item.eul,
      index: item.index,
      //   timestamp: item.timestamp,
      //   cybEstimation: item.estimation,
      //   estimationEUL: item.estimationEUL,
    });
    return obj;
  }, {});
  const groups = Object.keys(groupsAddress).reduce(
    (obj, key) => ({
      ...obj,
      [key]: {
        address: groupsAddress[key],
        block: null,
        pin: false,
        amountСolumn: null,
        cyb: null,
        eul: null,
      },
    }),
    {}
  );

  Object.keys(groups).forEach((key) => {
    let sum = 0;
    let eul = 0;
    groups[key].address.forEach((addressKey) => {
      sum += addressKey.amountEth;
      eul += addressKey.eul;
    });
    groups[key].block = groups[key].address[0].block;
    groups[key].amountСolumn = sum;
    groups[key].eul = eul;
  });
  return groups;
};

const diff = (key, ...arrays) =>
  [].concat(
    ...arrays.map((arr, i) => {
      const others = arrays.slice(0);
      others.splice(i, 1);
      const unique = [...new Set([].concat(...others))];
      return arr.filter((x) => !unique.some((y) => x[key] === y[key]));
    })
  );

export { diff, getGroupAddress };
