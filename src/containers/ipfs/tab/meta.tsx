import { NoItems } from '../../../components';
import Creator from '../components/creator';
import Backlinks from '../components/backlinks';
import MetaInfo from '../components/metaInfo';
import Community from '../components/community';

function Container({ children }) {
  return (
    <div style={{ width: '70%', margin: '0px auto', padding: 10 }}>
      {children}
    </div>
  );
}

function Text({ children }) {
  return (
    <div style={{ marginTop: 10, marginBottom: 25, fontSize: '18px' }}>
      {children}
    </div>
  );
}

function MetaTab({ creator, backlinks, parent, communityData, content, cid }) {
  try {
    return (
      <>
        <Container>
          <Text>Creator</Text>
          {creator && <Creator creator={creator} />}
          <Text>Community</Text>
          <Community community={communityData} />
          <Text>Backlinks</Text>
        </Container>
        <Backlinks data={backlinks} parent={parent} />
        <Container>
          <Text>Meta</Text>
          {content && <MetaInfo cid={cid} data={content?.meta} />}
        </Container>
      </>
    );
  } catch (error) {
    return <NoItems text="oops..." />;
  }
}

export default MetaTab;
