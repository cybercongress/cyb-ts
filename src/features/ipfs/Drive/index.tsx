import React, { useEffect, useState } from 'react';

import Table from 'src/components/Table/Table';

import { IDBResult, PinTypeEnum } from 'src/services/CozoDb/cozoDb.d';
import { withColIndex } from 'src/services/CozoDb/utils';
import useLog from 'src/hooks/useLog';
import { saveAs } from 'file-saver';
import cozoDb from 'src/services/CozoDb/db.service';

import { useIpfs } from 'src/contexts/ipfs';
// import Button from 'src/components/btnGrd';
import { Pane, Text } from '@cybercongress/gravity';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import { mapParticleToCozoEntity } from 'src/services/CozoDb/dto';
import { Button as CybButton, Loading, Select } from 'src/components';
import FileInputButton from './FileInputButton';

import { toListOfObjects } from 'src/services/CozoDb/utils';

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

async function processByBatches<T, K>(
  items: T[],
  processFn: (arg: T) => Promise<K>,
  batchSize = 10,
  onProgress?: (counter: number) => void
): Promise<K[]> {
  const result = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    // eslint-disable-next-line no-await-in-loop
    const batchResult = await Promise.all(batch.map((item) => processFn(item)));
    result.push(...batchResult);
    onProgress && onProgress(i + batchSize);
  }

  return result;
}

async function processAsyncIterableByBatches<T, K>(
  items: AsyncIterable<T>,
  processFn: (arg: T) => Promise<K>,
  batchSize = 10,
  onProgress?: (counter: number) => void
): Promise<K[]> {
  let batch = [];
  const result = [];
  let counter = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of items) {
    batch.push(item);
    if (batch.length === batchSize) {
      const batchResult = await Promise.all(
        batch.map((item) => processFn(item))
      );
      result.push(...batchResult);
      batch = [];
    }
    counter++;
    onProgress && onProgress(counter);
  }

  // rest of the batch
  const batchResult = await Promise.all(batch.map((item) => processFn(item)));
  result.push(...batchResult);

  return result;
}

function Drive() {
  const { node } = useIpfs();
  const [queryText, setQueryText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [importInProgress, setImportInProgress] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [queryResults, setQueryResults] = useState<{ rows: []; cols: [] }>();
  const [logs, appendLog, updateLastLog, clearLog] = useLog();

  useEffect(() => {
    cozoDb.init().then(() => {
      setIsLoaded(true);
      console.log('------czsd init', cozoDb);
    });
  }, []);

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
            const result = await cozoDb.runCommand(query);
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
                header: n,
                accessorKey: n,
              }));
              setQueryResults({ rows, cols });
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
          } finally {
            setInProgress(false);
          }
        }, 0);
      });
    }
  }

  const importIpfs = async () => {
    if (!node) {
      appendLog('Ipfs node is not available...');
      return;
    }
    setImportInProgress(true);
    try {
      clearLog();

      const t0 = performance.now();
      let t1 = performance.now();
      appendLog(['Loading pins...', '']);

      const pins = await processAsyncIterableByBatches(
        node.pin.ls({ type: 'recursive' }),
        async (pin) => ({
          cid: pin.cid.toString(),
          type: PinTypeEnum[pin.type],
        }),
        100,
        (counter) => updateLastLog(`☑️ Loaded ${counter} pins.`)
      );

      appendLog(['Import pins to db...']);
      await cozoDb.executeBatchPutCommand('pin', pins, 100, (counter) =>
        updateLastLog(`⏳ Imported ${counter}/${pins.length} pins.`)
      );
      updateLastLog(
        `☑️ Imported ${pins.length} pins in ${diffMs(t1, performance.now())}`
      );

      // Can use same pins cids
      const pinsResult = withColIndex(
        await cozoDb.executeGetCommand('pin', [
          `type = ${PinTypeEnum.recursive}`,
        ])
      );
      const { cid: cidIdx } = pinsResult.index;

      const recursivePins = pinsResult.rows.map(
        (row) => row[cidIdx]
      ) as string[];
      t1 = performance.now();
      appendLog([`Loading particles from ipfs...`, '']);

      const contents = await processByBatches(
        recursivePins,
        async (cid: string) => getIPFSContent(node, cid),
        10,
        (counter) => {
          updateLastLog(
            `⏳ Loading ${counter}/ ${recursivePins.length} particles`
          );
        }
      );
      updateLastLog(`☑️ Loaded ${recursivePins.length} particles.`);

      const contentPromises = contents
        .filter((c) => !!c)
        .map(async (content) =>
          mapParticleToCozoEntity(content as IPFSContent)
        );

      const particles = await Promise.all(contentPromises);

      appendLog([`Import ${particles.length} particles to db...`]);
      t1 = performance.now();

      await cozoDb.executeBatchPutCommand(
        'particle',
        particles,
        10,
        (counter) =>
          updateLastLog(`⏳ imported ${counter}/${pins.length} particles.`)
      );
      updateLastLog(
        `☑️ Imported ${pins.length} particles in ${diffMs(
          t1,
          performance.now()
        )}.`
      );
      appendLog(['', `🎉 All done in ${diffMs(t0, performance.now())}`]);
    } catch (e) {
      console.log('import error', e);
      appendLog(e);
    } finally {
      setImportInProgress(false);
    }
  };

  const exportReations = async () => {
    const result = await cozoDb.exportRelations(['pin', 'particle', 'link']);
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
    const res = await cozoDb.importRelations(content);
    console.log('----import result', res);
  };

  const runExampleScript = async (value: string) => {
    console.log('---', value);
    setQueryText(value);
    runQuery(value);
  };

  // const renderColumn = (name: string, colIdx: number) => {
  //   let cellRenderer = null;
  //   if (['cid', 'text'].indexOf(name) > -1) {
  //     cellRenderer = (rowIdx: number) => (
  //       <Cell>
  //         <TruncatedFormat detectTruncation>
  //           {queryResults.rows[rowIdx][colIdx]}
  //         </TruncatedFormat>
  //       </Cell>
  //     );
  //   } else {
  //     cellRenderer = (rowIdx: number) => (
  //       <Cell>{queryResults.rows[rowIdx][colIdx]}</Cell>
  //     );
  //   }

  //   // const headerCellRenderer = (colIdx: number) => (
  //   //   <ColumnHeaderCell>{name}</ColumnHeaderCell>
  //   // );

  //   return (
  //     <Column
  //       name={name}
  //       key={colIdx}
  //       cellRenderer={cellRenderer}
  //       // columnHeaderCellRenderer={headerCellRenderer}
  //     />
  //   );
  // };
  return (
    <div>
      <Pane
        width="100%"
        display="flex"
        marginBottom={20}
        padding={10}
        justifyContent="center"
        alignItems="center"
      >
        {importInProgress && <Loading />}
        {!importInProgress && (
          <CybButton disabled={!isLoaded || !node} onClick={importIpfs}>
            sync drive
          </CybButton>
          // <Button
          //   icon="refresh"
          //   fill
          //   active
          //   large
          //   disabled={!isLoaded || !node}
          //   onClick={importIpfs}
          //   text="Sync with Ipfs Node"
          //   intent={Intent.WARNING}
          // />
        )}
        {logs.length > 0 && (
          <div>
            <Text color="#fff" fontSize="20px" lineHeight="30px">
              Importing from IPFS:
            </Text>
            {logs.map((m, i) => (
              <div key={`ipfs_log_${i}`}>{m}</div>
            ))}
          </div>
        )}
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
              width="180px"
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
      <Pane width="100%" marginTop={10}>
        {queryResults ? (
          queryResults.cols.length > 0 ? (
            <div style={{ height: '600px' }} className="bp5-dark">
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
