// import React from 'react';
// import { Provider, Subscribe } from 'unstated';
// import {
//     ScrollContainer, MainContainer, Pane, Tablist, Tab,
//     TableEv as Table, Pill, Tooltip, TextEv as Text,
// } from '@cybercongress/gravity';
// import validatorsContainer from './validatorsContainer';

// class Validators extends React.Component {
//     async componentWillMount() {
//         await validatorsContainer.getValidators();
//     }

//     render() {
//         return (
//             <Provider>
//                 <Subscribe to={ [validatorsContainer] }>
//                     {(container) => {
//                         const { validators, showJailed } = container.state;

//                         const validatorRows = validators
//                             .filter(validator => validator.jailed === showJailed)
//                             .map((validator, index) => {
//                                 const height = validator.jailed
//                                     ? validator.unbonding_height : (validator.bond_height || 0);
//                                 const commission = (validator.commission.rate * 100).toFixed(0);
//                                 const powerFloat = validator.tokens / 1000000000;
//                                 const power = Math.round(powerFloat * 1e0) / 1e0;

//                                 let statusColor;

//                                 switch (validator.status) {
//                                 case 0:
//                                     statusColor = 'red';
//                                     break;
//                                 case 1:
//                                     statusColor = 'yellow';
//                                     break;
//                                 case 2:
//                                     statusColor = 'green';
//                                     break;
//                                 default:
//                                     statusColor = 'neutral';
//                                     break;
//                                 }

//                                 const statusTooltip = (
//                                     <Pane display='flex' alignItems='center'>
//                                         <Tooltip
//                                           appearance='card'
//                                           content={ (
//                                             <Pane
//                                               display='flex'
//                                               alignItems='center'
//                                               paddingX={ 18 }
//                                               paddingY={ 18 }
//                                             >
//                                                 <Text>
//                                                     Validator status:&nbsp;
//                                                     {validator.status === 0 && 'unbonded'}
//                                                     {validator.status === 1 && 'unbonding'}
//                                                     {validator.status === 2 && 'bonded'}
//                                                 </Text>
//                                             </Pane>
//                                             ) }
//                                         >
//                                             <Pill
//                                               height={ 7 }
//                                               width={ 7 }
//                                               borderRadius='50%'
//                                               paddingX={ 4 }
//                                               paddingY={ 0 }
//                                               marginX={ 20 }
//                                               isSolid
//                                               color={ statusColor }
//                                             />
//                                         </Tooltip>
//                                     </Pane>
//                                 );

//                                 return (
//                                     <Table.Row
//                                       style={ { border: 0 } }
//                                       boxShadow='0px 0px 0.1px 0px #ddd'
//                                       className='validators-table-row'
//                                       isSelectable
//                                       key={ validator.description.moniker }
//                                     >
//                                         <Table.TextCell
//                                           textAlign='center'
//                                           flexBasis={ 70 }
//                                           flexShrink={ 0 }
//                                           flexGrow={ 0 }
//                                         >
//                                             {statusTooltip}
//                                         </Table.TextCell>
//                                         <Table.TextCell
//                                           textAlign='center'
//                                           flexBasis={ 60 }
//                                           flexShrink={ 0 }
//                                           flexGrow={ 0 }
//                                           isNumber
//                                         >
//                                             {index + 1}
//                                         </Table.TextCell>
//                                         <Table.TextCell>
//                                             {validator.description.moniker}
//                                         </Table.TextCell>
//                                         <Table.TextCell
//                                           textAlign='center'
//                                           flexBasis={ 80 }
//                                           flexShrink={ 0 }
//                                           flexGrow={ 0 }
//                                           isNumber
//                                         >
//                                             {power}
//                                         </Table.TextCell>
//                                         <Table.TextCell
//                                           textAlign='center'
//                                           flexGrow={ 1 }
//                                         >
//                                             {commission}
//                                         </Table.TextCell>
//                                         <Table.TextCell
//                                           textAlign='center'
//                                           flexGrow={ 2 }
//                                         >
//                                             {validator.operator_address}
//                                         </Table.TextCell>
//                                         <Table.TextCell
//                                           textAlign='center'
//                                           flexShrink={ 0 }
//                                           flexGrow={ 1 }
//                                           isNumber
//                                         >
//                                             {height}
//                                         </Table.TextCell>
//                                     </Table.Row>
//                                 );
//                             });

//                         return (
//                             <ScrollContainer style={{ width: '100%' }}>
//                                 <MainContainer>
//                                     <Pane
//                                       display='flex'
//                                       flexDirection='column'
//                                       alignItems='center'
//                                       justifyContent='center'
//                                     >
//                                         <Tablist marginBottom={ 24 }>
//                                             <Tab
//                                               key='Active'
//                                               id='Active'
//                                               isSelected={ !showJailed }
//                                               onSelect={ container.showActive }
//                                               paddingX={ 50 }
//                                               paddingY={ 20 }
//                                               marginX={ 0 }
//                                               borderRadius={ 0 }
//                                               color='#fff'
//                                               boxShadow='inset 0px 0px 0px 0.9px #4ed6ae'
//                                             >
//                                                 Active
//                                             </Tab>
//                                             <Tab
//                                               key='Jailed'
//                                               id='Jailed'
//                                               isSelected={ showJailed }
//                                               onSelect={ container.showJailed }
//                                               paddingX={ 50 }
//                                               paddingY={ 20 }
//                                               marginX={ 0 }
//                                               borderRadius={ 0 }
//                                               color='#fff'
//                                               boxShadow='inset 0px 0px 0px 0.9px #4ed6ae'
//                                             >
//                                                 Jailed
//                                             </Tab>
//                                         </Tablist>
//                                     </Pane>

//                                     <Table>
//                                         <Table.Head>
//                                             <Table.TextHeaderCell
//                                               textAlign='center'
//                                               flexBasis={ 70 }
//                                               flexShrink={ 0 }
//                                               flexGrow={ 0 }
//                                             >
//                                             </Table.TextHeaderCell>
//                                             <Table.TextHeaderCell
//                                               textAlign='center'
//                                               flexBasis={ 60 }
//                                               flexShrink={ 0 }
//                                               flexGrow={ 0 }
//                                             >
//                                                 Rank
//                                             </Table.TextHeaderCell>
//                                             <Table.TextHeaderCell
//                                               flexGrow={ 1 }
//                                             >
//                                                 Name
//                                             </Table.TextHeaderCell>
//                                             <Table.TextHeaderCell
//                                               textAlign='center'
//                                               flexBasis={ 80 }
//                                               flexShrink={ 0 }
//                                               flexGrow={ 0 }
//                                             >
//                                                 Power (GCYB)
//                                             </Table.TextHeaderCell>
//                                             <Table.TextHeaderCell
//                                               flexGrow={ 1 }
//                                               textAlign='center'
//                                             >
//                                                 Commission (%)
//                                             </Table.TextHeaderCell>
//                                             <Table.TextHeaderCell
//                                               textAlign='center'
//                                               flexGrow={ 2 }
//                                             >
//                                                 Address
//                                             </Table.TextHeaderCell>
//                                             <Table.TextHeaderCell
//                                               textAlign='center'
//                                               flexShrink={ 1 }
//                                               flexGrow={ 1 }
//                                             >
//                                                 { showJailed ? 'Unbonding height' : 'Bond height' }
//                                             </Table.TextHeaderCell>
//                                         </Table.Head>
//                                         <Table.Body
//                                           style={ { backgroundColor: '#fff', overflowY: 'hidden' } }
//                                         >
//                                             {validatorRows}
//                                         </Table.Body>
//                                     </Table>
//                                 </MainContainer>
//                             </ScrollContainer>
//                         );
//                     }}
//                 </Subscribe>
//             </Provider>
//         );
//     }
// }

// export default Validators;
