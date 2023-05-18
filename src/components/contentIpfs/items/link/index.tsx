import GatewayContent from '../gateway';

const embeddableUrl = (url: string) => {
  if (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1) {
    if (url.indexOf('embed') === -1) {
      return url.indexOf('watch?v=') > -1
        ? url.replace('watch?v=', 'embed/')
        : url
            .replace('youtube.com/', 'youtube.com/embed/')
            .replace('youtu.be/', 'www.youtube.com/embed/');
    }
  }

  return url;
};

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
      {preview && <GatewayContent url={embeddableUrl(content)} />}
    </>
  );
}

export default LinkHttp;
