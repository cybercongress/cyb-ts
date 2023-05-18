import { CYBER } from '../../../../utils/config';
import { FormatNumberTokens } from '../../../nebula/components';
import DonutChart from '../../../../components/DonutChart';
import ContainerGradient from '../../../../components/containerGradient/ContainerGradient';
import { BOOT_ICON, GIFT_ICON } from '../../utils';
import { ProgressBar } from '../progressCard';
import styles from './ReleaseStatus.module.scss';

const mockData = [
  {
    title: 'available for release',
    color: '#ED2BE7',
    value: 70,
  },
  {
    title: 'released',
    color: '#76FF03',
    value: 65,
  },
  {
    title: 'left to release',
    color: '#525252',
    value: 133,
  },
];

type Item = {
  title: string;
  color: string;
  value: number;
};

type Status = 'red' | 'green';

type Props = {
  amountGiftValue: number;
  status?: Status;
  progress: number;
};

function RowItem({ item }: { item: Item }) {
  return (
    <div className={styles.RowItemReleaseStatus}>
      <div style={{ color: item.color }}>{item.title}</div>
      <div>
        <FormatNumberTokens value={item.value} text={CYBER.DENOM_CYBER} />
      </div>
    </div>
  );
}

function ReleaseStatus({
  amountGiftValue = 0,
  status = 'green',
  progress = 0,
}: Props) {
  const title = (
    <div className={styles.title}>
      <div>release status {GIFT_ICON}</div>
      <div>
        <FormatNumberTokens value={amountGiftValue} text={CYBER.DENOM_CYBER} />
      </div>
    </div>
  );

  return (
    <ContainerGradient
      title={title}
      closedTitle={title}
      styleLampContent={status}
      userStyleContent={{ height: '475px', display: 'grid', gap: '30px' }}
    >
      <div className={styles.detailsReleaseStatus}>
        <div>
          <DonutChart data={mockData} />
        </div>
        <div className={styles.containerRowItem}>
          {mockData.map((item) => (
            <RowItem key={item.title} item={item} />
          ))}
        </div>
      </div>

      <div className={styles.descriptionRules}>
        Only the most dexterous will be lucky. The early birds get a higher
        bonus gift release in every 1000 new addresses registered.
      </div>

      <div>
        <div className={styles.nextRelease}>
          <span>next release after</span>
          <span className={styles.nextReleaseValue}>149 addresses</span>
        </div>

        <ProgressBar progress={progress} />
        <div className={styles.containerProcentValue}>
          <div>0%</div>
          <div>100%</div>
        </div>
      </div>
    </ContainerGradient>
  );
}

export default ReleaseStatus;
