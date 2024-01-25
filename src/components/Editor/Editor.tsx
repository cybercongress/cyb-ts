import { createCmdKey, defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { Milkdown, useEditor } from '@milkdown/react';
import {
  commonmark,
  UpdateLinkCommandPayload,
} from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { $inputRule, $remark, $markSchema, $command } from '@milkdown/utils';
import { markRule } from '@milkdown/prose';
import { toggleMark } from '@milkdown/prose/commands';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { clipboard } from '@milkdown/plugin-clipboard';
import { useEffect } from 'react';
import remarkGithub from './remark';

import '@milkdown/theme-nord/style.css';
import './Editor.css';

const markdown = `# Milkdown React Commonmark

[cyber](skdfn)

~(cyber) Commonmark demo
`;

const remarkDirective = $remark('underlinePlugin', () => remarkGithub);
const directiveNode = $markSchema('link-cyber', () => ({
  attrs: {
    href: {},
  },
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: (dom) => {
        return {
          href: (dom as HTMLElement).getAttribute('href'),
        };
      },
    },
  ],
  toDOM: (mark) => ['a', { href: mark.attrs.href }, 0],
  parseMarkdown: {
    match: (node) => {
      return node.type === 'link-cyber' && node.name === 'cyberlink';
    },
    runner: (state, node, markType) => {
      const attrs = node.url as string;
      state.openMark(markType, { href: attrs });
      state.next(node.children);
      state.closeMark(markType);
    },
  },
  toMarkdown: {
    match: (mark) => {
      return mark.type.name === 'link-cyber';
    },
    runner: (state, mark) => {
      state.withMark(mark, 'link', undefined, {
        url: mark.attrs.href,
      });
    },
  },
}));

const WrapInHeading = createCmdKey<number>();

export const toggleLinkCommand = $command(
  'UpdateLink',
  (ctx) => (payload) => {
    console.log('payload', state);
    // return toggleMark(directiveNode.type(ctx), payload);
  }
);

const inputRule = $inputRule((ctx) => {
  return markRule(/~\((?<src>[^"]+)?"?\)/, directiveNode.type(ctx), {
    updateCaptured: ({ fullMatch, start }) =>
      !fullMatch.startsWith('~(')
        ? { fullMatch: fullMatch.slice(1), start: start + 1 }
        : {},
    getAttr: (match) => {
      return {
        href: `https://cyb.ai/oracle/ask/${Array.from(match)[1]}`,
      };
    },
  });
});

function MilkdownEditor({ onSave }: { onSave: (markdown: string) => void }) {
  const editorInfo = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        const listener = ctx.get(listenerCtx);
        listener.markdownUpdated((_, md) => {
          console.log(md);
        });
      })
      .config(nord)
      .use(commonmark)
      .use(clipboard)
      .use(listener);
  }, []);

  const { get } = editorInfo;

  useEffect(() => {
    requestAnimationFrame(() => {
      (async () => {
        const editor = get();
        if (!editor) {
          return;
        }

        editor.use(remarkDirective);
        editor.use(directiveNode);
        editor.use(inputRule);

        await editor.create();
      })();
    });
  }, [get]);

  return <Milkdown />;
}

export default MilkdownEditor;
