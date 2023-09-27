import React, { useEffect, useState } from 'react';

import Table from 'src/components/Table/Table';

import { toListOfObjects } from 'src/services/CozoDb/utils';
import { saveAs } from 'file-saver';

import { useIpfs } from 'src/contexts/ipfs';
import { Pane, Text } from '@cybercongress/gravity';
import { Button as CybButton, Loading, Select } from 'src/components';
import FileInputButton from './FileInputButton';
import { useAppSelector } from 'src/redux/hooks';

import { useBackend } from 'src/contexts/backend';
import {
  SyncEntry,
  SyncProgress,
  WorkerState,
} from 'src/services/backend/types';

import styles from './drive.scss';

import cozoPresets from './cozo_presets.json';

const DEFAULT_PRESET_NAME = '💡 defaul commands...';

const presetsAsSelectOptions = [
  { text: DEFAULT_PRESET_NAME, value: '' },
  ...Object.entries(cozoPresets).map(([key, value]) => ({
    text: key,
    value: Array.isArray(value) ? value.join('\r\n') : value,
  })),
];

const diffMs = (t0: number, t1: number) => `${(t1 - t0).toFixed(1)}ms`;

function SyncEntryStatus({
  entry,
  status,
}: {
  entry: SyncEntry;
  status: SyncProgress;
}) {
  if (status.progress == 0) {
    return <div>{`▫️ ${entry} items pending...`}</div>;
  }
  if (status.done) {
    return <div>{`☑️ ${entry} items synchronized.`}</div>;
  }
  if (status.error) {
    return (
      <div>{`❌ ${entry} items syncronization failed - ${status.error}`}</div>
    );
  }
  return <div>{`⏳ ${entry} ${status.progress} items syncronized...`}</div>;
}
function SyncInfo({ syncState }: { syncState: WorkerState }) {
  return (
    <div>
      <Loading />
      <div className={styles.logs}>
        <div>Sync DB in progress...</div>
        {Object.keys(syncState.entryStatus).map((name) => (
          <SyncEntryStatus
            key={`log_${name}`}
            entry={name}
            status={syncState.entryStatus[name]}
          />
        ))}
      </div>
    </div>
  );
}

function Drive() {
  const { node } = useIpfs();
  const [queryText, setQueryText] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [queryResults, setQueryResults] = useState<{ rows: []; cols: [] }>();
  const { startSyncTask, dbApi } = useBackend();
  const { syncState, dbPendingWrites } = useAppSelector(
    (store) => store.backend
  );

  console.log('-----syncStatus', syncState, dbPendingWrites);

  function runQuery(queryArg?: string) {
    const query = queryArg || queryText.trim();
    if (query) {
      setInProgress(true);
      setErrorMessage('');
      setStatusMessage('');
      setQueryResults(undefined);
      requestAnimationFrame(() => {
        setTimeout(async () => {
          try {
            const t0 = performance.now();
            const result = await dbApi!.runCommand(query);
            const t1 = performance.now();

            if (result.ok === true) {
              setStatusMessage(
                `finished with ${result.rows.length} rows in ${diffMs(t0, t1)}`
              );
              if (!result.headers) {
                result.headers =
                  result.rows[0].map((_, i) => i.toString()) || [];
              }
              const rows = toListOfObjects(result);
              const cols = result.headers.map((n) => ({
                // header: n,
                accessorKey: n,
                header: () => n,
                cell: (item) => {
                  const value = item.getValue();
                  if (['cid'].indexOf(n) > -1) {
                    return (
                      <a
                        href={`/ipfs/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${value.slice(0, 10)}...${value.slice(-10)}`}
                      </a>
                    );
                  }

                  return value;
                },
              }));

              // parse object-type values to string to be able to display them in the table
              const rowsNormalized = rows.map((row) => {
                const updatedRow = {};

                for (const [key, value] of Object.entries(row)) {
                  if (typeof value === 'object') {
                    updatedRow[key] = JSON.stringify(value);
                  } else {
                    updatedRow[key] = value;
                  }
                }
                return updatedRow;
              });

              setQueryResults({ rows: rowsNormalized, cols });
            } else {
              console.error('Query failed', result);
              setStatusMessage(`finished with errors`);
              if (result.display) {
                setErrorMessage(result.display);
              }
            }
          } catch (e) {
            setStatusMessage(`query failed`);
            setErrorMessage(e.message);
            console.log(e);
          } finally {
            setInProgress(false);
          }
        }, 0);
      });
    }
  }

  const importIpfs = async () => startSyncTask!();

  const exportReations = async () => {
    const result = await dbApi!.exportRelations(['pin', 'particle', 'link']);
    console.log('---export data', result);
    if (result.ok) {
      const blob = new Blob([JSON.stringify(result.data)], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'export.json');
    } else {
      console.log('CozoDb: Failed to import', result);
    }
  };

  const importReations = async (file: any) => {
    const content = await file.text();

    const res = await dbApi!.importRelations(content);
    console.log('----import result', res);
  };

  const runExampleScript = async (value: string) => {
    setQueryText(value);
    runQuery(value);
  };

  return (
    <div className={styles.main}>
      <Pane
        width="100%"
        display="flex"
        marginBottom={20}
        padding={10}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        {syncState?.status && (
          <Text color="#fff" fontSize="20px" lineHeight="30px" padding="10px">
            Drive sync status - {syncState?.status}{' '}
            {syncState.lastError && `(${syncState.lastError})`}
          </Text>
        )}
        {syncState?.status === 'syncing' && <SyncInfo syncState={syncState} />}
        {(syncState?.status === 'idle' || syncState?.status === 'error') && (
          <CybButton disabled={!isLoaded || !node} onClick={importIpfs}>
            sync drive
          </CybButton>
        )}
        {/* {logs.length > 0 && (
          <div className={styles.logs}>
            {Object.keys(syncStatus?.logs).map((m, i) => <div key={`ipfs_log_${i}`}>{m}</div>)
            <Text color="#fff" fontSize="20px" lineHeight="30px">
              Importing from IPFS:
            </Text>
            {logs.map((m, i) => (
              <div key={`ipfs_log_${i}`}>{m}</div>
            ))}
          </div>
        )} */}
      </Pane>

      <Pane width="100%">
        <textarea
          placeholder="Enter your query here..."
          onChange={(e) => setQueryText(e.target.value)}
          value={queryText}
          className="resize-none"
          rows={10}
        />
        <div className={styles.commandPanel}>
          <div className={styles.subPanel}>
            <CybButton
              disabled={!isLoaded || inProgress}
              onClick={() => runQuery()}
              small
            >
              {isLoaded
                ? inProgress
                  ? 'Query is running'
                  : '🟧 Run script'
                : 'Loading WASM ...'}
            </CybButton>
            <Select
              width="250px"
              valueSelect=""
              small
              // textSelectValue="select preset..."
              onChangeSelect={runExampleScript}
              options={presetsAsSelectOptions}
              // disabled={pending}
            />
          </div>
          <div className={styles.subPanel}>
            <CybButton
              disabled={!isLoaded || !node}
              onClick={exportReations}
              small
            >
              export
            </CybButton>
            <FileInputButton caption="import" processFile={importReations} />
          </div>
        </div>
      </Pane>
      {statusMessage && (
        <Pane width="100%" marginTop={10}>
          <div className={styles.statusMessage}>{statusMessage}</div>
        </Pane>
      )}
      <Pane width="100%" marginTop={10} overflowX="scroll">
        {queryResults ? (
          queryResults.cols.length > 0 ? (
            <div className="bp5-dark">
              <Table columns={queryResults.cols} data={queryResults.rows} />
            </div>
          ) : null
        ) : (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </Pane>
    </div>
  );
}

export default Drive;
