const IPFS = require('ipfs-api');

let ipfsApi;

const getIpfsConfig = async () => {
    if (window.getIpfsConfig) {
        return window.getIpfsConfig();
    }

    return {
        host: 'localhost',
        port: 5001,
        protocol: 'http',
    };
};

export const initIpfs = async () => {
    if (ipfsApi) {
        return;
    }

    const ipfsConfig = await getIpfsConfig();
    ipfsApi = new IPFS(ipfsConfig);
};

export const getIpfs = async () => {
    if (ipfsApi) {
        return ipfsApi;
    }

    await initIpfs();

    return ipfsApi;
};

export const getContentByCid = (cid) => new Promise(resolve => {
    getIpfs()
        .then((ipfs) => {
            ipfs.get(cid, (err, files) => {
                const buf = files[0].content;

                resolve(buf.toString());
            });
        });
});
