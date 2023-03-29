import { NoItems, SearchSnippet } from '../../../components';

function FeedsTab({ data, mobile, nodeIpfs }) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onClickRank = () => {};
  if (data && data.length > 0) {
    return (
      <div className="container-contentItem" style={{ width: '100%' }}>
        {data
          .sort((a, b) => {
            const x = Date.parse(a.timestamp);
            const y = Date.parse(b.timestamp);
            return y - x;
          })
          .map((item, i) => {
            const cid = item.tx.value.msg[0].value.links[0].to;
            return (
              <SearchSnippet
                key={i}
                cid={cid}
                data={item}
                mobile={mobile}
                node={nodeIpfs}
                onClickRank={onClickRank}
              />
            );
          })}
      </div>
    );
  }
  return (
    <div className="container-contentItem">
      <NoItems text="No feeds" />
    </div>
  );
}

export default FeedsTab;
