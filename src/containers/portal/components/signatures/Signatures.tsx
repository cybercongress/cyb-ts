import { useMemo, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Signatures.module.scss';
import {
  DICTIONARY_ABC,
  getHeight,
  getNoteFromAdd,
  makeSound,
  cutAddress,
} from './utils';
import { Link } from 'react-router-dom';

const classNames = require('classnames');

type Props = {
  addressActive: { bech32: string };
  disabled?: boolean;
};

function Signatures({ addressActive, disabled }: Props) {
  const [playing, setPlaying] = useState(true);

  const bech32 = addressActive?.bech32;

  const address = useMemo(() => {
    return cutAddress(bech32);
  }, [bech32]);

  const useGetItems = useMemo(() => {
    const items = [];

    if (address !== null) {
      const { address: sliceAddress } = address;
      const arrayAddress = sliceAddress.split('');
      const bufferAddress = Buffer.from(sliceAddress)
        .toString('hex')
        .replace(/[a-z]/g, '')
        .split('');
      arrayAddress.forEach((item, index) => {
        items.push({
          color: DICTIONARY_ABC[item].color,
          code: bufferAddress[index] || 2,
        });
      });
    }

    return items;
  }, [address]);

  const copyAddress = useCallback(() => {
    if (addressActive !== null) {
      const { bech32 } = addressActive;
      navigator.clipboard.writeText(bech32);
    }
  }, [addressActive]);

  const onClickMusicalAddress = useCallback(() => {
    if (!playing) {
      return;
    }

    if (address !== null) {
      copyAddress();
      const { address: sliceAddress } = address;
      const arrNote = getNoteFromAdd(sliceAddress);
      setPlaying(false);
      makeSound(arrNote);
      setTimeout(() => {
        setPlaying(true);
      }, 7000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, playing]);

  function renderAddressPart(text: string) {
    if (disabled) {
      return text;
    }

    return <Link to={`/neuron/${addressActive.bech32}`}>{text}</Link>;
  }

  return (
    <div
      className={classNames(styles.containerSignaturesBtnPlay, {
        [styles.disabled]: disabled,
      })}
    >
      <div
        className={classNames(styles.containerSignatures, {
          [styles.containerSignaturesPlaying]: !playing,
        })}
      >
        {address && renderAddressPart(address.prefix)}

        <button
          className={styles.music}
          onClick={onClickMusicalAddress}
          type="button"
        >
          {useGetItems.map((item) => {
            const key = uuidv4();
            return (
              <div
                key={key}
                className={styles.containerSignaturesItemNote}
                style={{
                  background: item.color,
                  color: item.color,
                  height: `${getHeight(item.code)}px`,
                }}
              />
            );
          })}
        </button>

        {address && renderAddressPart(address.end)}
      </div>
    </div>
  );
}

export default Signatures;
