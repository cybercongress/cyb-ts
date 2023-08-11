import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import cx from 'classnames';
import React from 'react';
import { LinkWindow } from 'src/components/link/link';
import styles from './styles.module.scss';

function TextMarkdown({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: boolean;
}) {
  return (
    <div
      // className="container-text-SearchItem"
      className={cx({
        [styles.markdownContainerPreview]: preview,
        [styles.markdownContainer]: !preview,
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
