type DotsProps = {
  big?: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export function Dots({ big }: DotsProps) {
  return (
    <div className={big ? 'loader-dot schedule' : 'loader-dot'}>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
}
