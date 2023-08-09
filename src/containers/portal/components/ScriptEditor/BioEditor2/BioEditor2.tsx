import { useState } from 'react';

import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import ActionBarContainer from 'src/components/actionBar';

import './BioEditor.css';

function BioEditor2({
  bio,
  onSave,
}: {
  bio: string;
  onSave: (markdown: string) => void;
}) {
  const [markdown, setMarkdown] = useState(bio);
  const [isChanged, setIsChanged] = useState(false);
  const onSaveClick = () => {
    onSave(markdown);
    setIsChanged(false);
  };

  const onCancelClick = () => {
    setMarkdown(bio);
    setIsChanged(false);
  };

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        const listener = ctx.get(listenerCtx);

        listener.markdownUpdated((ctx, md, prevMd) => {
          if (md !== prevMd) {
            setMarkdown(md);
            setIsChanged(true);
          }
        });
      })
      .use(listener)
      .config(nord)
      .use(commonmark);
  }, []);

  return (
    <>
      <Milkdown />
      <ActionBarContainer
        additionalButtons={
          isChanged
            ? [
                { text: 'cancel', onClick: onCancelClick },
                { text: 'save', onClick: onSaveClick },
              ]
            : []
        }
      ></ActionBarContainer>
    </>
  );
}

export default BioEditor2;
