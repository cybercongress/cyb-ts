import {
  useGetGraphStats,
  useGetNegentropy,
} from 'src/containers/temple/hooks';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';
import cx from 'classnames';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { timeSince } from 'src/utils/utils';
import styles from './Stats.module.scss';
import { TitleType } from '../type';

type Props = {
  type: TitleType;
};

function Stats({ type }: Props) {
  const dataGetGraphStats = useGetGraphStats(undefined);
  const negentropy = useGetNegentropy(undefined);
  let value: number | undefined;
  let text: string | JSX.Element;
  let change: number | undefined;

  switch (type) {
    case TitleType.search:
      value = dataGetGraphStats.data?.particles;
      text = <Link to={routes.oracle.ask.getLink('particle')}>particles</Link>;
      if (dataGetGraphStats.changeTimeAmount.particles) {
        change = dataGetGraphStats.changeTimeAmount.particles;
      }
      break;

    case TitleType.learning:
      value = dataGetGraphStats.data?.cyberlinks;
      text = (
        <Link to={routes.oracle.ask.getLink('cyberlink')}>cyberlinks</Link>
      );
      if (dataGetGraphStats.changeTimeAmount.cyberlinks) {
        change = dataGetGraphStats.changeTimeAmount.cyberlinks;
      }
      break;

    case TitleType.ai:
      value = negentropy.data?.negentropy;
      text = (
        <Link to={routes.oracle.ask.getLink('negentropy')}>syntropy bits</Link>
      );
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
          <strong>{text}</strong>{' '}
          {change ? (
            <p className={styles.change}>
              | <strong>+{change}</strong> in{' '}
              {timeSince(dataGetGraphStats.changeTimeAmount.time)}
            </p>
          ) : (
            <>
              and <strong>growing</strong>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Stats;
