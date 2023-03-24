<template>
  <section class="section">
    <h3 class="subtitle is-6 has-text-grey">
      <b-icon
        icon="water-percent"
        type="is-success"
      />
      Current humidity: <span class="has-text-danger">
        <IOdometer
        class="iOdometer"
        :value="curHumiNum"
        format="(,ddd).d" />
        %</span><br>
       <code> | </code>
      Last update: <a> {{ lastUpdate }} </a> <br> <code> | </code> 
      <span class="has-text-danger"> Update frequency: </span><a> every 10 minutes </a> <br>
      <code> | </code> 
      <span class="has-text-danger"> Next update: </span><a> {{ nextRead }} </a>
    </h3>

    <HumiChart :sensorData=sensorData />
  </section>
</template>

<script>
import { db } from "~/plugins/firebase.js"
import { doc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";  
import { getFunctions, httpsCallable } from "firebase/functions";
import { Timer } from "easytimer.js";
import IOdometer from 'vue-odometer';
import 'odometer/themes/odometer-theme-default.css';

export default {
    components: {
      IOdometer
    },
  data() {
    return {
      sensorData: {},
      curHumiRead: '',
      lastUpdate: '',
      nextRead: '',
      timer: null,
      unsubscribe: null,
      firstLoad: true
    }
  },
  computed: {
    curHumiNum() {
      return Number(this.curHumiRead)
    }
  },
  mounted(){
    // console.log(this.$route.query.token)
    // const sensorRef = collection(db, "sensor_data");
    // const q = query(sensorRef, orderBy("timestamp"), limit(50));
    this.initRead()
    // this.start()
    this.initTimer()
    // this.startCountDown()
  },
  destroyed() {
    // this.pause()
    this.timer.removeEventListener('secondsUpdated')
    this.timer.removeEventListener('targetAchieved')
    this.unsubscribe()
  },
  methods: {
    // countdown timer easytimer.js
    initTimer() {
      this.timer = new Timer()
      this.timer.addEventListener('secondsUpdated', (e) => {
        // console.log( this.timer.getTimeValues().seconds )
        // console.log( this.timer.getTimeValues().minutes )
        this.nextRead = this.timer.getTimeValues().minutes + ':' +
                        this.returnData( this.timer.getTimeValues().seconds )
      })
      this.timer.addEventListener('targetAchieved', (e) => {
        console.log('reset timer')
        this.timer.stop()
        // this.initRead()
      })
    },
    startCountDown(sec){
      // this.timer.reset()
      this.timer.start({countdown: true, startValues: {seconds: sec}, precision: 'seconds', target: {seconds: 0}})
    },
    async listenForUpdate(){
      const sensorRef = collection(db, "sensor_data");
      const q = query(sensorRef, orderBy("timestamp", "desc"), limit(1));
      this.unsubscribe = await onSnapshot(q, (snapshot) => {
        if (this.firstLoad) {
          this.firstLoad = false
        } else {
          snapshot.forEach((doc) => {
            // console.log('listen for update: ', doc.data())
            this.lastUpdate = doc.data().timestamp.toDate().toLocaleString('en-US')
            this.curHumiRead = doc.data().temp
            const temp = [...this.sensorData.temperature]
            temp.shift(); temp.push(doc.data().temp)
            const humi = [...this.sensorData.humidity]
            humi.shift(); humi.push(doc.data().humi)
            const time = [...this.sensorData.times]
            time.shift(); time.push(doc.data().timestamp.toDate().toLocaleString('en-US').split(', ')[1])
            this.sensorData = { temperature: temp, humidity: humi, times: time}
          })
        this.timer.stop()
        this.startCountDown(600)
          
        }
      }, (error) => {
          alert('Problems in reading sensor data. Reload the page and try again.')
        })
    },
    async initRead() {
      const sensorRef = collection(db, "sensor_data");
      const q = query(sensorRef, orderBy("timestamp", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      let label = []
      let temperature = []
      let humidity = []
      let lastUpdate = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        // console.log(doc.data().temp)
        lastUpdate.push(doc.data().timestamp.toDate().toLocaleString('en-US'))
        temperature.push(doc.data().temp)
        humidity.push(doc.data().humi)
        // console.log(doc.data().timestamp.toDate().toLocaleString('en-US'))
        // output ---  11/11/2021, 2:00:37 PM
        const output = doc.data().timestamp.toDate().toLocaleString('en-US').split(', ')
        const date = output[0]
        const timearr = output[1].split(' ')
        const time = timearr[0] // 2:00:37
        const ampm = timearr[1] // PM
        const hms = time.split(':') // [2, 00, 37]
        label.push(hms[0] + ':' + hms[1] + ' ' + ampm)
      });
        // console.log(label)
        // console.log(temperature)
        // console.log(humidity)
        // console.log(temperature[0])
      this.listenForUpdate()

      this.lastUpdate = lastUpdate[0]
      this.curHumiRead = humidity[0]
      this.sensorData = { times: label.reverse(),
          temperature: temperature.reverse(),
          humidity: humidity.reverse() }

      // ---  diff between now and next update
      const now = new Date()
      // console.log('now Minutes ... ', now.getMinutes())
      const secNow = now.getMinutes()*60 + now.getSeconds()
      const lastup = lastUpdate[0].split(', ')
      // console.log( lastup[1].split(' ')[0].split(':')[1] )
      // console.log( lastup[1].split(' ')[0].split(':')[2] )
      const last = Number(lastup[1].split(' ')[0].split(':')[1])*60 + 
                   Number(lastup[1].split(' ')[0].split(':')[2]) 
      // console.log('last update diff: ', secNow-last)
      this.startCountDown(600-(secNow-last))

      // console.log('%cinit sensor read', 'color: red')
    },
    returnData(input) {
      return input > 9 ? input : `0${input}`
    },
  }
}
</script>