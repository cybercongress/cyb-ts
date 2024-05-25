import React from 'react';
import { Cid } from 'src/components';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { trimString } from 'src/utils/utils';
import { useSubnet } from '../subnet.context';
import styles from './SubnetHeader.module.scss';
import useCybernetTexts from '../../../useCybernetTexts';
import { AvataImgIpfs } from 'src/containers/portal/components/avataIpfs';

function SubnetHeader() {
  const { subnetQuery } = useSubnet();
  const { getText } = useCybernetTexts();

  const metadata = subnetQuery.data?.metadata || {};

  if (!metadata) {
    return null;
  }

  return (
    <Display
      title={
        <DisplayTitle title={`${getText('subnetwork')} ${metadata.name}`} />
      }
    >
      <div className={styles.wrapper}>
        <AvataImgIpfs cidAvatar={metadata.logo} height={20} width={20} />

        <div>
          <Cid cid={metadata.description}>
            {trimString(metadata.description, 6, 6)}
          </Cid>
          {/* <p>type: {metadata.types}</p> */}
        </div>

        {/* <p>{JSON.stringify(metadata)}</p> */}
      </div>
    </Display>
  );
}

export default SubnetHeader;
