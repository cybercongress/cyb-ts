import {
  useGetGraphStats,
  useGetNegentropy,
} from 'src/containers/temple/hooks';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';
import cx from 'classnames';
import styles from './Stats.module.scss';
import { TitleType } from '../OracleLanding';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

type Props = {
  type: TitleType;
};

const REFETCH_INTERVAL = 1000 * 7;

const twentyFourHoursAgo = new Date(
  new Date().getTime() - 24 * 60 * 60 * 1000
).toISOString();

function generateQuery(type: string) {
  return gql`
    query Query {
      ${type}(where: {timestamp: {_gte: "${twentyFourHoursAgo}"}}) {
        aggregate {
          count
        }
      }
    }
  `;
}

function Stats({ type }: Props) {
  const dataGetGraphStats = useGetGraphStats(REFETCH_INTERVAL);
  const negentropy = useGetNegentropy(REFETCH_INTERVAL);

  const cyberlinksQuery = useQuery(generateQuery('cyberlinks_aggregate'));
  const particlesQuery = useQuery(generateQuery('particles_aggregate'));

  let value: number | undefined;
  let text: string | JSX.Element;
  let change: number | undefined;

  switch (type) {
    case TitleType.search:
      value = dataGetGraphStats.data?.particles;
      text = <Link to={routes.oracle.ask.getLink('particle')}>particles</Link>;
      if (!(particlesQuery.loading || particlesQuery.error)) {
        change = particlesQuery.data?.particles_aggregate.aggregate.count;
      }
      break;

    case TitleType.learning:
      value = dataGetGraphStats.data?.cyberlinks;
      text = (
        <Link to={routes.oracle.ask.getLink('cyberlink')}>cyberlinks</Link>
      );
      if (!(cyberlinksQuery.loading || cyberlinksQuery.error)) {
        change = cyberlinksQuery.data?.cyberlinks_aggregate.aggregate.count;
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
          <strong>{text}</strong> {change && <strong>(+{change})</strong>}
          {/* and <strong>growing</strong> */}
        </>
      )}
    </div>
  );
}

export default Stats;
