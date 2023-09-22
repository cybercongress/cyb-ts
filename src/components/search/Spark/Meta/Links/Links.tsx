import ButtonsGroup from 'src/components/buttons/ButtonsGroup/ButtonsGroup';
import styles from './Links.module.scss';

type Props = {
  backlinks: number;
  outcoming: number;
};

// reuse
enum LinksFilter {
  backlinks = 'backlinks',
  all = 'all',
  cyberLinks = 'cyberLinks',
}

function Links({ backlinks = 0, outcoming = 0, value, onChange }: Props) {
  return (
    <div className={styles.links}>
      <ButtonsGroup
        type="radio"
        onChange={onChange}
        items={[
          {
            label: backlinks,
            name: 'backlinks',
            checked: value === LinksFilter.backlinks,
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: <span></span>,
            name: 'all',
            checked: value === LinksFilter.all,
          },
          {
            label: <>&rarr;</>,
            disabled: true,
          },
          {
            label: outcoming,
            name: 'cyberLinks',
            checked: value === LinksFilter.cyberLinks,
          },
        ]}
      />
    </div>
  );
}

export default Links;
