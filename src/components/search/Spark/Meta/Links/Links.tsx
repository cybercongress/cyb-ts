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
            tooltip: 'show only incoming particles - asks',
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: <span />,
            name: LinksTypeFilter.all,
            checked: value === LinksTypeFilter.all,
            tooltip: 'show all particles',
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: String(from),
            name: LinksTypeFilter.from,
            checked: value === LinksTypeFilter.from,
            tooltip: 'show only outcoming particles - answers',
          },
        ]}
      />
    </div>
  );
}

export default Links;
