import React, { useEffect, useState } from 'react';

import {
  Button,
  Spinner,
  Divider,
  ButtonGroup,
  Intent,
} from '@blueprintjs/core';
import { Cell, Column, Table2 } from '@blueprintjs/table';

import { IDBResult, PinTypeEnum } from 'src/services/CozoDb/cozoDb.d';
import { withColIndex } from 'src/services/CozoDb/utils';
import cozoDb from 'src/services/CozoDb/db.service';
import useLog from 'src/hooks/useLog';

import { useIpfs } from 'src/contexts/ipfs';
// import Button from 'src/components/btnGrd';
import { Pane, Text } from '@cybercongress/gravity';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { IPFSContent } from 'src/utils/ipfs/ipfs';
import { mapParticleToCozoEntity } from 'src/services/CozoDb/dto';

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
  const [queryResults, setQueryResults] = useState<IDBResult | undefined>();
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

  const runExampleScript = async (
    name:
      | 'sort_particle'
      | 'filter_particle'
      | 'stats_particle'
      | 'pin_stats'
      | 'link_stats'
      | 'link_text'
  ) => {
    let cmd = '';
    const baseCmdParticle =
      '?[cid, mime, text, blocks, size, sizeLocal, type] := *particle{cid, mime, text, blocks, size, sizeLocal, type}';
    switch (name) {
      case 'pin_stats':
        cmd = `?[type_as_str, count(cid)] := *pin{cid, type}, type_as_str = get(list('indirect','direct','recursive'),type+1)`;
        break;
      case 'sort_particle':
        cmd = `r[cid,  pin] := *particle{cid}, not *pin{cid: cid, type}, pin=0
        r[cid, pin] := *particle{cid}, *pin{cid: cid, type}, pin=1
        ?[pinned, cid, mime, text, size] := r[cid, pinned], *particle{cid:cid, mime, text, size}
        :order -size`;
        break;
      case 'filter_particle':
        cmd = `?[cid, mime, text, blocks, size, sizeLocal, type] := *particle{cid, mime, text, blocks, size, sizeLocal, type}, mime="text/plain"`;
        break;
      case 'stats_particle':
        cmd = `?[mime, sum(size), count(mime), sum(blocks)] := *particle{mime, blocks, size}\r\n :order -sum(size)\r\n:limit 10`;
        break;
      case 'link_stats':
        cmd = `r[from, count(to), side] := *link{from, to}, side="from"
        r[to, count(from), side] := *link{from, to}, side="to"
        ?[side, lnk, cnt] := r[lnk, cnt, side]
        :order -cnt`;
        break;
      case 'link_text':
        cmd = `rt[text, from] := *link{from, to}, *particle{cid: from, text}
        rf[text, to] := *link{from, to}, *particle{cid: to, text}
        ?[text_from, text_to]  := rt[text_from, from] , rf[text_to, to], text_from != '', text_to != ''`;
        break;
      default:
        cmd = baseCmdParticle;
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
        </ButtonGroup>
      </Pane>
      <Pane marginTop={10} marginBottom={20}>
        <Text color="#fff">
          Query Examples. Click on the button to run the script:
        </Text>
        <Pane marginTop={10}>
          <ButtonGroup>
            <div className={styles.centered}>Pin:</div>
            <Button
              icon="pin"
              text="Stats"
              intent={Intent.WARNING}
              onClick={() => runExampleScript('pin_stats')}
            />
            <div className={styles.centered}>Particle:</div>
            <Button
              icon="sort"
              text="list with pin"
              intent={Intent.SUCCESS}
              onClick={() => runExampleScript('sort_particle')}
            />
            <Divider />
            <Button
              icon="filter"
              text="filter"
              intent={Intent.SUCCESS}
              onClick={() => runExampleScript('filter_particle')}
            />
            <Divider />
            <Button
              icon="search-template"
              text="Top 10"
              intent={Intent.SUCCESS}
              onClick={() => runExampleScript('stats_particle')}
            />
            <div className={styles.centered}>Links:</div>
            <Button
              icon="exchange"
              text="Stats"
              intent={Intent.NONE}
              onClick={() => runExampleScript('link_stats')}
            />
            <Divider />
            <Button
              icon="comparison"
              text="text links"
              intent={Intent.NONE}
              onClick={() => runExampleScript('link_text')}
            />
            <Divider />
          </ButtonGroup>
        </Pane>
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
