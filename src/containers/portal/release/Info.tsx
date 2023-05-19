import { InfoCard } from '../components';
import { BOOT_ICON } from '../utils';
import { DataReleaseStatus } from './type';
import STEP_INFO from './utils';

const {
  STATE_READY_TO_RELEASE,
  STATE_NEXT_UNFREEZE,
  STATE_PROVE_ADDRESS,
} = STEP_INFO;

function Info({
  useReleasedStage,
  stepCurrent,
  nextRelease,
}: {
  stepCurrent: number;
  useReleasedStage: DataReleaseStatus;
  nextRelease: number;
}) {
  try {
    let content;

    switch (stepCurrent) {
      case STATE_READY_TO_RELEASE:
        content = (
          <span>
            release {useReleasedStage.availableRelease || ''} {BOOT_ICON} right
            now! <br />
          </span>
        );
        break;

      case STATE_NEXT_UNFREEZE:
        content = (
          <span>
            Next release will be available in {nextRelease} new addresses.{' '}
            <br />
            Hire hero and <br />
            get H token for free
          </span>
        );
        break;

      case STATE_PROVE_ADDRESS:
        content = (
          <span>
            You have nothing to release. <br />
            Prove another address <br />
            or claim address with the gift.
          </span>
        );
        break;

      default:
        content = null;
        break;
    }

    if (content) {
      return (
        <InfoCard>
          <div style={{ textAlign: 'center' }}>{content}</div>
        </InfoCard>
      );
    }

    return null;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export default Info;