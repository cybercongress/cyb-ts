import { Link } from 'react-router-dom';
import styles from './KeywordButton.module.scss';
import { routes } from 'src/routes';

function KeywordButton({ keyword }: { keyword: string }) {
  return (
    <Link
      className={styles.keywordBtn}
      key={keyword}
      to={routes.search.getLink(keyword)}
    >
      {keyword}
    </Link>
  );
}

export default KeywordButton;
