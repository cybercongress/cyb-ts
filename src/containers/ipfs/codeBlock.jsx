import React from 'react';
import hljs from 'highlight.js';

class CodeBlock extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }

  setRef(el) {
    this.codeEl = el;
  }

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl);
  }

  render() {
    const { language, value } = this.props;

    return (
      <pre>
        <code ref={this.setRef} className={`language-${language}`}>
          {value}
        </code>
      </pre>
    );
  }
}

export default CodeBlock;
