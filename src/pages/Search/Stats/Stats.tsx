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

function Stats({ type }: Props) {
  const dataGetGraphStats = useGetGraphStats();
  const negentropy = useGetNegentropy();

  const cyberlinksQuery = useQuery(generateQuery('cyberlinks_aggregate'));
  const particlesQuery = useQuery(generateQuery('particles_aggregate'));

  let value: number | undefined;
  let text: string;
  let change: number | undefined;

  switch (type) {
    case TitleType.search:
      value = dataGetGraphStats.data?.particles;
      text = 'particles';

      if (!(particlesQuery.loading || particlesQuery.error)) {
        change = particlesQuery.data?.particles_aggregate.aggregate.count;
      }
      break;

    case TitleType.learning:
      value = dataGetGraphStats.data?.cyberlinks;
      text = 'cyberlinks';
      if (!(cyberlinksQuery.loading || cyberlinksQuery.error)) {
        change = cyberlinksQuery.data?.cyberlinks_aggregate.aggregate.count;
      }
      break;

    case TitleType.ai:
      value = negentropy.data?.negentropy;
      text = 'bits negentropy';
      break;

    default:
  }

  if (!value) {
    return null;
  }

  return (
    <div className={cx(landingStyles.infoText, styles.wrapper)}>
      <h4>
        <TypingText
          content={`${Number(value)
            .toLocaleString()
            .replaceAll(',', ' ')} ${text}`}
          delay={40}
        />
      </h4>
      {change && (
        <>
          <span>+{change}</span> <span>in 24 hours</span>
        </>
      )}
    </div>
  );
}

export default Stats;
