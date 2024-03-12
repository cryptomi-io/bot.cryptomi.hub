import { $hub } from '@/services/hub'

export const useAnalytics = () => {
  const addTask = async (wallet_address, time_period = 90, user_id) => {
    const response = await $hub.post(`/analyzer`, {
      wallet_address,
      time_period,
      user_id
    })
    return response?.data?.data
  }

  const getTasks = async (user_id) => {
    const response = await $hub.get(`/analyzer/${user_id}`)
    return response?.data?.data
  }
  const getItemTask = async (task_id) => {
    const response = await $hub.get(`/analyzer/task/${task_id}`)
    return response?.data?.data
  }
  return {
    addTask,
    getTasks,
    getItemTask
  }
}
