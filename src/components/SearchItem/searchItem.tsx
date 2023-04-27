import styles from './styles.module.scss';
import { ContainerGradientText } from '../containerGradient/ContainerGradient';
import Status, { StatusType } from './status';

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

type Props = {
  status: StatusType;
  grade?: {
    value: number;
  };
  children: React.ReactNode;
  textPreview?: React.ReactNode;
};

function SearchItem({ status, grade, children, textPreview }: Props) {
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
          {/* TODO: Status seems that processed incorrect */}
          {status !== 'downloaded' && <Status status={status} />}
        </div>
        <div className={styles.containerChildren}>{children}</div>
      </div>
    </ContainerGradientText>
  );

  return item;
}

export default SearchItem;
