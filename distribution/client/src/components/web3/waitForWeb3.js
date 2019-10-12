import Web3 from 'web3';

let web3js;

const resolveWeb3 = async resolve => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (window.web3) {
    web3js = new Web3(window.web3.currentProvider);
  }
  if (window.ethereum) {
    web3js = new Web3(window.ethereum);
  } else {
    web3js = new Web3();
    web3js.setProvider(
      new web3js.providers.HttpProvider('https://rinkeby.infura.io/metamask')
    );
  }

  resolve(web3js);
};

const waitForWeb3 = () =>
  new Promise(resolve => {
    // If our web3js already exists, resolve immediately
    if (web3js) return resolve(web3js);

    // If an instance of web3 exist in window, resolve immediately
    if (window.web3 || window.ethereum) return resolveWeb3(resolve);

    // If window is already full loaded, resolve immediately
    if (window.document.readyState === 'complete') {
      return resolveWeb3(resolve);
    }
    // Wait until window has fully loaded to resolve web3
    window.addEventListener('load', () => resolveWeb3(resolve));
  });

export default waitForWeb3;
