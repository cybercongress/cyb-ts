import { useState, useEffect } from 'react';
import { Pane } from '@cybercongress/gravity';
import { keybaseCheck } from '../../utils/search/utils';
import { LinkWindow, Dots } from '../../components';

const success = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const warning = require('../../image/ionicons_svg_ios-warning.svg');

function Img({ img }) {
  return (
    <img
      src={img}
      alt="img-verified"
      style={{
        width: 20,
        height: 20,
      }}
    />
  );
}

function KeybaseCheck({ identity }) {
  const [verified, setVerified] = useState(false);
  const [keybaseUrl, setKeybaseUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    keybaseCheck(identity).then((data) => {
      if (data.status.code > 0) {
        setVerified(false);
        setLoading(false);
      } else {
        setVerified(true);
        setLoading(false);
        if (data.them.length > 0) {
          setKeybaseUrl(`https://keybase.io/${data.them[0].basics.username}`);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Dots />;
  }

  if (verified) {
    return (
      <Pane display="flex" alignItems="center">
        <LinkWindow to={keybaseUrl}>{identity}</LinkWindow>{' '}
        <Img img={success} />
      </Pane>
    );
  }
  return (
    <Pane display="flex" alignItems="center">
      {identity} <Img img={warning} />
    </Pane>
  );
}

export default KeybaseCheck;
