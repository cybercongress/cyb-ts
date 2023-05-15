import { InfoCard } from '../components';
import STEP_INFO from './utils';

const {
  STATE_INIT,
  STATE_INIT_NULL,
  STATE_INIT_PROVE,
  STATE_INIT_CLAIM,
  STATE_INIT_RELEASE,
  STATE_PROVE,
  STATE_PROVE_CONNECT,
  STATE_PROVE_SIGN_MM,
  STATE_PROVE_SIGN_KEPLR,
  STATE_PROVE_SEND_SIGN,
  STATE_PROVE_CHANGE_ACCOUNT,
  STATE_PROVE_YOU_ADDED_ADDR,
  STATE_CLAIME_TO_PROVE,
  STATE_GIFT_NULL_ALL,
  STATE_CLAIME,
  STATE_CLAIME_ALL,
  STATE_RELEASE,
  STATE_CLAIM_IN_PROCESS,
  STATE_PROVE_IN_PROCESS,
} = STEP_INFO;

function Info({ stepCurrent, selectedAddress, amountClaims }) {
  try {
    let content;

    switch (stepCurrent) {
      case STATE_INIT_NULL:
        content = (
          <span>
            Check gift & basic information. <br />
            Hurry up! Get your citizenship to be able to claim.
          </span>
        );
        break;

      case STATE_INIT:
      case STATE_INIT_PROVE:
        content = (
          <span>
            Check gift & basic information. <br />
            Hurry up! Prove an address to claim the gift.
          </span>
        );
        break;

      case STATE_INIT_CLAIM:
        content = (
          <span>
            You have unclaimed gifts - <br />
            go to claim
          </span>
        );
        break;

      case STATE_INIT_RELEASE:
        content = (
          <span>
            You have claimed all gifts. <br />
            Go to release or prove another address.
          </span>
        );
        break;

      case STATE_PROVE:
        content = (
          <span>
            Prove ethereum, cosmos, osmosis, <br /> terra signatures by
            selecting signer to check for the gift
          </span>
        );
        break;

      case STATE_PROVE_CONNECT:
        content = <span>Select signer</span>;
        break;

      case STATE_PROVE_SIGN_MM:
        content = <span>Sign message in metamask</span>;
        break;

      case STATE_PROVE_SIGN_KEPLR:
        content = <span>sign message in keplr</span>;
        break;

      case STATE_PROVE_SEND_SIGN:
        content = <span>send your signature</span>;
        break;

      case STATE_PROVE_CHANGE_ACCOUNT:
        content = <span> you need change account in keplr</span>;
        break;

      case STATE_PROVE_YOU_ADDED_ADDR:
        content = (
          <span>
            you have already added this address. Сhoose another address
          </span>
        );
        break;

      case STATE_CLAIME_TO_PROVE:
        content = (
          <span>
            {/* Address{' '}
          {address !== '' && (
            <span style={{ color: '#38d6ae' }}>{address}</span>
          )}{' '}
          has no gift <br />
          Prove another address to try your luck */}
            You did not work hard to get gift. No wories ! You have a
            citizenship, just go and buy BOOT
          </span>
        );
        break;

      case STATE_GIFT_NULL_ALL:
        content = (
          <span>
            You have nothing to claim. Prove another address for the gift.
          </span>
        );
        break;

      case STATE_CLAIME:
        content = (
          <span>
            You have unclaimed gifts. <br />
            Claim now, or prove another address.
          </span>
        );
        break;

      case STATE_CLAIME_ALL:
        content = (
          <span>
            Chose bostrom address <br />
            to claim all gifts, or claim one by one
          </span>
        );
        break;

      case STATE_RELEASE:
        content = (
          <span>
            You claimed all gifts. <br />
            Go to release or prove another address.
          </span>
        );
        break;

      case STATE_PROVE_IN_PROCESS:
        content = <span>prove address take time</span>;
        break;

      case STATE_CLAIM_IN_PROCESS:
        content = <span>claim take time</span>;
        break;

      default:
        content = null;
        break;
    }

    return (
      <InfoCard style={{ minHeight: '90px' }}>
        <div style={{ textAlign: 'center' }}>
          {content && content !== null && content}
        </div>
      </InfoCard>
    );
  } catch (error) {
    console.log('error', error);
    return null;
  }
}

export default Info;
