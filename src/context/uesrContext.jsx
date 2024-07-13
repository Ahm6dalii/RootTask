import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext(null)


export default function UserContextProvider({children}){ 
  
  let[isloading ,setLoading]=useState(true)
    let [userData, setUserData] = useState(null);
    let [userTransactions, setUserTransactions] = useState(null);

  //   async function getTransactionData() {
  //       await axios.get("http://localhost:3000/transactions").then(function ({ data }) {
  //       setUserTransactions(data);
  //     });
  //   }
  
    // async function getUserData() {
    //   setLoading(true)
    //     await axios.get("http://localhost:3000/customers").then(function ({ data }) {
    //     // console.log(data);
    //     setUserData(data);
    //     setLoading(false)
    //   });
    // }
    async function getAllUserData() {
      setLoading(true)
        await axios.get("https://ahm6dalii.github.io/RootTaskDB/db.json").then(function ({ data }) {
        // console.log(data);
        let{transactions, customers }= data
        setUserData(customers);
        setUserTransactions(transactions);
        setLoading(false)



     
      });
    }
   
return <userContext.Provider value={{userData,userTransactions,getAllUserData ,isloading }}>
    {children}
</userContext.Provider>

}