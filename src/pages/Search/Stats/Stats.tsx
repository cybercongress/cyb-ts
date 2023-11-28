import {
  useGetGraphStats,
  useGetNegentropy,
} from 'src/containers/temple/hooks';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';
import cx from 'classnames';
import styles from './Stats.module.scss';
import { TitleType } from '../Search';

type Props = {
  type: TitleType;
};

const REFETCH_INTERVAL = 1000 * 7;

function Stats({ type }: Props) {
  const dataGetGraphStats = useGetGraphStats(REFETCH_INTERVAL);
  const negentropy = useGetNegentropy(REFETCH_INTERVAL);

  let value: number | undefined;
  let text: string;

  switch (type) {
    case TitleType.search:
      value = dataGetGraphStats.data?.particles;
      text = 'particles';
      break;

    case TitleType.learning:
      value = dataGetGraphStats.data?.cyberlinks;
      text = 'cyberlinks';
      break;

    case TitleType.ai:
      value = negentropy.data?.negentropy;
      text = 'syntropy bits';
      break;

    default:
  }

  return (
    <div className={cx(styles.wrapper)}>
      {value && (
        <>
          <TypingText
            content={`${Number(value).toLocaleString().replaceAll(',', ' ')}`}
            delay={40}
          />{' '}
          <strong>{text}</strong> and <strong>growing</strong>
        </>
      )}
    </div>
  );
}

export default Stats;
