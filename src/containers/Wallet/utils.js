const deletPubkey = updateFunc => {
  localStorage.removeItem('pocket');
  localStorage.removeItem('ledger');
  localStorage.removeItem('linksImport');
  if (updateFunc) {
    updateFunc();
  }
};

export { deletPubkey };
