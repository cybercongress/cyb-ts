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
              <td>{item.sourceChainId}</td>
                <td>{item.destinationChainId}</td>
                <td>{item.sourceChannelId}</td>
                <td>{item.destChannelId}</td>
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