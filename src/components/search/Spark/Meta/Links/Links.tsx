import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import styles from './Links.module.scss';
import { LinksTypeFilter } from 'src/containers/Search/types';

type Props = {
  backlinks: number;
  outcoming: number;
};

function Links({ backlinks = 0, outcoming = 0, value, onChange }: Props) {
  return (
    <div className={styles.links}>
      <ButtonsGroup
        type="radio"
        onChange={onChange}
        items={[
          {
            label: backlinks,
            name: 'to',
            checked: value === LinksTypeFilter.to,
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: <span></span>,
            name: 'all',
            checked: value === LinksTypeFilter.all,
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: outcoming,
            name: 'from',
            checked: value === LinksTypeFilter.from,
          },
        ]}
      />
    </div>
  );
}

export default Links;
