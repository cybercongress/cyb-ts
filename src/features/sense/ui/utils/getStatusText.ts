import { SenseItem } from '../../redux/sense.redux';

// eslint-disable-next-line import/prefer-default-export
export function getStatusText(status: SenseItem['status']) {
  switch (status) {
    case 'pending':
      return '⏳';

    case 'error':
      return '❌';

    default:
      return null;
  }
}
