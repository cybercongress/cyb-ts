import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { ContainerGradient } from '../components';
import MoonCode from './MoonCode';
import { LinkWindow } from '../../../components';

const linkMovie =
  'https://gateway.ipfs.cybernode.ai/ipfs/QmanZyMFnEti618crNPkn93g7MFaoDGrZ4Pta5drfdt9jb';

function Rules() {
  return (
    <ContainerGradient
      userStyleContent={{ height: '2350px' }}
      styleLampContent="red"
      title="Moon Code"
      closedTitle="Moon Code"
    >
      <div
        style={{
          width: '100%',
          background: 'transparent',
          position: 'relative',
          height: '300px',
          marginBottom: '10px',
        }}
      >
        <video width="100%" height="100%" controls>
          <source src={linkMovie} type="video/mp4" />
        </video>
      </div>
      <div
        className="markdown"
        style={{ paddingRight: '15px', height: '100%', width: '100%' }}
      >
        <ReactMarkdown
          children={MoonCode}
          rehypePlugins={[rehypeSanitize]}
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => {
              if (node.properties && node.properties.href) {
                const { href } = node.properties;
                return <LinkWindow to={href} {...props} />;
              }
            },
          }}
        />
      </div>
    </ContainerGradient>
  );
}

export default Rules;
