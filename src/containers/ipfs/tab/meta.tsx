import { NoItems } from '../../../components';
import Creator from '../components/creator';
import Backlinks from '../components/backlinks';
import MetaInfo from '../components/metaInfo';
import Community from '../components/community';
import Display from 'src/components/containerGradient/Display/Display';

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
        <Display>
          <Text>Creator</Text>
          {creator && <Creator creator={creator} />}
          <Text>Community</Text>
          <Community community={communityData} />
          {/* <Text>Backlinks</Text> */}
        </Display>
        <br />
        {/* <Backlinks data={backlinks} parent={parent} /> */}
        <Display>
          <Text>Meta</Text>
          {content && <MetaInfo cid={cid} data={content?.meta} />}
        </Display>
      </>
    );
  } catch (error) {
    return <NoItems text="oops..." />;
  }
}

export default MetaTab;
