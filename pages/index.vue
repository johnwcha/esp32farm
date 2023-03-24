<template>
  <section class="section">
    <h2 class="title is-3 has-text-grey">
      Indoor real-time monitoring system
    </h2>
    <div class="columns is-mobile">
      <card
        title="Temperature"
        icon="thermometer-lines"
        url="temp"
      >
        Current: <span class="has-text-danger"> 
          <animated-number
            :value="temperature"
            :formatValue="formatTemp"
            :duration="1000"
          />  °F </span><br>
        Last update: <br>
        <a> {{ lastTime }} </a>
        <a> {{ lastDate }} </a>
      </card>

      <card
        title="Humidity"
        icon="water-percent"
        url="humidity"
      >
        Current: <span class="has-text-danger"> 
          <animated-number
            :value="humidity"
            :formatValue="formatHumi"
            :duration="1000"
          />  % </span><br>
        Last update: <br>
        <a> {{ lastTime }} </a>
        <a> {{ lastDate }} </a>
      </card>

      <card
        title="pH scale"
        icon="eyedropper-variant"
        url="ph"
      >
        To be implemented
      </card>

      <card
        title="Dissolved oxygen"
        icon="beaker-check"
        url="/"
      >
        To be implemented
      </card>
    </div>
  </section>
</template>

<script>
import { db } from "~/plugins/firebase.js"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { doc, getDocs } from "firebase/firestore"
import Card from '~/components/Card'
import AnimatedNumber from "animated-number-vue"

export default {
  name: 'HomePage',

  components: {
    Card,
    AnimatedNumber
  },
  data() {
    return {
      lastDate: '',
      lastTime: '',
      temperature: 0,
      humidity: 0,
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    formatTemp(value) {
      return value.toFixed(2);
    },
    formatHumi(value) {
      return value.toFixed(1);
    },
    async init() {
    const docRef = collection(db, "sensor_data")
    const q = query(docRef, orderBy("timestamp", "desc"), limit(1));
    const docSnap = await getDocs(q)
    docSnap.forEach((doc) => {
      // console.log(doc.data())
      this.temperature = doc.data().temp
      this.humidity = doc.data().humi
      this.lastDate = doc.data().timestamp.toDate().toLocaleString('en-US').split(', ')[0]
      this.lastTime = doc.data().timestamp.toDate().toLocaleString('en-US').split(', ')[1]
    })
    }
  }
}

// Error: Invalid login: 534-5.7.9 Application-specific password required. 
// Learn more at534 5.7.9  
// https://support.google.com/mail/?p=InvalidSecondFactor r10sm8612985pff.120 - 
// gsmtp

// Your app password for your device
// ---- owctfbnofauxtnsv
// How to use it
// Go to the settings for your Google Account in the application or device you are trying to set up. Replace your password with the 16-character password shown above.
// Just like your normal password, this app password grants complete access to your Google Account. You won't need to remember it, so don't write it down or share it with anyone.

</script>
