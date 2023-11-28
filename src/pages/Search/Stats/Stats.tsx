import {
  useGetGraphStats,
  useGetNegentropy,
} from 'src/containers/temple/hooks';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';
import cx from 'classnames';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import landingStyles from '../Search.module.scss';
import styles from './Stats.module.scss';
import { TitleType } from '../Search';

type Props = {
  type: TitleType;
};

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

const REFETCH_INTERVAL = 1000 * 7;

function Stats({ type }: Props) {
  const dataGetGraphStats = useGetGraphStats(REFETCH_INTERVAL);
  const negentropy = useGetNegentropy(REFETCH_INTERVAL);

  // const cyberlinksQuery = useQuery(generateQuery('cyberlinks_aggregate'));
  // const particlesQuery = useQuery(generateQuery('particles_aggregate'));

  let value: number | undefined;
  let text: string;
  let change: number | undefined;

  switch (type) {
    case TitleType.search:
      value = dataGetGraphStats.data?.particles;
      text = 'particles';

      // if (!(particlesQuery.loading || particlesQuery.error)) {
      //   change = particlesQuery.data?.particles_aggregate.aggregate.count;
      // }
      break;

    case TitleType.learning:
      value = dataGetGraphStats.data?.cyberlinks;
      text = 'cyberlinks';
      // if (!(cyberlinksQuery.loading || cyberlinksQuery.error)) {
      //   change = cyberlinksQuery.data?.cyberlinks_aggregate.aggregate.count;
      // }
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
