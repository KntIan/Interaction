// stores/attendanceStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAttendanceStore = defineStore('attendance', () => {
  const logs = ref([])

  const setLogs = (data) => {
    logs.value = data
  }
  console.log(logs.value)
  return { logs, setLogs }
})
