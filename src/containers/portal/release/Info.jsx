import { InfoCard } from '../components';
import STEP_INFO from './utils';

const {
  STATE_BEFORE_ACTIVATION,
  STATE_READY_TO_RELEASE,
  STATE_NEXT_UNFREEZE,
  STATE_PROVE_ADDRESS,
  STATE_INIT_NULL_ACTIVE,
  STATE_INIT_NULL_BEFORE,
} = STEP_INFO;

function Info({ stepCurrent, citizensTargetClaim = 0 }) {
  try {
    let content;

    switch (stepCurrent) {
      case STATE_INIT_NULL_ACTIVE:
        content = (
          <span>
            Gift started to release <br /> Get your citizenship and check gift
          </span>
        );
        break;

      case STATE_INIT_NULL_BEFORE:
        content = (
          <span>
            Gift will start to release <br /> after {citizensTargetClaim}{' '}
            addresses. <br /> Invite friends to make it faster
          </span>
        );
        break;

      case STATE_BEFORE_ACTIVATION:
        content = (
          <span>
            Gift will start to release <br />
            after {citizensTargetClaim} addresses. <br />
            Invite friends to make it faster
          </span>
        );
        break;

      case STATE_READY_TO_RELEASE:
        content = (
          <span>
            10% of your BOOT is liquid. <br />
            1% become liquid every new day. <br /> Start your day releasing BOOT
            gift
          </span>
        );
        break;

      case STATE_NEXT_UNFREEZE:
        content = (
          <span>
            Release 1% tomorrow. <br />
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

    return (
      <InfoCard>
        <div style={{ textAlign: 'center' }}>{content !== null && content}</div>
      </InfoCard>
    );
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export default Info;
