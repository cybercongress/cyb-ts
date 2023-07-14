import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pane, TableEv as Table, Text, Tablist } from '@cybercongress/gravity';
import { Button, Input, ContainerGradientText, TabBtn } from 'src/components';
import { v4 as uuidv4 } from 'uuid';
import { ObjKeyValue } from 'src/types/data';
// import { ObjKeyValue, TableControlProps } from './TableControl.d';

import styles from './EditableTable.module.scss';

type TableControlProps = {
  data: { [key: string]: ObjKeyValue };
  columns: string[];
  onSave: (data: { [key: string]: ObjKeyValue }) => void;
};

const actionColumnProps = {
  flexBasis: 30,
  flexShrink: 0,
  flexGrow: 0,
  justifyContent: 'left',
  paddingLeft: 0,
  paddingRight: 0,
};

function EditableTable({ data, columns, onSave }: TableControlProps) {
  const [items, setItems] = useState<{ [key: string]: ObjKeyValue }>({
    ...data,
  });
  const [isChanged, setIsChanged] = useState(false);

  const itemsCount = useMemo(() => Object.keys(items).length, [items]);
  const lastItemUUID = useMemo(
    () => Object.keys(items).slice(-1)?.[0],
    [items]
  );

  useEffect(() => {
    if (itemsCount === 0) {
      addItem();
    } else {
      if (lastItemUUID) {
        const lastValues = Object.values(items[lastItemUUID]);
        const lastIsEdited = lastValues.some((v) => v !== '');
        if (lastIsEdited) {
          addItem();
        }
      }
    }
  }, [items, lastItemUUID]);

  const changeItem = (key: string, name: string, value: string) => {
    const newItems = { ...items };

    if (!newItems[key]) {
      newItems[key] = {};
    }

    newItems[key][name] = value;

    if (Object.values(newItems[key]).every((v) => v === '')) {
      delete newItems[key];
    }
    console.log('----changeItem', key, newItems);
    setItems(newItems);
    setIsChanged(true);
  };

  const removeItem = (key: string) => {
    const newItems = { ...items };
    delete newItems[key];
    console.log('---removeItem', key, newItems);
    setItems(newItems);
    setIsChanged(true);
  };

  const addItem = () => {
    const newItems = { ...items };
    newItems[uuidv4()] = {};
    setItems(newItems);
  };

  const save = () => {
    onSave(items);
    setIsChanged(false);
  };

  const renderRow = (key: string, item: ObjKeyValue) => {
    return (
      <Table.Row borderBottom="none" padding="15px 0">
        {Array.from(columns).map((title: string, index: number) => (
          <Table.TextCell textAlign="center" key={`row_${key}_${index}`}>
            <Text fontSize="16px" color="#fff">
              <Input
                placeholder=""
                onChange={(e) => changeItem(key, title, e.target.value)}
                value={item[title]}
              />
            </Text>
          </Table.TextCell>
        ))}
        <Table.TextCell textAlign="center" {...actionColumnProps}>
          {key !== lastItemUUID && (
            <button
              type="button"
              className={styles.icoBtn}
              onClick={() => removeItem(key)}
            >
              ❌
            </button>
          )}
        </Table.TextCell>
      </Table.Row>
    );
  };

  return (
    <div>
      <Table>
        <Table.Head className={styles.head}>
          {Array.from(columns).map((title: string, index: number) => (
            <Table.TextHeaderCell textAlign="center" key={`head_col_${index}`}>
              <Text>{title}</Text>
            </Table.TextHeaderCell>
          ))}
          <Table.TextHeaderCell {...actionColumnProps} />
        </Table.Head>
        <Table.Body overflowY="none">
          {Object.entries(items).map(([key, item]) => renderRow(key, item))}
        </Table.Body>
      </Table>
      <Pane
        paddingTop={25}
        paddingBottom={25}
        display="flex"
        justifyContent="space-between"
      >
        <button type="button" className={styles.textBtn} onClick={addItem}>
          + row
        </button>
        {isChanged && <Button onClick={save}>save</Button>}
      </Pane>
    </div>
  );
}

export default EditableTable;
