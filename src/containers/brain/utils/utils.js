const chekPathname = (pathname) => {
  if (
    pathname.match(/cybernomics/gm) &&
    pathname.match(/cybernomics/gm).length > 0
  ) {
    return 'cybernomics';
  }
  if (
    pathname.match(/knowledge/gm) &&
    pathname.match(/knowledge/gm).length > 0
  ) {
    return 'knowledge';
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
  return 'main';
};

export { chekPathname };
