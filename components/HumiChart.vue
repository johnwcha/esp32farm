<template>
  <div>
    <section> <canvas id="humi-chart" ></canvas> </section>
    <section> <canvas id="temp-chart" ></canvas> </section>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

export default {
  name: 'HumiChart',
  created() {
    Chart.register(...registerables);
  },
  props: ['sensorData'],
  watch: {
    sensorData: function(val) {
        // console.log('sensor data watched ..................', val)
      this.tempChartData.data.labels = val.times
      this.humiChartData.data.labels = val.times
      this.tempChartData.data.datasets[0].data = val.temperature
      this.humiChartData.data.datasets[0].data = val.humidity
      this.tempChart.update()
      this.humiChart.update()
    }
  },
    data() {
    return {
        tempChart: null,
        humiChart: null,
      tempChartData: {

  type: "line",
  data: {
    // labels: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    // labels: ['4:01 PM', '4:00 PM', '3:59 PM', '3:58 PM', '3:56 PM', '3:55 PM', '3:54 PM', '3:53 PM', '3:52 PM', '3:51 PM', '3:50 PM', '3:49 PM', '3:48 PM', '3:47 PM', '3:46 PM', '3:45 PM', '3:44 PM', '3:43 PM', '3:42 PM', '3:41 PM'],
    labels: [],
    datasets: [ 
      {
        label: "Temperature °F",
        // data: [0, 0, 1, 2, 79, 82, 27, 14],
        data: [],
        fill: false,
        backgroundColor: "rgba(	255, 99, 132,.5)",
        borderColor: "#ff6384",
        borderWidth: 1,
      }
    ]
  },
  options: {
    // responsive: true,
    // lineTension: 1,
    tension: 0.4,
    scales: {
        y: {
                // stacked: true,
                min: 50,
                max: 75,
                ticks: { stepSize: 1 }
                // ticks: { beginAtZero: true }
            }
    }
  }
      },
      humiChartData: {

  type: "bar",
  data: {
    // labels: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    // labels: ['4:01 PM', '4:00 PM', '3:59 PM', '3:58 PM', '3:56 PM', '3:55 PM', '3:54 PM', '3:53 PM', '3:52 PM', '3:51 PM', '3:50 PM', '3:49 PM', '3:48 PM', '3:47 PM', '3:46 PM', '3:45 PM', '3:44 PM', '3:43 PM', '3:42 PM', '3:41 PM'],
    labels: [],
    datasets: [
      {
        label: "Relative humidity %",
        // data: [0.166, 2.081, 3.003, 0.323, 954.792, 285.886, 43.662, 51.514],
        // data: [47.5, 47.6, 47.6, 47.6, 47.7, 47.7, 47.6, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.4, 47.3, 47.2, 47.2],
        data: [],
        fill: true,
        backgroundColor: "rgba(71, 183,132,.5)",
        borderColor: "#47b784",
        borderWidth: 1,
      }
    ]
  },
  options: {
    // responsive: true,
    // lineTension: 1,
    tension: 0.4,
    scales: {
        y: {
                // stacked: true,
                min: 30,
                max: 90,
                ticks: { stepSize: 2 }
                // ticks: { beginAtZero: true }
            }
    }
  }
      },

    }
  },
  mounted() {
    const ctx = document.getElementById('temp-chart');
    this.tempChart = new Chart(ctx, this.tempChartData);
    const ctx1 = document.getElementById('humi-chart');
    this.humiChart = new Chart(ctx1, this.humiChartData);
  }
}
</script>