import React from 'react'

export default function TransactionsRecord ({userTrans}) {
  return (<>
           <tr className="even:bg-slate-200 font-semibold" >
       <td>{userTrans?.customerName}</td>
      <td>{userTrans.date}</td>
      <td>{userTrans.amount}</td>
       </tr>
    </>
  )
}
