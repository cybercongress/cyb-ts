import { useState } from 'react';

import axios from 'axios';
import { LCD_URL } from 'src/constants/config';
import {
  QueryPoolResponseAmino,
  QueryValidatorDelegationsResponseAmino,
  QueryValidatorResponseAmino,
} from '@cybercongress/cyber-ts/cosmos/staking/v1beta1/query';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useParams } from 'react-router-dom';

import { useCyberClient } from 'src/contexts/queryCyberClient';
import { useSphereContext } from 'src/pages/Sphere/Sphere.context';
import Statistics from './components/Statistics/Statistics';
import Details from './components/Details/Details';

const mapTabs = [
  { key: 'fans', to: 'fans' },
  { key: 'main', to: '' },
  { key: 'rumors', to: 'rumors' },
  { key: 'leadership', to: 'leadership' },
];

// use hooks
const stakingPool = async () => {
  try {
    const response = await axios<QueryPoolResponseAmino>({
      method: 'get',
      url: `${LCD_URL}/cosmos/staking/v1beta1/pool`,
    });

    return response.data.pool;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const getValidatorsInfoFunc = async (address) => {
  try {
    const response = await axios<QueryValidatorResponseAmino>({
      method: 'get',
      url: `${LCD_URL}/cosmos/staking/v1beta1/validators/${address}`,
    });

    return response.data.validator;
  } catch (e) {
    console.log(e);
    return null;
  }
};

// maybe logic not correct
const selfDelegationShares = async (delegatorAddress, operatorAddress) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators/${operatorAddress}`,
    });

    return response.data.validator.tokens;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const getDelegatorsFunc = async (validatorAddr) => {
  try {
    const response = await axios<QueryValidatorDelegationsResponseAmino>({
      method: 'get',
      url: `${LCD_URL}/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations`,
    });
    return response.data.delegation_responses;
  } catch (e) {
    console.log(e);
    return null;
  }
};

function HeroDetails() {
  const { hooks } = useCyberClient();
  const addressActive = useAppSelector(selectCurrentAddress);
  const { address: operatorAddress, tab = 'main' } = useParams();
  const [updatePage, setUpdatePage] = useState(0);
  const { validators } = useSphereContext();

  const valInfo = operatorAddress
    ? validators.find((item) => item.operatorAddress === operatorAddress)
    : undefined;

  const { data: valRes } = hooks.cosmos.staking.v1beta1.useValidator({
    request: { validatorAddr: operatorAddress || '' },
    options: { enabled: Boolean(operatorAddress && !valInfo) },
  });

  const validatorInfo = valInfo || (valRes ? valRes.validator : undefined);

  console.log('data', validatorInfo);

  console.log('operatorAddress', operatorAddress);

  if (!validatorInfo) {
    return <div>...</div>;
  }

  return (
    <>
      <Statistics />

      <Details data={validatorInfo} />
      {/* <Tabs
          selected={tab || 'main'}
          options={mapTabs.map((item) => ({
            key: item.key,
            to: `/network/bostrom/hero/${address}/${item.to}`,
          }))}
        /> */}
      {/* <Pane
        display="flex"
        marginTop={20}
        marginBottom={50}
        justifyContent="center"
        flexDirection="column"
      > */}
      {/* {!tab && <Delegated data={delegated} />} */}
      {/* {tab === 'fans' && <Fans data={fans} />} */}
      {/* {tab === 'rumors' && (
            <Rumors accountUser={validatorInfo.operator_address} />
          )} */}
      {/* {tab === 'leadership' && (
            <Leadership accountUser={validatorInfo.delegateAddress} />
          )} */}
      {/* </Pane> */}

      {/* <ActionBarContainer
        updateTable={this.update}
        validators={validatorInfo}
        unStake={unStake}
      /> */}
    </>
  );
}

// class ValidatorsDetailsOld extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       validatorInfo: [],
//       // eslint-disable-next-line react/no-unused-state
//       data: {},
//       delegated: {},
//       loader: true,
//       error: false,
//       fans: [],
//       addressPocket: null,
//       unStake: false,
//     };
//   }

//   async componentDidMount() {
//     await this.checkAddressLocalStorage();
//     this.init();
//     // this.chekPathname();
//   }

//   componentDidUpdate(prevProps) {
//     const {
//       router: {
//         location: { pathname },
//       },
//       defaultAccount,
//     } = this.props;
//     if (prevProps.router.location.pathname !== pathname) {
//       this.init();
//     }

//     if (prevProps.defaultAccount.name !== defaultAccount.name) {
//       this.updateAddressLocalStorage();
//     }
//   }

//   updateAddressLocalStorage = async () => {
//     this.setState({ loader: true, unStake: false });
//     await this.checkAddressLocalStorage();
//     await this.init();
//   };

//   init = async () => {
//     // this.setState({ loader: true });
//     await this.getValidatorInfo();
//     this.getDelegators();
//   };

//   checkAddressLocalStorage = async () => {
//     const { defaultAccount } = this.props;
//     const { account } = defaultAccount;
//     if (
//       account !== null &&
//       Object.prototype.hasOwnProperty.call(account, 'cyber')
//     ) {
//       this.setState({ addressPocket: account.cyber });
//     } else {
//       this.setState({
//         addressPocket: null,
//       });
//     }
//   };

//   update = async () => {
//     await this.getValidatorInfo();
//     this.getDelegators();
//   };

//   // eslint-disable-next-line class-methods-use-this
//   getSupply = async () => {
//     const bondedTokens = await stakingPool();
//     return bondedTokens.bonded_tokens;
//   };

//   // eslint-disable-next-line class-methods-use-this
//   getDelegated = async (delegatorShares, delegateAddress, operatorAddress) => {
//     const data = {
//       self: 0,
//       selfPercent: 0,
//       others: 0,
//       othersPercent: 0,
//     };

//     const getSelfDelegation = await selfDelegationShares(
//       delegateAddress,
//       operatorAddress
//     );

//     if (getSelfDelegation && delegatorShares > 0) {
//       const selfPercent = (getSelfDelegation / delegatorShares) * 100;

//       data.self = parseFloat(getSelfDelegation);
//       data.selfPercent = selfPercent;
//       data.others = parseFloat(delegatorShares);
//       data.othersPercent = 100 - selfPercent;
//     }

//     return data;
//   };

//   getValidatorInfo = async () => {
//     const {
//       router: {
//         params: { address },
//       },
//     } = this.props;

//     const resultStakingPool = await this.getSupply();
//     const result = await getValidatorsInfoFunc(address);

//     if (!result) {
//       return this.setState({ error: true, loader: false });
//     }

//     const delegateAddress = fromBech32(result.operator_address);

//     const votingPower = (result.tokens / resultStakingPool) * 100;
//     const delegated = await this.getDelegated(
//       result.delegator_shares,
//       delegateAddress,
//       result.operator_address
//     );

//     return this.setState({
//       validatorInfo: {
//         delegateAddress,
//         ...result,
//         votingPower,
//       },
//       delegated: {
//         total: parseFloat(result.tokens),
//         delegateAddress,
//         jailed: result.jailed,
//         unbondingTime: result.unbonding_time,
//         unbondingHeight: result.unbonding_height,
//         delegatorShares: result.delegator_shares,
//         ...delegated,
//         ...result,
//       },
//     });
//   };

//   getDelegators = async () => {
//     const {
//       router: { params },
//     } = this.props;
//     const { address } = params;
//     const { validatorInfo, addressPocket, unStake } = this.state;

//     const fans = [];

//     const data = await getDelegatorsFunc(address);

//     // debugger;

//     if (data) {
//       // TODO: refactor
//       Object.keys(fans).forEach((key) => {
//         if (unStake === false) {
//           if (addressPocket !== null) {
//             if (
//               fans[key].delegation.delegator_address === addressPocket.bech32
//             ) {
//               this.setState({
//                 unStake: true,
//               });
//             }
//           }
//         }
//         fans[key].share =
//           parseFloat(fans[key].balance.amount) /
//           Math.floor(parseFloat(validatorInfo.delegator_shares));
//       });
//     }

//     this.setState({
//       fans,
//       loader: false,
//     });
//   };

//   render() {
//     const {
//       validatorInfo,
//       loader,
//       delegated,
//       fans,
//       error,
//       addressPocket,
//       unStake,
//     } = this.state;
//     const {
//       router: { params },
//     } = this.props;

//     const { address, tab } = params;

//     if (loader) {
//       return (
//         <div
//           style={{
//             height: '50vh',
//           }}
//         >
//           <Loader2 />
//         </div>
//       );
//     }

//     if (error) {
//       return <NotFound text={error?.message} />;
//     }

//     return (
//       <div>
//         <MainContainer>
//           <Pane
//             marginBottom={40}
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <MusicalAddress address={validatorInfo.operator_address} />
//           </Pane>
//           <ValidatorInfo data={validatorInfo} marginBottom={20} />
//           <Tabs
//             selected={tab || 'main'}
//             options={mapTabs.map((item) => ({
//               key: item.key,
//               to: `/network/bostrom/hero/${address}/${item.to}`,
//             }))}
//           />
//           <Pane
//             display="flex"
//             marginTop={20}
//             marginBottom={50}
//             justifyContent="center"
//             flexDirection="column"
//           >
//             {!tab && <Delegated data={delegated} />}
//             {tab === 'fans' && <Fans data={fans} />}
//             {tab === 'rumors' && (
//               <Rumors accountUser={validatorInfo.operator_address} />
//             )}
//             {tab === 'leadership' && (
//               <Leadership accountUser={validatorInfo.delegateAddress} />
//             )}
//           </Pane>
//         </MainContainer>
//         <ActionBarContainer
//           updateTable={this.update}
//           validators={validatorInfo}
//           unStake={unStake}
//           addressPocket={addressPocket}
//         />
//       </div>
//     );
//   }
// }

export default HeroDetails;
