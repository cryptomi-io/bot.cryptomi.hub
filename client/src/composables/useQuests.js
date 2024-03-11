import { $cryptomi } from '../services/http'

export const useQuests = () => {
    const getQuests = async () => {
        const response = await $cryptomi.post('/quests/getAll')
        if (
            !response?.status !== 200 &&
            response?.data?.error &&
            response?.data?.error.status !== 200
          ) {
            throw new Error('Произошла ошибка при получении квестов')
          }      
          return response?.data.data.result 
    }

    return {
        getQuests
    }
}