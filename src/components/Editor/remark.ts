import { visit } from 'unist-util-visit';
import { u } from 'unist-builder';

const isInsideLink = (node, ancestors) => {
  return ancestors.some((ancestor) => ancestor.type === 'link');
};

const remarkGithub = () => {
  const CYBERLINK_REGEX = /~\((.*)\)/g;

  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!isInsideLink(node, [])) {
        const children = [];
        let lastIndex = 0;
        let match;

        function addText(text, start, end) {
          if (start < end) children.push(u('text', text.slice(start, end)));
        }

        while ((match = CYBERLINK_REGEX.exec(node.value)) !== null) {
          const [fullMatch, usernameOrOrg] = match;
          console.log('match', match)
          addText(node.value, lastIndex, match.index);
          children.push(
            u(
              'link-cyber',
              {
                url: `https://cyb.ai/oracle/ask/${usernameOrOrg}`,
                name: 'cyberlink',
              },
              [u('text', usernameOrOrg)]
            )
          );
          lastIndex = match.index + fullMatch.length;
        }

        addText(node.value, lastIndex, node.value.length);

        if (
          children.length > 1 ||
          (children.length === 1 && children[0].type !== 'text')
        ) {
          parent.children.splice(index, 1, ...children);
        }
      }
    });
  };
};

export default remarkGithub;
