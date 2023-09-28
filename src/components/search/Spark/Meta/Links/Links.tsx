import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import { LinksTypeFilter } from 'src/containers/Search/types';
import styles from './Links.module.scss';

type Props = {
  to: number;
  from: number;
  value: LinksTypeFilter;
  onChange: () => void;
};

function Links({ to = 0, from = 0, value, onChange }: Props) {
  return (
    <div className={styles.links}>
      <ButtonsGroup
        type="radio"
        onChange={onChange}
        items={[
          {
            label: String(to),
            name: LinksTypeFilter.to,
            checked: value === LinksTypeFilter.to,
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: <span />,
            name: LinksTypeFilter.all,
            checked: value === LinksTypeFilter.all,
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: String(from),
            name: LinksTypeFilter.from,
            checked: value === LinksTypeFilter.from,
          },
        ]}
      />
    </div>
  );
}

export default Links;
