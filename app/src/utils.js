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

export const getContentByCid = (cid, timeout) => {
    return getIpfs()
        .then((ipfs) => {

            const timeoutPromise = () => new Promise((resolve, reject) => {
                setTimeout(reject, timeout, 'ipfs get timeout')
            });

            const ipfsGetPromise = () => new Promise((resolve, reject) => {
                ipfs.get(cid, (error, files) => {
                    if (error) {
                        reject(error)
                    }

                    const buf = files[0].content;

                    resolve(buf.toString());
                });
            });

            return Promise.race([timeoutPromise(), ipfsGetPromise()])
        });
};

export const getQueryStringValue = (key) => {
    return decodeURIComponent(
        window.location.search.replace(
            new RegExp(
                "^(?:.*[&\\?]"
                + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&")
                + "(?:\\=([^&]*))?)?.*$", "i"
            ),
            "$1"
        )
    );
};
