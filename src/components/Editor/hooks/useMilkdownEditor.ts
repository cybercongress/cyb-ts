import { useEffect } from 'react';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { clipboard } from '@milkdown/plugin-clipboard';
import { useEditor } from '@milkdown/react';
import { debounce } from 'src/utils/helpers';
import {
  inputRuleAsk,
  inputRuleNeuron,
  markSchemaCybSyntax,
  remarkCybSyntaxPlugin,
} from '../plugins/cybSyntax/pluginCybSyntax';

function useMilkdownEditor(
  defaultValue: string,
  onChange: (markdown: string) => void
) {
  const editorInfo = useEditor(
    (root) => {
      return Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, defaultValue);
          ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
            debounce(onChange, 100)(markdown);
          });
        })
        .config(nord)
        .use(listener)
        .use(clipboard)
        .use(commonmark);
    },
    [onChange, defaultValue]
  );

  const { get } = editorInfo;

  useEffect(() => {
    requestAnimationFrame(() => {
      (async () => {
        const editor = get();
        if (!editor) {
          return;
        }

        editor.use(remarkCybSyntaxPlugin);
        editor.use(markSchemaCybSyntax);
        editor.use([inputRuleAsk, inputRuleNeuron]);

        await editor.create();
      })();
    });
  }, [get]);

  return editorInfo;
}

export default useMilkdownEditor;
