import React from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { Colors } from 'src/components/containerGradient/types';

import Display from 'src/components/containerGradient/Display/Display';
// import { ServiceStatus, SyncEntryStatus } from 'src/services/backend/types';
import {
  ProgressTracking,
  ServiceStatus,
  SyncEntryName,
  SyncProgress,
} from 'src/services/backend/types/services';
import { convertTimestampToString } from 'src/utils/date';

import styles from './drive.scss';
import { syncEntryNameToReadable } from 'src/services/backend/services/sync/utils';
import { Button } from 'src/components';
import { downloadJson } from 'src/utils/json';

const getProgressTrackingInfo = (progress?: ProgressTracking) => {
  if (!progress) {
    return '';
  }
  const { totalCount, completeCount, estimatedTime } = progress;
  const estimatedTimeStr =
    estimatedTime > -1 ? convertTimestampToString(estimatedTime) : '???';
  return ` ${Math.round(
    (completeCount / totalCount) * 100
  )}% (${estimatedTimeStr})`;
};

function ServiceStatus({
  name,
  status,
  message,
}: {
  name: string;
  status: ServiceStatus;
  message?: string;
}) {
  const icon = status === 'error' ? '❌' : status === 'starting' ? '⏳' : '';
  const msg = message ? ` ${message}` : '';
  return <div>{`${icon} ${name} ${status} ${msg}`}</div>;
}

function EntrySatus({
  name,
  progress,
}: {
  name: SyncEntryName;
  progress: SyncProgress;
}) {
  const msg = progress.error || progress.message ? `- ${progress.message}` : '';
  const text = `${syncEntryNameToReadable(name)}: ${progress.status} ${msg}
  ${getProgressTrackingInfo(progress.progress)}`;
  return <div className={styles.tabbed}>{text}</div>;
}

function BackendStatus() {
  const { syncState, dbPendingWrites, services } = useAppSelector(
    (store) => store.backend
  );

  const downloadLogsOnClick = () => {
    const logs = cyblog.getLogs();
    downloadJson(logs, `cyblog_${new Date().toISOString()}.json`);
  };

  return (
    <Display color={Colors.GREEN}>
      <div className={styles.list}>
        <h3>Backend status</h3>
        <ServiceStatus
          name="db"
          status={services.db.status}
          message={services.db.error || `(queries: ${dbPendingWrites})`}
        />
        <ServiceStatus
          name="ipfs"
          status={services.ipfs.status}
          message={services.ipfs.error || services.ipfs.message}
        />
        <ServiceStatus
          name="sync"
          status={services.sync.status}
          message={services.sync.error || services.sync.message}
        />
        {Object.keys(syncState.entryStatus).map((name) => (
          <EntrySatus
            key={`log_${name}`}
            name={name}
            progress={syncState.entryStatus[name]}
          />
        ))}
        <div className={styles.buttonPanel}>
          <Button small onClick={downloadLogsOnClick}>
            🐞 download logs
          </Button>
        </div>
      </div>
    </Display>
  );
}

export default BackendStatus;
