import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import cx from 'classnames';
import React from 'react';
import { LinkWindow } from '../link/link';
import styles from './styles.scss';

function TextMarkdown({
  children,
  fullWidth,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      // className="container-text-SearchItem"
      className={cx({
        [styles.markdownContainerPreview]: fullWidth,
        [styles.markdownContainer]: !fullWidth,
      })}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeStringify, rehypeSanitize]}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
          a: ({ node, ...props }) => {
            if (node.properties && node.properties.href) {
              const { href } = node.properties;
              return <LinkWindow to={href} {...props} />;
            }
            return null;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default TextMarkdown;
