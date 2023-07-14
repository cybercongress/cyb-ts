import styles from './styles.module.scss';
import Status, { StatusType } from './status';
import { ContainerGradientText } from '../containerGradient2/ContainerGradient';

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
};

function SearchItem({ status, grade, children }: Props) {
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
          wordBreak: 'break-word',
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
              width: '100%',
              flex: 1,
            }}
          >
            <div className={styles.containerChildren}>{children}</div>
          </div>
          {/* TODO: Status seems that processed incorrect */}
          {status !== 'completed' && <Status status={status} />}
        </div>
      </div>
    </ContainerGradientText>
  );

  return item;
}

export default SearchItem;
