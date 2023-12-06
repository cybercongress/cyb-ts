import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PATTERN_IPFS_HASH } from 'src/utils/config';
import { MainContainer } from '../../components';
import styles from './IPFS.module.scss';
import SearchResults from '../Search/SearchResults';
import IpfsContent from './components/contentView/ipfsContent';
import TextContent from './components/contentView/textContent';

function Ipfs() {
  const { query = '' } = useParams();
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    const isText = query.match(PATTERN_IPFS_HASH);
    setIsText(!isText);
  }, [query]);

  return (
    <MainContainer width="62%" resetMaxWidth>
      <div className={styles.wrapper}>
        {isText && <TextContent text={query} />}
        {!isText && <IpfsContent cid={query} />}
      </div>

      <SearchResults />
    </MainContainer>
  );
}

export default Ipfs;
