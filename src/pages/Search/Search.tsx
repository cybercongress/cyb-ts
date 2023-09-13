import { Link } from 'react-router-dom';
import { ActionBar } from 'src/components';
import { routes } from 'src/routes';
import styles from './Search.module.scss';

function Search() {
  return (
    <div>
      <header className={styles.header}>
        {['superintelligence', 'donut of knowledge', 'help'].map((keyword) => {
          return (
            <Link
              className={styles.keywordBtn}
              key={keyword}
              to={routes.search.getLink(keyword)}
            >
              {keyword}
            </Link>
          );
        })}
      </header>

      <div className={styles.content}>
        <img src={require('./oracle.png')} alt="cyber" />

        <div className={styles.info}>
          <h2>decentralized search is here</h2>

          <div>
            <h4>111 000 particles</h4>
            <span>+ 5% in 3 hours</span>
          </div>
        </div>

        <ul className={styles.advantages}>
          {[
            {
              title: 'censorfree',
              text: (
                <>
                  its a blockchain <br /> limitless participation
                </>
              ),
            },
            {
              title: 'direct',
              text: (
                <>
                  pure content <br /> directly from peers
                </>
              ),
            },
            {
              title: 'instant',
              text: (
                <>
                  your content is searchable <br /> in 5 seconds
                </>
              ),
            },
          ].map(({ title, text }) => {
            return (
              <li key={title}>
                <h6>{title}</h6>
                <p>{text}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <ActionBar
        button={{
          text: 'Ask me anything',
          link: routes.search.getLink('cyber'),
        }}
      />
    </div>
  );
}

export default Search;
