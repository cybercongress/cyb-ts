import scriptEngine, { CompilerParams } from 'src/services/scripting/engine';

const compileScript = (code: string, compilerParams: Partial<CompilerParams>) =>
  scriptEngine.run(code, compilerParams);

const highlightErrors = (codeMirrorRef, diagnostics, styles) => {
  const cm = codeMirrorRef.editor;

  cm.getAllMarks().forEach((mark) => mark.clear());

  diagnostics.forEach((error) => {
    const { start, end } = error;
    cm.scrollIntoView({ line: start.line, ch: start.character });
    cm.markText(
      { line: start.line, ch: start.character },
      { line: end.line, ch: end.character },
      {
        className: styles.errorHighlight,
        clearOnEnter: true,
      }
    );
  });
};

const changeUrlLastPath = (path: string, newPath: string) => {
  const paths = path.split('/');
  paths.pop();
  paths.push(newPath);
  return paths.join('/');
};

export { compileScript, highlightErrors, changeUrlLastPath };
