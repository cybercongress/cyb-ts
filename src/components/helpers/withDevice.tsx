import { useDevice } from 'src/contexts/device';

function withDevice(Component: React.ComponentType<any>) {
  return function (props: any) {
    const { isMobile: mobile } = useDevice();
    return <Component {...props} mobile={mobile} />;
  };
}

export default withDevice;
