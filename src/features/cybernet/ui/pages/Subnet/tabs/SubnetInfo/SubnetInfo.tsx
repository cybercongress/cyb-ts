import React from 'react';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from '../../Subnet.module.scss';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { Link, useParams } from 'react-router-dom';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import SubnetNeurons from '../SubnetNeurons/SubnetNeuronsTable/SubnetNeuronsTable';
import { routes } from 'src/routes';
import { Cid } from 'src/components';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';
import SubnetHyperParams from '../SubnetHyperParams/SubnetHyperParams';
import useCybernetTexts from 'src/features/cybernet/ui/useCybernetTexts';
import MusicalAddress from 'src/components/MusicalAddress/MusicalAddress';

type Props = {
  data: SubnetInfo;
  neurons: SubnetNeuron[];
};

const config: { [K in keyof SubnetInfo]: { text: string } } = {
  blocks_since_last_step: {
    text: 'Blocks since last step',
  },
  burn: {
    text: 'Burn',
  },
  difficulty: {
    text: 'Difficulty',
  },
  emission_values: {
    text: 'Emission Values',
  },
  immunity_period: {
    text: 'Immunity Period',
  },
  kappa: {
    text: 'Kappa',
  },
  max_allowed_uids: {
    text: 'Max Allowed UIDs',
  },
  max_allowed_validators: {
    text: 'Max Allowed Validators',
  },
  max_weights_limit: {
    text: 'Max Weights Limit',
  },
  metadata: {
    text: 'Metadata',
  },
  min_allowed_weights: {
    text: 'Min Allowed Weights',
  },
  netuid: {
    text: 'NetUID',
  },
  network_modality: {
    text: 'Network Modality',
  },
  owner: {
    text: 'Owner',
  },
  rho: {
    text: 'Rho',
  },
  subnetwork_n: {
    text: 'Subnetwork N',
  },
  tempo: {
    text: 'Tempo',
  },
};

function SubnetInfo({ data: subnetInfoData }: Props) {
  const { id } = useParams();

  const { getText } = useCybernetTexts();

  useAdviserTexts({
    defaultText: `${getText('subnetwork')} params`,
  });

  return (
    <>
      <Display
        noPaddingX
        // title={<DisplayTitle title={`${getText('subnetwork')} info`} />}
      >
        <ul className={styles.list}>
          {subnetInfoData &&
            Object.keys(subnetInfoData).map((item) => {
              const value = subnetInfoData[item];
              let content = value;

              if (item === 'owner') {
                content = (
                  <MusicalAddress address={value} />
                  // <Link to={routes.neuron.getLink(value)}>{value}</Link>
                );
              }

              if (item === 'metadata') {
                content = '';

                // content = (
                //   <Cid cid={value} />
                //   // <Link to={routes.oracle.ask.getLink(value)}>{value}</Link>
                // );
              }

              if (['burn'].includes(item)) {
                content = <span>{value.toLocaleString()} 🟣</span>;
              }

              const title = config[item].text || item;

              return (
                <li key={item}>
                  <Link to={routes.oracle.ask.getLink(title.toLowerCase())}>
                    {title}
                  </Link>
                  <div>{content}</div>
                </li>
              );
            })}
        </ul>
      </Display>

      <SubnetHyperParams />
    </>
  );
}

export default SubnetInfo;
