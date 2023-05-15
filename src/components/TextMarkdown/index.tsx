import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import cx from 'classnames';
import { LinkWindow } from '../link/link';
import styles from './styles.scss';
import React from 'react';

function TextMarkdown({
  children,
  fullWidth,
}: {
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={cx(styles.markdownContainer, {
        [styles.markdownContainerFullWidth]: fullWidth,
      })}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeStringify, rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
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
