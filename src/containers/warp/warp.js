import {
  BrowserRouter,
  useLocation,
  useHistory,
  Route,
  Switch,
} from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import WarpTokens from './warpTokens';
import WarpChannels from './warpChannels';
import WarpContracts from './warpContracts';
import WarpNetworks from './warpNetworks';

import { getPin, getTxs } from '../../utils/search/utils';
import { AppContext } from "../../context";
import useSetActiveAddress from "../../hooks/useSetActiveAddress";
import WarpProtocols from "./warpProtocols";
import WarpEndpoints from "./warpEndpoints";

const all = require('it-all');
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayToAsciiString = require('uint8arrays/to-string');
const FileType = require('file-type');

function Warp({ defaultAccount, ipfs }) {

  const { jsCyber, keplr } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [selectedTab, setSelectedTab] = useState('tokens');
  useEffect(() => {
    const { pathname } = location;
    if (pathname.match(/tokens/gm) && pathname.match(/tokens/gm).length > 0) {
      setSelectedTab('tokens');
    } else if (
      pathname.match(/networks/gm) &&
      pathname.match(/networks/gm).length > 0
    ) {
      setSelectedTab('networks');
    } else if (
      pathname.match(/channels/gm) &&
      pathname.match(/channels/gm).length > 0
    ) {
      setSelectedTab('channels');
    } else if (
        pathname.match(/contracts/gm) &&
        pathname.match(/contracts/gm).length > 0
    )  {
      setSelectedTab('contracts');
    }
    else if (
        pathname.match(/protocols/gm) &&
        pathname.match(/protocols/gm).length > 0
    )  {
      setSelectedTab('protocols');
    }
    else if (
        pathname.match(/endpoints/gm) &&
        pathname.match(/endpoints/gm).length > 0
    )  {
      setSelectedTab('endpoints');
    }

    else {
      setSelectedTab('tokens');
    }
  }, [location.pathname]);

  let statusChecker = async (transactionHash) => {
    let timer = null;
    let execute = async () => {
      return await getTxs(transactionHash);
    }

    return new Promise(async (accept) => {
      let data = execute();

      timer = setInterval(async () => {
        let result = await execute();
        if (result) {
          clearInterval(timer)
          return accept(result);
        }
      }, 3000);
    })
  }

  const onSelectInputFile = async(e) => {
    return new Promise((accept,reject)=>{
      try {
      let file = e.target.files[0];
      let reader = new FileReader();
      let url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        fetch(reader.result).then(async(res) => {
          res.blob().then((binaryImage)=>{
            accept({
              'src': (reader.result),
              'binary': binaryImage,
              'ipfs': null
            });
          })
        })
      }.bind(this);
      } catch (e) {
        reject(e);
      }
    })

  }

  const pushIpfsFile = async (image) => {
    const toCid = await getPin(ipfs, image);
    await ipfs.pin.add(toCid);

    const data = uint8ArrayConcat(await all(ipfs.cat(toCid)));

    const dataFileType = await FileType.fromBuffer(data);
    return {data: data, dataFileType: dataFileType, toCid: toCid};

  };
  const pushIpfsImage = async (image) => {
    let { data,  dataFileType, toCid} = await pushIpfsFile(image);
    let mime;
    let file;
    if (dataFileType !== undefined) {
      mime = dataFileType.mime;
      if (mime.indexOf('image') !== -1) {
        // const dataBase64 = data.toString('base64');
        const dataBase64 = uint8ArrayToAsciiString(data, 'base64');
        file = `data:${mime};base64,${dataBase64}`;
      }
    }

    return {
      file,
      cid: toCid,
    };
  }

  let content;

  if (selectedTab === 'networks') {
    content = (
      <Route
        path="/warp/networks"
        render={() => <WarpNetworks pushIpfsImage={pushIpfsImage} statusChecker={statusChecker} onSelectInputFile={onSelectInputFile} />}
      />
    );
  }

  if (selectedTab === 'tokens') {
    content = <Route path="/warp/tokens" render={() => <WarpTokens pushIpfsImage={pushIpfsImage} statusChecker={statusChecker} onSelectInputFile={onSelectInputFile} />} />;
  }

  if (selectedTab === 'channels') {
    content = <Route path="/warp/channels" render={() => <WarpChannels statusChecker={statusChecker} onSelectInputFile={onSelectInputFile} />} />;
  }
  //
  if (selectedTab === 'contracts') {
    content = <Route path="/warp/contracts" render={() => <WarpContracts  statusChecker={statusChecker}  pushIpfsFile={pushIpfsFile} onSelectInputFile={onSelectInputFile} />} />;
  }

  if (selectedTab === 'protocols') {
    content = <Route path="/warp/protocols" render={() => <WarpProtocols  statusChecker={statusChecker}  pushIpfsFile={pushIpfsFile} onSelectInputFile={onSelectInputFile} />} />;
  }

  if (selectedTab === 'endpoints') {
    content = <Route path="/warp/endpoints" render={() => <WarpEndpoints  statusChecker={statusChecker}  pushIpfsFile={pushIpfsFile} onSelectInputFile={onSelectInputFile} />} />;
  }

  return (
    <>
      <main className="block-body">{content}</main>
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
    ipfs: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(Warp);
