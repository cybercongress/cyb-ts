import { Milkdown } from '@milkdown/react';
import '@milkdown/theme-nord/style.css';
import './MilkdownEditor.css';
import { RefObject, useImperativeHandle } from 'react';
import { editorViewCtx, parserCtx } from '@milkdown/core';
import { Slice } from '@milkdown/prose/model';
import useMilkdownEditor from '../../hooks/useMilkdownEditor';

export interface MilkdownRef {
  update: (markdown: string) => void;
}

export interface MilkdownProps {
  content: string;
  onChange: (markdown: string) => void;
  milkdownRef: RefObject<MilkdownRef>;
}

function MilkdownEditor({ content, onChange, milkdownRef }: MilkdownProps) {
  const { loading, get } = useMilkdownEditor(content, onChange);

  useImperativeHandle(milkdownRef, () => ({
    update: (markdown: string) => {
      if (loading) return;
      const editor = get();
      editor?.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const parser = ctx.get(parserCtx);
        const doc = parser(markdown);
        if (!doc) return;
        const { state } = view;
        view.dispatch(
          state.tr.replace(
            0,
            state.doc.content.size,
            new Slice(doc.content, 0, 0)
          )
        );
      });
    },
  }));

  return <Milkdown />;
}

export default MilkdownEditor;
