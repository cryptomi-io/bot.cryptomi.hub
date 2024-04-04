import { $hub } from '@/services/hub'

export const useNotifications = () => {
  const notificationToAdmin = async (message) => {
    const response = await $hub.post(`/notification/send/admin`, {
      message
    })
    return response?.data?.data
  }
  return {
    notificationToAdmin
  }
}
