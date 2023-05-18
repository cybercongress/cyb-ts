type Item = {
  value: number;
  color: string;
};

interface ItemReduce extends Item {
  itemRatio: number;
  offset: number;
  angle: number;
  filled: number;
}

export type Props = {
  data: Item[];
};

function DonutChart({ data }: Props) {
  const cx = 100;
  const cy = 100;
  const strokeWidth = 3;
  const radius = Math.min(cx, cy) / 2;
  const dashArray = 2 * Math.PI * radius;
  const startAngle = -90;

  let filled = 0;

  const sum = data.reduce((sum, item) => {
    return sum + item.value;
  }, 0);

  const ratio = 100 / sum;

  const dataReduce = data.reduce<ItemReduce[]>((acc, obj) => {
    const itemRatio = ratio * obj.value;
    const angle = (filled * 360) / 100 + startAngle;
    const offset = dashArray - (dashArray * itemRatio) / 100;

    const newObj = { ...obj, itemRatio, offset, angle, filled };
    filled += itemRatio;

    return [...acc, newObj];
  }, []);

  return (
    <div className="donut-chart">
      <svg width="150px" height="150px" viewBox="35 35 135 135">
        {dataReduce.map((item, index) => (
          <>
            <filter key={`filter_${index}`} id="dropshadow" height="130%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="2"
                floodColor={item.color}
                floodOpacity="1"
              />
            </filter>
            <circle
              key={index}
              // filter="url(#dropshadow)"
              cx={cx}
              cy={cy}
              r={radius}
              fill="transparent"
              strokeWidth={strokeWidth}
              stroke={item.color}
              filter={`drop-shadow(0px 0px 2px ${item.color})`}
              strokeDasharray={dashArray}
              strokeDashoffset={item.offset}
              transform={`rotate(${item.angle} ${cx} ${cy})`}
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`${startAngle} ${cx} ${cy}`}
                to={`${item.angle} ${cx} ${cy}`}
                dur="1s"
              />
            </circle>
          </>
        ))}
      </svg>
    </div>
  );
}

export default DonutChart;
