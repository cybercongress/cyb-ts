import React from 'react';
import { Cid } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { trimString } from 'src/utils/utils';
import { useSubnet } from '../subnet.context';
import styles from './SubnetHeader.module.scss';
import useCybernetTexts from '../../../useCybernetTexts';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';

function Item({ title, content }) {
  return (
    <div className={styles.item}>
      {title}
      {content}
    </div>
  );
}

function SubnetHeader() {
  const { subnetQuery } = useSubnet();
  const { getText } = useCybernetTexts();

  const metadata = subnetQuery.data?.metadata || {};

  if (!metadata?.name) {
    return null;
  }

  if (!subnetQuery.data) {
    return null;
  }

  console.log(subnetQuery.data);

  const { netuid, difficulty, tempo, max_allowed_validators } =
    subnetQuery.data;

  const { logo, description, name } = metadata;

  return (
    <Display>
      <div className={styles.wrapper}>
        <Item
          title={`${getText('subnetwork')} №${netuid} }`}
          content={`${name}`}
        />
        <div>
          max {getText('validator', true)} {max_allowed_validators}
        </div>
        <div>difficulty {difficulty}</div>
        <div>tempo {tempo}</div>
        <AvataImgIpfs cidAvatar={logo} height={20} width={20} />
        <Cid cid={description}>{trimString(description, 6, 6)}</Cid>
        power
      </div>
    </Display>
  );
}

export default SubnetHeader;
