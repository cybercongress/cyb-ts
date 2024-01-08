import { ActionBar } from 'src/components';
import { routes } from 'src/routes';
import { isBostromAddress } from '../utils';
import { log } from 'tone/build/esm/core/util/Debug';

type Props = {
  id: string;
};

function ActionBarWrapper({ id }: Props) {
  if (id && isBostromAddress(id)) {
    return (
      <ActionBar
        button={{
          text: 'Send message',
          link: `${routes.teleport.send.path}?recipient=${id}&token=boot`,
        }}
      />
    );
  }

  return null;
}

export default ActionBarWrapper;
