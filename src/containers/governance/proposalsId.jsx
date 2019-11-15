const proposalsId = [
  {
    height: '104566',
    result: {
      content: {
        type: 'cosmos-sdk/ParameterChangeProposal',
        value: {
          title: 'recovery period, adjust price period, base credir price',
          description: '18000, 20, 2',
          changes: [
            {
              subspace: 'bandwidth',
              key: 'RecoveryPeriod',
              value: '"18000"',
            },
            {
              subspace: 'bandwidth',
              key: 'AdjustPricePeriod',
              value: '"20"',
            },
            {
              subspace: 'bandwidth',
              key: 'BaseCreditPrice',
              value: '"1.000000000000000000"',
            },
          ],
        },
      },
      id: '4',
      proposal_status: 'Passed',
      final_tally_result: {
        yes: '79985000000005',
        abstain: '0',
        no: '0',
        no_with_veto: '0',
      },
      submit_time: '2019-11-09T15:08:49.932525795Z',
      deposit_end_time: '2019-11-09T17:08:49.932525795Z',
      total_deposit: [
        {
          denom: 'cyb',
          amount: '500000000000',
        },
      ],
      voting_start_time: '2019-11-09T15:08:49.932525795Z',
      voting_end_time: '2019-11-09T17:08:49.932525795Z',
    },
  },
];

export default proposalsId;
