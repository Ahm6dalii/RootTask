import axios from "axios";
import { createContext, useState } from "react";

export const userContext = createContext(null)


export default function UserContextProvider({children}){ 
  
  let[isloading ,setLoading]=useState(true)
    // console.log(children);
    let [userData, setUserData] = useState(null);
    let [userTransactions, setUserTransactions] = useState(null);
    async function getTransactionData() {
        await axios.get("http://localhost:3000/transactions").then(function ({ data }) {
        // console.log(data);
        setUserTransactions(data);
      });
    }
  
    async function getUserData() {
      setLoading(true)
        await axios.get("http://localhost:3000/customers").then(function ({ data }) {
        // console.log(data);
        setUserData(data);
        setLoading(false)
      });
    }
return <userContext.Provider value={{userData,userTransactions,getTransactionData,getUserData ,isloading }}>
    {children}
</userContext.Provider>

}