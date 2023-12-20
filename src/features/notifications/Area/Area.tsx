import React, { useEffect } from 'react';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './Area.module.scss';
import { useBackend } from 'src/contexts/backend';
import { Account } from 'src/components';
import { useQuery } from '@tanstack/react-query';

type Props = {
  selected: string | undefined;
};

function Area({ selected }: Props) {
  const { senseApi } = useBackend();

  const getListQuery = useQuery({
    queryKey: ['senseApi', 'getList'],
    queryFn: async () => {
      return senseApi!.getList();
    },
    enabled: !!senseApi,
  });

  const value = getListQuery.data?.find((item) => item.id === selected)?.value;

  //   (async () => {
  //     try {
  //       return;
  //       const data = await senseApi?.markAsRead(selected);
  //       console.log('----data', data);
  //       debugger;
  //     } catch (error) {
  //       console.error('----error', error);
  //     }
  //   })();
  // }, [senseApi]);

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
          {value ? (
            <p>{value}</p>
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
