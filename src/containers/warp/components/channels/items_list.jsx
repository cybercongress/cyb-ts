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
        <th scope="col">Token</th>
        <th scope="col">Chain source</th>
        <th scope="col">Chain dest</th>
        <th scope="col">Channel source</th>
        <th scope="col">Channel destination</th>
        <th scope="col" style={{width: '1%'}}></th>
        </tr>
      </thead>
      <tbody>
        {props.items.length > 0 ? (
          props.items.map(item => (
            <tr key={item.id}>
                <td>{item.token}</td>
                <td>{item.source_chain_id}</td>
                <td>{item.destination_chain_id}</td>
                <td>{item.source_channel_id}</td>
                <td>{item.destination_channel_id}</td>
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
            <td colSpan={6}>No items</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ItemsList;