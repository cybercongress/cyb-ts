import { visit } from 'unist-util-visit';

const CYBERLINK_REGEX = /~\[(.*)]/g;

const extractPosition = (string, start, end) => {
  const startLine = string.slice(0, start).split('\n');
  const endLine = string.slice(0, end).split('\n');

  return {
    start: {
      line: startLine.length,
      column: startLine[startLine.length - 1].length + 1,
    },
    end: {
      line: endLine.length,
      column: endLine[endLine.length - 1].length + 1,
    },
  };
};

const extractText = (string, start, end) => ({
  type: 'text',
  value: string.slice(start, end),
  position: extractPosition(string, start, end),
});

const underlinePlugin = () => {
  function transformer(tree) {
    visit(tree, 'text', (node, index, parent) => {
      const definition = [];
      let lastIndex = 0;

      const matches = node.value.matchAll(CYBERLINK_REGEX);

      // eslint-disable-next-line no-restricted-syntax
      for (const match of matches) {
        const value = match[1];
        const type = 'textDirective';
        const name = 'cyberlink';
        const attributes = {
          href: `https://cyb.ai/oracle/ask/${value}`,
        };

        if (match.index !== lastIndex) {
          definition.push(extractText(node.value, lastIndex, match.index));
        }

        definition.push({
          type,
          name,
          attributes,
          children: [
            extractText(
              node.value,
              match.index + 2, // 1 is start ~[
              match.index + value.length + 2 // 1 is start ~[
            ),
          ],
          position: extractPosition(
            node.value,
            match.index,
            match.index + value.length + 3 // 2 is start and end ~[]
          ),
        });

        lastIndex = match.index + value.length + 3; // 2 is start and end ~[]
      }

      if (lastIndex !== node.value.length) {
        const text = extractText(node.value, lastIndex, node.value.length);
        definition.push(text);
      }

      const last = parent.children.slice(index + 1);
      parent.children = parent.children.slice(0, index);
      parent.children = parent.children.concat(definition);
      parent.children = parent.children.concat(last);
    });
  }

  return transformer;
};

export default underlinePlugin;
