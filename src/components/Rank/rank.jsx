import { Pane, Text } from '@cybercongress/gravity';
import { Copy } from '../ui/copy';
import Tooltip from '../tooltip/tooltip';
import { LinkWindow } from '../link/link';
import { trimString, exponentialToDecimal } from '../../utils/utils';
import { getRankGrade } from 'src/utils/search/utils';

function GradeTooltipContent({ grade, hash, color, rank }) {
  return (
    <Pane paddingX={15} paddingY={15}>
      <Pane marginBottom={12}>
        <Text color="#ffff">
          Answer rank for{' '}
          {hash && (
            <Pane display="inline-flex" alignItems="center">
              {trimString(hash, 5, 5)} <Copy text={hash} />
            </Pane>
          )}{' '}
          is {rank}
        </Text>
      </Pane>
      <Pane display="flex" marginBottom={12}>
        <Text color="#ffff">
          Answers between &nbsp;
          {exponentialToDecimal(parseFloat(grade.from).toPrecision(3))}
          &nbsp; and &nbsp;
          {exponentialToDecimal(parseFloat(grade.to).toPrecision(3))}
          &nbsp; recieve grade
          <Pane
            className="rank"
            style={{ display: 'inline-flex' }}
            marginLeft="5px"
            backgroundColor={color}
          >
            {grade.value}
          </Pane>
        </Text>
      </Pane>
      <Pane>
        <Text color="#ffff">
          More about{' '}
          <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
            cyber~Rank
          </LinkWindow>
        </Text>
      </Pane>
    </Pane>
  );
}

const gradeColorRank = (rank) => {
  let rankGradeColor = '#546e7a';

  switch (rank) {
    case 1:
      rankGradeColor = '#ff3d00';
      break;
    case 2:
      rankGradeColor = '#ff9100';
      break;
    case 3:
      rankGradeColor = '#ffea00';
      break;
    case 4:
      rankGradeColor = '#64dd17';
      break;
    case 5:
      rankGradeColor = '#00b0ff';
      break;
    case 6:
      rankGradeColor = '#304ffe';
      break;
    case 7:
      rankGradeColor = '#d500f9';
      break;
    default:
      rankGradeColor = '#546e7a';
      break;
  }

  return rankGradeColor;
};

function Rank({ rank, hash, ...props }) {
  const gradeValue = getRankGrade(rank);
  const color = gradeColorRank(gradeValue.value);
  return (
    <Tooltip
      placement="bottom"
      tooltip={
        <GradeTooltipContent
          grade={gradeValue}
          hash={hash}
          color={color}
          rank={rank}
        />
      }
    >
      <Pane className="rank" backgroundColor={color} {...props}>
        {gradeValue.value}
      </Pane>
    </Tooltip>
  );
}

export default Rank;
