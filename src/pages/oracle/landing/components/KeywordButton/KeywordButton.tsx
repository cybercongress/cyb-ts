import { Link } from 'react-router-dom';
import styles from './KeywordButton.module.scss';
import { routes } from 'src/routes';
import { Account, Tooltip } from 'src/components';
import Pill from 'src/components/Pill/Pill';

function KeywordButton({ keyword, author }: { keyword: string }) {
  return (
    <Tooltip tooltip={author && <Account avatar address={author} />}>
      <Link
        className={styles.keywordBtn}
        key={keyword}
        to={routes.search.getLink(keyword)}
      >
        {keyword}
      </Link>
    </Tooltip>
  );
}

export default KeywordButton;
