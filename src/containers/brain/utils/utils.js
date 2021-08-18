const chekPathname = (pathname) => {
  if (pathname.match(/market/gm) && pathname.match(/market/gm).length > 0) {
    return 'market';
  }
  if (pathname.match(/oracle/gm) && pathname.match(/oracle/gm).length > 0) {
    return 'oracle';
  }
  if (
    pathname.match(/government/gm) &&
    pathname.match(/government/gm).length > 0
  ) {
    return 'government';
  }
  if (pathname.match(/apps/gm) && pathname.match(/apps/gm).length > 0) {
    return 'apps';
  }
  if (pathname.match(/help/gm) && pathname.match(/help/gm).length > 0) {
    return 'help';
  }
  if (pathname.match(/gol/gm) && pathname.match(/gol/gm).length > 0) {
    return 'gol';
  }
  if (
    pathname.match(/halloffame/gm) &&
    pathname.match(/halloffame/gm).length > 0
  ) {
    return 'halloffame';
  }
  if (pathname.match(/power/gm) && pathname.match(/power/gm).length > 0) {
    return 'power';
  }
  if (pathname.match(/taverna/gm) && pathname.match(/taverna/gm).length > 0) {
    return 'taverna';
  }
  return 'port';
};

export { chekPathname };
