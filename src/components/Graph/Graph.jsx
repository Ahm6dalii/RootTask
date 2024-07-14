import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to filter transactions by customer ID
function getTransactionsByCustomerId(transactions, customerId) {
  return transactions.filter(transaction => transaction.customer_id === parseInt(customerId));
}

// Function to aggregate transaction amounts by date
function getTotalAmountsPerDay(transactions) {
  const totals = {};
  
  transactions.forEach(transaction => {
    if (totals[transaction.date]) {
      totals[transaction.date] += transaction.amount;
    } else {
      totals[transaction.date] = transaction.amount;
    }
  });
  
  return Object.entries(totals).map(([date, amount]) => ({ date, amount }));
}

// Main component to display the customer transactions chart
function CustomerTransactionsChart({ transactions, customers }) {
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // Set the initial selected customer when customers data is available
  useEffect(() => {
    if (customers && customers.length > 0) {
      setSelectedCustomer(customers[0].id);
    }
  }, [customers]);

  const handleCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };

  if (!customers || customers.length === 0) {
    return <div>No customers available</div>;
  }

  const customerTransactions = getTransactionsByCustomerId(transactions, selectedCustomer);
  const totalsPerDay = getTotalAmountsPerDay(customerTransactions);

  const data = {
    labels: totalsPerDay.map(entry => entry.date),
    datasets: [
      {
        label: 'Total Transaction Amount',
        data: totalsPerDay.map(entry => entry.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Changed color
        borderColor: 'rgba(54, 162, 235, 1)', // Changed color
        borderWidth: 2, // Changed border width
        borderRadius: 5, // Added border radius
        barThickness: 60, // Added bar thickness
      }
    ]
  };

  const options = {
    indexAxis: 'x', // Use 'x' axis for bar width control
    elements: {
      bar: {
        borderWidth: 2,
        borderSkipped: 'start',
        borderRadius: 15, // Changed border radius
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
        ticks: {
          font: {
            size: 20 // Changed font size for x-axis
          }
        }
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 18 // Changed font size for y-axis
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18 // Changed font size for legend
          }
        }
      },
      title: {
        display: true,
        text: 'Customer Transactions Graph',
        font: {
          size: 24 // Changed font size for title
        }
      },
      tooltip: {
        bodyFont: {
          size: 18 // Changed font size for tooltip body
        },
        titleFont: {
          size: 18 // Changed font size for tooltip title
        }
      }
    }
  };

  return (
    <div>
      <select value={selectedCustomer} onChange={handleCustomerChange}>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
      <Bar data={data} options={options} />
    </div>
  );
}

export default CustomerTransactionsChart;
