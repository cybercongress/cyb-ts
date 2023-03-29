// eslint-disable-next-line import/prefer-default-export
export function Copy({ text, ...props }) {
  return (
    <button
      className="copy-address-btn"
      type="button"
      aria-label="Save"
      {...props}
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
    />
  );
}
