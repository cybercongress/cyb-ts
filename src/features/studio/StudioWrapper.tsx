import { MilkdownProvider } from '@milkdown/react';
import StudioContextProvider from './studio.context';
import Studio from './Studio';

function StudioWrapper() {
  return (
    <StudioContextProvider>
      <MilkdownProvider>
        <Studio />
      </MilkdownProvider>
    </StudioContextProvider>
  );
}

export default StudioWrapper;
