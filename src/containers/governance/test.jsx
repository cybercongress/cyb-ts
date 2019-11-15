const proposals = [
  {
    height: '103973',
    result: [
      {
        content: {
          type: 'cosmos-sdk/TextProposal',
          value: {
            title: 'I have a nice kik bitches',
            description: '42 km/h last night. Yep boy',
          },
        },
        id: '1',
        proposal_status: 'Rejected',
        final_tally_result: {
          yes: '14992500000002',
          abstain: '7496250000001',
          no: '14992500000002',
          no_with_veto: '7496250000001',
        },
        submit_time: '2019-11-09T11:54:50.184619481Z',
        deposit_end_time: '2019-11-09T13:54:50.184619481Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-09T11:58:04.321380898Z',
        voting_end_time: '2019-11-09T13:58:04.321380898Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'test 2 chaonge link msg cost',
            description: 'increasing links msg cost up to 200',
            changes: [
              {
                subspace: 'bandwidth',
                key: 'LinkMsgCost',
                value: '"200"',
              },
            ],
          },
        },
        id: '2',
        proposal_status: 'Passed',
        final_tally_result: {
          yes: '79985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-09T12:34:55.937532952Z',
        deposit_end_time: '2019-11-09T14:34:55.937532952Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-09T12:34:55.937532952Z',
        voting_end_time: '2019-11-09T14:34:55.937532952Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'test 2 chaonge link msg cost',
            description: 'increasing links msg cost up to 200',
            changes: [
              {
                subspace: 'bandwidth',
                key: 'LinkMsgCost',
                value: '"100"',
              },
              {
                subspace: 'bandwidth',
                key: 'RecoveryPeriod',
                value: '"36000"',
              },
            ],
          },
        },
        id: '3',
        proposal_status: 'Passed',
        final_tally_result: {
          yes: '79985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-09T14:59:01.743646743Z',
        deposit_end_time: '2019-11-09T16:59:01.743646743Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-09T14:59:01.743646743Z',
        voting_end_time: '2019-11-09T16:59:01.743646743Z',
      },
      {
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
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title:
              'adjust price period, base credit price, desirable bandwidth',
            description: '10, 1, 400000000',
            changes: [
              {
                subspace: 'bandwidth',
                key: 'DesirableBandwidth',
                value: '"400000000"',
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
        id: '5',
        proposal_status: 'Rejected',
        final_tally_result: {
          yes: '29985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-09T15:15:23.545280116Z',
        deposit_end_time: '2019-11-09T17:15:23.545280116Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-09T15:15:23.545280116Z',
        voting_end_time: '2019-11-09T17:15:23.545280116Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'desirable bandwidth, tx cost, non link mess cost',
            description: '200000000, 600, 1000',
            changes: [
              {
                subspace: 'bandwidth',
                key: 'DesirableBandwidth',
                value: '"200000000"',
              },
              {
                subspace: 'bandwidth',
                key: 'TxCost',
                value: '"600"',
              },
              {
                subspace: 'bandwidth',
                key: 'NonLinkMsgCost',
                value: '"1000"',
              },
            ],
          },
        },
        id: '6',
        proposal_status: 'Passed',
        final_tally_result: {
          yes: '79985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-09T15:20:56.069121543Z',
        deposit_end_time: '2019-11-09T17:20:56.069121543Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-09T15:20:56.069121543Z',
        voting_end_time: '2019-11-09T17:20:56.069121543Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'tx cost, non link mess cost',
            description: '300, 500',
            changes: [
              {
                subspace: 'bandwidth',
                key: 'TxCost',
                value: '"300"',
              },
              {
                subspace: 'bandwidth',
                key: 'NonLinkMsgCost',
                value: '"500"',
              },
            ],
          },
        },
        id: '7',
        proposal_status: 'Passed',
        final_tally_result: {
          yes: '79985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-09T15:24:21.801551579Z',
        deposit_end_time: '2019-11-09T17:24:21.801551579Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-09T15:24:21.801551579Z',
        voting_end_time: '2019-11-09T17:24:21.801551579Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'calc window, damp factor, tolerance increase',
            description: '20, 0.9, 0.02',
            changes: [
              {
                subspace: 'rank',
                key: 'CalculationPeriod',
                value: '"20"',
              },
              {
                subspace: 'rank',
                key: 'DampingFactor',
                value: '"0.900000000000000000"',
              },
              {
                subspace: 'rank',
                key: 'Tolerance',
                value: '"0.020000000000000000"',
              },
            ],
          },
        },
        id: '8',
        proposal_status: 'Passed',
        final_tally_result: {
          yes: '59985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-11T08:18:33.278357111Z',
        deposit_end_time: '2019-11-11T10:18:33.278357111Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-11T08:18:33.278357111Z',
        voting_end_time: '2019-11-11T10:18:33.278357111Z',
      },
      {
        content: {
          type: 'cosmos-sdk/CommunityPoolSpendProposal',
          value: {
            title: 'Community Pool Spend',
            description: 'Pay me some Atoms!',
            recipient: 'cyber14gzsw9vjyjnmg73p002g50g97zgrj8qkks6cta',
            amount: [
              {
                denom: 'cyb',
                amount: '10000',
              },
            ],
          },
        },
        id: '9',
        proposal_status: 'Rejected',
        final_tally_result: {
          yes: '30000000000000',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-11T09:06:26.52131821Z',
        deposit_end_time: '2019-11-11T11:06:26.52131821Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-11T09:06:26.52131821Z',
        voting_end_time: '2019-11-11T11:06:26.52131821Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'calc window, damp factor, tolerance decrease',
            description: '10, 0.85, 0.001',
            changes: [
              {
                subspace: 'rank',
                key: 'CalculationPeriod',
                value: '"10"',
              },
              {
                subspace: 'rank',
                key: 'DampingFactor',
                value: '"0.850000000000000000"',
              },
              {
                subspace: 'rank',
                key: 'Tolerance',
                value: '"0.001000000000000000"',
              },
            ],
          },
        },
        id: '10',
        proposal_status: 'Passed',
        final_tally_result: {
          yes: '59985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-11T10:39:25.233360347Z',
        deposit_end_time: '2019-11-11T12:39:25.233360347Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-11T10:39:25.233360347Z',
        voting_end_time: '2019-11-11T12:39:25.233360347Z',
      },
      {
        content: {
          type: 'cosmos-sdk/CommunityPoolSpendProposal',
          value: {
            title: 'Community Pool Spend',
            description: 'Pay me some Atoms!',
            recipient: 'cyber14gzsw9vjyjnmg73p002g50g97zgrj8qkks6cta',
            amount: [
              {
                denom: 'cyb',
                amount: '10000',
              },
            ],
          },
        },
        id: '11',
        proposal_status: 'Rejected',
        final_tally_result: {
          yes: '29985000000005',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-11T12:22:04.040489847Z',
        deposit_end_time: '2019-11-11T14:22:04.040489847Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-11T12:22:04.040489847Z',
        voting_end_time: '2019-11-11T14:22:04.040489847Z',
      },
      {
        content: {
          type: 'cosmos-sdk/ParameterChangeProposal',
          value: {
            title: 'max vals, max entries, bond denom',
            description: '2, 2, hui',
            changes: [
              {
                subspace: 'staking',
                key: 'MaxValidators',
                value: '10',
              },
            ],
          },
        },
        id: '12',
        proposal_status: 'Rejected',
        final_tally_result: {
          yes: '30000000000000',
          abstain: '0',
          no: '0',
          no_with_veto: '0',
        },
        submit_time: '2019-11-11T13:54:08.765314549Z',
        deposit_end_time: '2019-11-11T15:54:08.765314549Z',
        total_deposit: [
          {
            denom: 'cyb',
            amount: '500000000000',
          },
        ],
        voting_start_time: '2019-11-11T13:54:08.765314549Z',
        voting_end_time: '2019-11-11T15:54:08.765314549Z',
      },
    ],
  },
];

export default proposals;
