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
        <th scope="col">Chain-id</th>
        <th scope="col">Name</th>
        <th scope="col">genesis_hash</th>
        <th scope="col" style={{width: '1%'}}>logo</th>
        <th scope="col" style={{width: '1%'}}></th>
        </tr>
      </thead>
      <tbody>
        {props.items.length > 0 ? (
          props.items.map(item => (
            <tr key={item.id}>
              <td>{item.chain_id}</td>
                <td>{item.name}</td>
                <td>{item.genesis_hash}</td>
              <td><img src={getIpfsCidExternalLink(item.logo)} width="32" height="32" /></td>
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