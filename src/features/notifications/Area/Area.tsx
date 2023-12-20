import React, { useEffect } from 'react';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './Area.module.scss';
import { useBackend } from 'src/contexts/backend';
import { Account } from 'src/components';

type Props = {
  selected: string | undefined;
};

function Area({ selected }: Props) {
  const { senseApi } = useBackend();

  useEffect(() => {
    if (!senseApi || !selected) {
      return;
    }

    (async () => {
      try {
        const data = await senseApi?.getList();
        console.log('----data', data);
      } catch (error) {
        console.error('----error', error);
      }
    })();

    (async () => {
      try {
        return;
        const data = await senseApi?.markAsRead(selected);
        console.log('----data', data);
        debugger;
      } catch (error) {
        console.error('----error', error);
      }
    })();
  }, [senseApi]);

  return (
    <div className={styles.wrapper}>
      <Display
        title={
          selected && (
            <DisplayTitle
              title={<Account address={selected} avatar />}
            ></DisplayTitle>
          )
        }
      >
        <div className={styles.content}>
          {selected ? (
            <div>{selected}</div>
          ) : (
            <p>
              post to your log, <br />
              or select chat to start messaging
            </p>
          )}
        </div>
      </Display>
    </div>
  );
}

export default Area;
