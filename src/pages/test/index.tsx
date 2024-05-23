import { useEffect, useState } from 'react';
import { Display, Input } from 'src/components';
import { useSigningClient } from 'src/contexts/signerClient';
import { initOfflineSigner } from 'src/utils/offlineSigner';

export default function Test() {
  const { signer } = useSigningClient();
  const [value, setValue] = useState('');

  useEffect(() => {
    window['signer'] = signer;
    initOfflineSigner().then((offlineSigner) => {
      window['offlineSigner'] = offlineSigner;
    });
  }, [signer]);

  return (
    <Display title={<div>Connect your existing account</div>}>
      <Input
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          console.log('Changed', val);
          setValue(val);
        }}
      />
    </Display>
  );
}
