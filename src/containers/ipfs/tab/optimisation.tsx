import { Pane } from '@cybercongress/gravity';
import ContentItem from '../../../components/ContentItem/contentItem';
import { Rank, NoItems } from '../../../components';
import { Option } from 'src/types';
import { CyberLink } from 'src/types/cyberLink';

type Props = {
  data: Option<CyberLink[]>;
  parent: string;
  mobile?: boolean;
};

function OptimisationTab({ data, mobile, parent }: Props) {
  if (data && data.length > 0) {
    return (
      <div style={{ width: '100%' }}>
        {data &&
          data.map((item) => {
            return (
              <Pane
                position="relative"
                className="hover-rank"
                display="flex"
                alignItems="center"
                marginBottom="10px"
                key={item.cid}
              >
                {!mobile && (
                  <Pane
                    className="time-discussion rank-contentItem"
                    position="absolute"
                  >
                    <Rank hash={item.cid} rank={item.rank} />
                  </Pane>
                )}
                <ContentItem
                  cid={item.cid}
                  item={item}
                  className="contentItem"
                  parent={parent}
                />
              </Pane>
            );
          })}
      </div>
    );
  }
  return (
    <div className="container-contentItem">
      <NoItems text="No cyberLinks" />
    </div>
  );
}

export default OptimisationTab;
