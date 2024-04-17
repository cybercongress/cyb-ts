import React from 'react';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from '../../Subnet.module.scss';
import { SubnetInfo, SubnetNeuron } from 'src/features/cybernet/types';
import { Link, useParams } from 'react-router-dom';
import useCybernetContract from 'src/features/cybernet/ui/useQueryCybernetContract.refactor';
import SubnetNeurons from '../../SubnetNeurons/SubnetNeurons';
import { routes } from 'src/routes';

type Props = {
  data: SubnetInfo;
  neurons: SubnetNeuron[];
};

function SubnetInfo({ data: subnetInfoData, neurons }: Props) {
  const { id } = useParams();
  const netuid = Number(id!);

  const subnetNeurons = neurons;
  const subnetType = subnetInfoData?.network_modality;

  return (
    <>
      <Display title={<DisplayTitle title={'Subnet info'} />}>
        <ul className={styles.list}>
          {subnetInfoData &&
            Object.keys(subnetInfoData).map((item) => {
              const value = subnetInfoData[item];
              let content = value;

              if (item === 'owner') {
                content = (
                  <Link to={routes.neuron.getLink(value)}>{value}</Link>
                );
              }

              if (item === 'metadata') {
                content = (
                  <Link to={routes.oracle.ask.getLink(value)}>{value}</Link>
                );
              }

              return (
                <li key={item}>
                  {item}: <div>{content}</div>
                </li>
              );
            })}
        </ul>
      </Display>

      {subnetNeurons && (
        <SubnetNeurons neurons={subnetNeurons} subnetType={subnetType} />
      )}
    </>
  );
}

export default SubnetInfo;
