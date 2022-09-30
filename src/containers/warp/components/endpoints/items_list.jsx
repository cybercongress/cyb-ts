import React from 'react'
import { Pane } from '@cybercongress/gravity';
import styles from '../../warp.scss';

const ItemsList = props => {

  return (
    <table
    style={{
      borderSpacing: '5px 16px',
      borderCollapse: 'separate',
    }}
    className={styles.itemsTable}
  >
      <thead>
        <tr>
        <th scope="col">Network</th>
        <th scope="col">Data-type</th>
        <th scope="col">Protocol</th>
        <th scope="col">Url</th>
        <th scope="col" style={{width: '1%'}}></th>
        </tr>
      </thead>
      <tbody>
        {props.items.length > 0 ? (
          props.items.map(item => (
            <tr key={item.id}>
                <td>{item.chain_id}</td>
              <td>{item.data_type}</td>
              <td>{item.protocol}</td>
              <td>{item.url.slice(-20)}</td>

              <td>
                  <button
                      onClick={() => {
                          props.onEdit(item)
                      }}
                      className="btn"
                  >
                      Edit
                  </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No items</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ItemsList;