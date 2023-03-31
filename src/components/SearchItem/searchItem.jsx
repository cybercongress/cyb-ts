import styles from './styles.scss';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import Status from './status';

const gradeColorRank = (grade) => {
  let classColor = 'grey';

  switch (grade) {
    case 1:
    case 2:
    case 3:
    case 4:
      classColor = 'red';
      break;
    case 5:
      classColor = 'green';
      break;
    case 6:
      classColor = 'blue';
      break;
    case 7:
      classColor = 'pink';
      break;
    default:
      classColor = 'grey';
      break;
  }

  return classColor;
};

function SearchItem({ status, grade, children, textPreview }) {
  let colorRank = 'grey';

  if (grade && grade.value) {
    colorRank = gradeColorRank(grade.value);
  }

  const item = (
    <ContainerGradientText status={colorRank}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flex: 1,
            }}
          >
            {textPreview && (
              <div className={styles.containerTextPreview}>{textPreview}</div>
            )}
          </div>
          {status !== 'downloaded' && <Status status={status} />}
        </div>
        <div className={styles.containerChildren}>{children}</div>
      </div>
    </ContainerGradientText>
  );

  return item;
}

export default SearchItem;
