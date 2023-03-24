<template>
  <div> </div>
</template>

<script>
import { db } from "~/plugins/firebase.js"
import { doc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { query, where, limit } from "firebase/firestore";  
// import { getFunctions, httpsCallable } from "firebase/functions";

export default {
  data() {
    return {
      deleteBefore: ''
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    async init() {
      const now = new Date().getTime()
    //   console.log( now - 1000*60*60*72 )
      const daysago = new Date( now - 1000*60*60*72 )
      console.log( daysago.toLocaleString() )
      const sensorRef = collection(db, "sensor_data")
      const q = query(sensorRef, where("timestamp", "<=", daysago))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // console.log( doc.data().timestamp.toDate().toLocaleString('en-US') )
        // console.log( doc.ref )
         deleteDoc( doc.ref )
      })
    }
  }
}
</script>