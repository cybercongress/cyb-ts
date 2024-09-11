import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { automd } from '@milkdown/plugin-automd';
import { history, historyKeymap } from '@milkdown/kit/plugin/history';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { useEditor } from '@milkdown/react';
import useDebounce from 'src/hooks/useDebounce';
import { useStudioContext } from 'src/features/studio/studio.context';

// import {
//   inputRuleAsk,
//   inputRuleNeuron,
//   markSchemaCybSyntax,
//   remarkCybSyntaxPlugin,
// } from '../plugins/cybSyntax/pluginCybSyntax';

function useMilkdownEditor(
  defaultValue: string,
  onChange: (markdown: string) => void
) {
  const { debounce } = useDebounce();
  const { saveMarkdown } = useStudioContext();

  const editorInfo = useEditor(
    (root) => {
      return (
        Editor.make()
          .config((ctx) => {
            ctx.set(rootCtx, root);
            ctx.set(defaultValueCtx, defaultValue);
            // ctx.set(placeholderConfig.key, 'Please input here...');
            ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
              debounce(onChange, 100)(markdown);
            });
            ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
              debounce(saveMarkdown, 10000)(markdown);
            });
            ctx.set(historyKeymap.key, {
              // Remap to one shortcut.
              Undo: 'Mod-z',
              // Remap to multiple shortcuts.
              Redo: ['Mod-y', 'Shift-Mod-z'],
            });
          })
          .config(nord)
          .use(commonmark)
          .use(clipboard)
          .use(automd)
          .use(history)
          // .use(placeholderPlugin)
          .use(listener)
      );
    },
    [onChange, defaultValue]
  );

  // const { get } = editorInfo;

  // useEffect(() => {
  //   requestAnimationFrame(() => {
  //     (async () => {
  //       const editor = get();
  //       if (!editor) {
  //         return;
  //       }
  //       editor.use(placeholder);
  //       // editor.use(placeholderConfig);
  //       // editor.use(remarkCybSyntaxPlugin);
  //       // editor.use(markSchemaCybSyntax);
  //       // editor.use([inputRuleAsk, inputRuleNeuron]);
  //       // const promiseList: Promise<unknown>[] = [];

  //       // enabledFeatures.forEach((feature) => {
  //       //   promiseList.push(loadFeature(feature, editor));
  //       // });
  //       // await Promise.all(promiseList);

  //       await editor.create();
  //     })();
  //   });
  // }, [get]);

  return editorInfo;
}

export default useMilkdownEditor;
