import React from 'react'
import { getPin, getPinsCid,getIpfsCidExternalLink } from '../../../../utils/search/utils';
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
        <th scope="col">Type</th>
        <th scope="col" style={{width: '1%'}}></th>
        </tr>
      </thead>
      <tbody>
        {props.items.length > 0 ? (
          props.items.map(item => (
            <tr key={item.id}>
                <td>{item.data_type}</td>
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
            <td colSpan={5}>No items</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ItemsList;