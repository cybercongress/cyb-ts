import React, { useEffect, useState } from 'react';

import {
  Button,
  Spinner,
  Divider,
  ButtonGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import { Cell, Column, Table2 } from '@blueprintjs/table';

import cozoDb, {
  DBResult,
  DBResultWithColIndex,
} from 'src/services/CozoDb/cozoDb';
import { useIpfs } from 'src/contexts/ipfs';
// import Button from 'src/components/btnGrd';
import { Pane, Text } from '@cybercongress/gravity';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { getResponseAsTextPreview } from 'src/utils/ipfs/stream-utils';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import { IPFSContent } from 'src/utils/ipfs/ipfs';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/table/lib/css/table.css';

import styles from './drive.scss';

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

// const  displayValue(v) {
//   if (typeof v === 'string') {
//     return v;
//   }
//   return <span style={{ color: '#184A90' }}>{JSON.stringify(v)}</span>;
// }

const PinTypeEnum = {
  indirect: -1,
  direct: 0,
  recursive: 1,
};

function Drive() {
  const { node } = useIpfs();
  const [queryText, setQueryText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [importInProgress, setImportInProgress] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [queryResults, setQueryResults] = useState<DBResult | undefined>();
  const [logMessages, setLogMessages] = useState<string[]>([]);

  useEffect(() => {
    cozoDb.init().then(() => {
      setIsLoaded(true);
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
        setTimeout(() => {
          try {
            const t0 = performance.now();
            const result = cozoDb.runCommand(query);
            const t1 = performance.now();

            if (result.ok) {
              setStatusMessage(
                `finished with ${result.rows.length} rows in ${diffMs(t0, t1)}`
              );
              if (!result.headers) {
                result.headers =
                  result.rows[0].map((_, i) => i.toString()) || [];
              }
              setQueryResults(result);
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

  const appendLog = (messages: string[]) => {
    setLogMessages((prev) => [...prev, ...messages]);
  };
  const updateLastLog = (message: string) => {
    setLogMessages((prev) => [...prev.slice(0, prev.length - 1), message]);
  };

  const importIpfs = async () => {
    if (!node) {
      setLogMessages(['Ipfs node is not available...']);
      return;
    }
    setImportInProgress(true);
    try {
      const t0 = performance.now();
      let t1 = performance.now();
      setLogMessages(['Loading pins...', '']);

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

      const pinsResult = cozoDb.executeGetCommand('pin', [
        `type = ${PinTypeEnum.recursive}`,
      ]) as DBResultWithColIndex;
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
        .map(async (content) => {
          const { cid, result, meta } = content as IPFSContent;
          const { size, mime, type, blocks, sizeLocal } = meta;
          const isText = mime && mime.indexOf('text/plain') > -1;

          const text = isText
            ? uint8ArrayToAsciiString(await getResponseAsTextPreview(result))
                .replace(/"/g, '%20')
                .slice(0, 150)
            : '';

          return {
            cid,
            size,
            mime: mime || 'unknown',
            type,
            text,
            sizeLocal,
            blocks: blocks || 0,
          };
        });

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
    } finally {
      setImportInProgress(false);
    }
  };

  const runExampleScript = async (name: 'sort' | 'filter' | 'stats') => {
    let cmd = '';
    const baseCmd =
      '?[cid, mime, text, blocks, size, sizeLocal, type] := *particle{cid, mime, text, blocks, size, sizeLocal, type}';
    switch (name) {
      case 'sort':
        cmd = `${baseCmd}\r\n :order -size`;
        break;
      case 'filter':
        cmd = `${baseCmd}, mime="text/plain"`;
        break;
      case 'stats':
        cmd = `?[mime, sum(size), count(mime), sum(blocks)] := *particle{mime, blocks, size}\r\n :order -sum(size)\r\n:limit 10`;
        break;
      default:
        cmd = baseCmd;
    }
    setQueryText(cmd);
    runQuery(cmd);
  };

  const renderCell = (colIdx: number) => (rowIdx: number) =>
    <Cell>{queryResults.rows[rowIdx][colIdx]}</Cell>;
  console.log('log---queryResults', queryResults, queryResults?.rows.length);
  return (
    <div>
      <Pane width="100%" marginBottom={20} padding={10}>
        {importInProgress && <Spinner size={50} />}
        {!importInProgress && (
          <Button
            icon="refresh"
            fill
            active
            large
            disabled={!isLoaded || !node}
            onClick={importIpfs}
            text="Sync with Ipfs Node"
            intent={Intent.WARNING}
          />
        )}
        {logMessages.length > 0 && (
          <div>
            <Text color="#fff" fontSize="20px" lineHeight="30px">
              Importing from IPFS:
            </Text>
            {logMessages.map((m, i) => (
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
        <ButtonGroup>
          <Button
            icon="play"
            text={
              isLoaded
                ? inProgress
                  ? 'Query is running'
                  : 'Run script'
                : 'Loading WASM ...'
            }
            onClick={() => runQuery()}
            disabled={!isLoaded || inProgress}
            intent={Intent.PRIMARY}
          />
          <Divider />
          <div className={styles.centered}>Particle query examples:</div>
          <Button
            icon="sort"
            text="order"
            intent={Intent.SUCCESS}
            onClick={() => runExampleScript('sort')}
          />
          <Divider />
          <Button
            icon="filter"
            text="filter"
            intent={Intent.SUCCESS}
            onClick={() => runExampleScript('filter')}
          />
          <Divider />
          <Button
            icon="search-template"
            text="Top 10"
            intent={Intent.SUCCESS}
            onClick={() => runExampleScript('stats')}
          />
        </ButtonGroup>
      </Pane>
      {statusMessage && (
        <Pane width="100%" marginTop={10}>
          <div className={styles.statusMessage}>{statusMessage}</div>
        </Pane>
      )}

      <Pane width="100%" marginTop={10}>
        {queryResults ? (
          queryResults.rows && queryResults.headers ? (
            <div style={{ height: '600px' }}>
              <Table2
                cellRendererDependencies={queryResults.rows}
                numRows={queryResults.rows.length}
              >
                {queryResults.headers.map((n, idx) => (
                  <Column name={n} key={idx} cellRenderer={renderCell(idx)} />
                ))}
              </Table2>
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
