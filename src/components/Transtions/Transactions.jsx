import React, { useContext, useEffect, useState } from "react";
import TransactionsRecord from "./../TableTransation/TableTransaction";
import CustomerTransactionsChart from "../Graph/Graph";
import { userContext } from './../../context/uesrContext';
import LoadingScreen from './../LoadingScreen/LoadingScreen';

export default function TransactionsTable() {
  const {userData,userTransactions,getTransactionData,getUserData,getAllUserData,isloading  }=useContext(userContext)
  const [userWithTransaction, setUserWithTransaction] = useState(null);
  const [transactionSearch, setTransactionSearch] = useState([]);
  const [searchType, setSearchType] = useState("name"); // Default to search by name
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  
  useEffect(() => {
    // getTransactionData()
    getAllUserData()
  },[])

  useEffect(() => {
    mergeCustomersAndTransactions(userData, userTransactions);
  }, [userData, userTransactions]);

  useEffect(() => {
   
    // Initially display all transactions
    if (userWithTransaction) {
      setTransactionSearch(userWithTransaction);
    }
  }, [userWithTransaction]);

  function mergeCustomersAndTransactions(customers, transactions) {
    if (!customers || !transactions) {
      return;
    }

    const customerMap = customers.reduce((map, customer) => {
      map[customer.id] = customer;
      return map;
    }, {});

    const enrichedTransactions = transactions.map((transaction) => {
      const customer = customerMap[transaction.customer_id];
      if (customer) {
        return {
          ...transaction,
          customerName: customer.name,
        };
      } else {
        console.error(
          `No customer found for transaction with customer_id ${transaction.customer_id}`
        );
        return transaction;
      }
    });

    setUserWithTransaction(enrichedTransactions);
  }

  function handleSearchTypeChange(event) {
    setSearchType(event.target.value);
  }

  function filterTransactions() {
    if (!userWithTransaction) return;

    if (searchType === "name") {
      const searchTerm = document.getElementById("inp").value.toLowerCase();
      const filteredData = userWithTransaction.filter((data) =>
        data.customerName.toLowerCase().includes(searchTerm)
      );
      setTransactionSearch(filteredData);
    } else if (searchType === "amount") {
      const filteredData = userWithTransaction.filter(
        (transaction) =>
          transaction.amount >= minAmount && transaction.amount <= maxAmount
      );
      setTransactionSearch(filteredData);
    }
  }

  function applyFilters() {
    const filteredTransactions = userWithTransaction.filter(
      (transaction) =>
        transaction.amount >= minAmount && transaction.amount <= maxAmount
    );
    setTransactionSearch(filteredTransactions);
  }

  return (<>
    {isloading ? <LoadingScreen/> :<div className="max-w-screen-xl m-auto">
    <div className="flex items-center space-x-4 mb-4 mt-5">
      <div className="flex align-content-center">
        <label className="mr-2">Search by:</label>
        <label>
          <input
            type="radio"
            value="name"
            checked={searchType === "name"}
            onChange={handleSearchTypeChange}
            onClick={ ()=>{setMinAmount(0) ,setMaxAmount(0),setTransactionSearch(userWithTransaction)}}
            className="mr-1"
          />
          Name
        </label>
        <label className="ms-2">
          <input
            type="radio"
            value="amount"
            checked={searchType === "amount"}
            onChange={handleSearchTypeChange}
            onClick={()=>setTransactionSearch(userWithTransaction)}
            className="mr-1"
          />
          Amount
        </label>
      </div>
    </div>

    {searchType === "amount" && (
      <div className="flex align-items-center space-x-4">
        <div>
          <label htmlFor="min-price" className="inline-block w-20">
            Min Price:
          </label>
          <input
            type="number"
            className="border px-2 py-1 w-[6rem]"
            id="min-price"
            min={0}
            step={100}
            value={minAmount}
            onChange={(e) => setMinAmount(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="max-price" className="inline-block w-20">
            Max Price:
          </label>
          <input
            type="number"
            className="border px-2 py-1 w-[6rem]"
            id="max-price"
            min={0}
            step={100}
            value={maxAmount}
            onChange={(e) => setMaxAmount(parseFloat(e.target.value))}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={applyFilters}
        >
          Apply
        </button>
      </div>
    )}

    {searchType === "name" && (
      <>
        <input
          type="search"
          id="inp"
          onInput={filterTransactions}
          className="w-full md:w-[60%] py-2 px-3 border m-2"
          placeholder="Search by name"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={filterTransactions}
        >
          Search
        </button>
      </>
    )}

    <h1 className="font-bold text-xl py-4 mb-1">User Transaction Table</h1>
    <table className="w-full text-center border">
      <thead className="bg-slate-700 text-white text-2xl">
        <tr>
          <th className="px-2 w-[40%] py-2">Name</th>
          <th className="px-2 w-[40%]">Date</th>
          <th className="px-2 w-[20%]">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactionSearch.length === 0 && (
          <tr className="mt-2 py-2 bg-red-200 font-semibold text-red-500 border border-red-500">
            <td colSpan={3}>No Transactions Found</td>
          </tr>
        )}
        {transactionSearch.map((userTrans, index) => (
          <TransactionsRecord key={index} userTrans={userTrans} />
        ))}
      </tbody>
    </table>

    <div className="mt-5">
      <CustomerTransactionsChart
        customers={userData}
        transactions={userTransactions}
      />
    </div>
  </div>}
  
  </>
 
    
  );
}
