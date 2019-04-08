import React from 'react';
import {
    SkillBar, Pane, Heading,
} from '@cybercongress/ui';

const BandwidthBar = ({ bwRemained, bwMaxValue, linkPrice }) => {
    const bwPercent = (bwRemained / bwMaxValue * 100).toFixed(2);

    return (
        <Pane marginBottom={ 56 }>
            <Heading size={ 600 } color='#fff' marginBottom={ 24 }>
                My bandwidth
            </Heading>
            <SkillBar
              style={ { height: 16 } }
              bwPercent={ bwPercent }
              bwRemained={ bwRemained }
              bwMaxValue={ bwMaxValue }
              linkPrice={ linkPrice }
            />
        </Pane>
    );
};

export default BandwidthBar;
