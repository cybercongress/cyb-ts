import React, { useEffect, useState } from 'react';

import Table from 'src/components/Table/Table';

import { toListOfObjects } from 'src/services/CozoDb/utils';
import { saveAs } from 'file-saver';

import { Pane, Text } from '@cybercongress/gravity';
import { Button as CybButton, Dots, Loading, Select } from 'src/components';
import FileInputButton from './FileInputButton';
import { useAppSelector } from 'src/redux/hooks';
import Display from 'src/components/containerGradient/Display/Display';

import { useBackend } from 'src/contexts/backend/backend';

import { Link } from 'react-router-dom';
import { Colors } from 'src/components/containerGradient/types';
import classNames from 'classnames';
import BackendStatus from './BackendStatus';
import cozoPresets from './cozo_presets.json';

import styles from './drive.scss';

const DEFAULT_PRESET_NAME = '💡 defaul commands...';

const presetsAsSelectOptions = [
  { text: DEFAULT_PRESET_NAME, value: '' },
  ...Object.entries(cozoPresets).map(([key, value]) => ({
    text: key,
    value: Array.isArray(value) ? value.join('\r\n') : value,
  })),
];

const diffMs = (t0: number, t1: number) => `${(t1 - t0).toFixed(1)}ms`;

function Drive() {
  const [queryText, setQueryText] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [queryResults, setQueryResults] = useState<{ rows: []; cols: [] }>();
  const { cozoDbRemote, isReady } = useBackend();
  const { syncState, dbPendingWrites, services } = useAppSelector(
    (store) => store.backend
  );

  // console.log('-----syncStatus', syncState, dbPendingWrites);

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
            const result = await cozoDbRemote!.runCommand(query);
            const t1 = performance.now();

            try {
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
                  } else if (typeof value === 'boolean') {
                    updatedRow[key] = value.toString();
                  } else {
                    updatedRow[key] = value;
                  }
                }
                return updatedRow;
              });

              setQueryResults({ rows: rowsNormalized, cols });
            } catch (e: DBResultError | any) {
              console.error('Query failed', e);
              setStatusMessage(`finished with errors`);
              if (e.display) {
                setErrorMessage(e.display);
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

  const exportReations = async () => {
    const result = await cozoDbRemote!.exportRelations([
      'pin',
      'particle',
      'link',
    ]);
    console.log('---export data', result);
    try {
      const blob = new Blob([JSON.stringify(result.data)], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'export.json');
    } catch (e) {
      console.log('CozoDb: Failed to import', e);
    }
  };

  const importReations = async (file: any) => {
    const content = await file.text();

    const res = await cozoDbRemote!.importRelations(content);
    console.log('----import result', res);
  };

  const runExampleScript = async (value: string) => {
    setQueryText(value);
    runQuery(value);
  };

  return (
    <>
      <div className={styles.main}>
        <Display color={Colors.ORANGE}>
          <p>
            this is tech preview of cyb brain. it does not adds any new
            functionality across the app, yet
          </p>
          <p>features:</p>
          <div>- log you links while you surf</div>
          <div>- connect external ipfs node for performance</div>
          <div>
            - sync your <Link to="/search/ipfs">ipfs</Link> pins
          </div>
          <div>
            - import your transactions and cybergraph from{' '}
            <Link to="/search/bostrom">bostrom</Link>
          </div>
          <div>
            - query using ai oriented{' '}
            <a href="https://www.cozodb.org/" target="_blank">
              datalog
            </a>
          </div>
          <p>
            link your feedback{' '}
            <Link to="/search/brain%20feedback">brain feedback</Link>
          </p>
        </Display>
        <BackendStatus />

        <Pane width="100%">
          <textarea
            placeholder="Enter your query here..."
            onChange={(e) => setQueryText(e.target.value)}
            value={queryText}
            className="resize-none"
            className={styles.queryInput}
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
                disabled={!isLoaded || !isReady}
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
      </div>
      {queryResults ? (
        queryResults.cols.length > 0 ? (
          <div className={classNames('bp5-dark', styles.results)}>
            <Table columns={queryResults.cols} data={queryResults.rows} />
          </div>
        ) : null
      ) : (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </>
  );
}

export default Drive;
