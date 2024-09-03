import { Plugin, PluginKey } from '@milkdown/prose/state';
import type { EditorView } from '@milkdown/prose/view';
import { type Ctx, type MilkdownPlugin } from '@milkdown/ctx';
import { $ctx, $prose } from '@milkdown/utils';

export const placeholderConfig = $ctx(
  'Please input here...',
  'placeholderConfig'
);

export const placeholderPlugin = $prose((ctx: Ctx) => {
  const update = (view: EditorView) => {
    const { doc } = view.state;
    if (
      doc.childCount === 1 &&
      doc.firstChild?.isTextblock &&
      doc.firstChild?.content.size === 0 &&
      doc.firstChild?.type.name === 'paragraph'
    ) {
      view.dom.setAttribute('data-placeholder', ctx.get(placeholderConfig.key));
    } else {
      view.dom.removeAttribute('data-placeholder');
    }
  };

  return new Plugin({
    key: new PluginKey('MILKDOWN_PLACEHOLDER'),
    view(view) {
      update(view);

      return { update };
    },
  });
});

export const placeholder: MilkdownPlugin[] = [
  placeholderPlugin,
  placeholderConfig,
];
