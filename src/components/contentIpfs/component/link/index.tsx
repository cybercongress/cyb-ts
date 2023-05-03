import GatewayContent from '../gateway';

function LinkHttp({ content, preview }) {
  return (
    <>
      <div>{content}</div>
      {preview && <GatewayContent url={content} />}
    </>
  );
}

export default LinkHttp;
