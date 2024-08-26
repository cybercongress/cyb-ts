import StudioContextProvider from './studio.context';
import Studio from './Studio';

function StudioWrapper() {
  return (
    <StudioContextProvider>
      <Studio />
    </StudioContextProvider>
  );
}

export default StudioWrapper;
