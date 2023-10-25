import React from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';

function LineGraph({ labels, dataset1, dataset2 }) {
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'All Completed Tasks',
          data: dataset1,
          fill: false,
          borderWidth: 4,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'green',
          responsive: true,
        },
        {
          label: 'All Completed On-Time Tasks',
          data: dataset2,
          fill: false,
          borderWidth: 4,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'blue',
          responsive: true,
        },
      ],
    };
  
    return (
      <div>
        <Line data={data} />
      </div>
    );
  }
  
  export default LineGraph;