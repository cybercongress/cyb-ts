import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { nord } from '@milkdown/theme-nord';
import { automd } from '@milkdown/plugin-automd';
import { history, historyKeymap } from '@milkdown/kit/plugin/history';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { useEditor } from '@milkdown/react';
import useDebounce from 'src/hooks/useDebounce';

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
  // const enabledFeatures = Object.entries({
  //   ...defaultFeatures,
  // })
  //   .filter(([, enabled]) => enabled)
  //   .map(([feature]) => feature as EditorFeature);

  const editorInfo = useEditor(
    (root) => {
      return (
        Editor.make()
          // .config(configureFeatures(enabledFeatures))
          .config((ctx) => {
            ctx.set(rootCtx, root);
            ctx.set(defaultValueCtx, defaultValue);
            ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
              debounce(onChange, 100)(markdown);
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
  //       editor.use(placeholderPlugin);
  //       editor.use(placeholderConfig);
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
  // }, [get, enabledFeatures]);

  return editorInfo;
}

export default useMilkdownEditor;
