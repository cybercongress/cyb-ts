import GatewayContent from '../gateway';

function LinkHttp({
  content,
  preview,
}: {
  content: string;
  preview?: boolean;
}) {
  return (
    <>
      <div>{content}</div>
      {preview && <GatewayContent url={content} />}
    </>
  );
}

export default LinkHttp;
