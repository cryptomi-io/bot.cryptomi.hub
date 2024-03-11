import { $cryptomi } from '../services/http'

export default useQuests = async () => {
    const getQuests = async () => {
        const response = await $cryptomi.get('/quests/getAll')
        console.log(response.data)
        if (
            !response?.status !== 200 &&
            response?.data?.error &&
            response?.data?.error.status !== 200
          ) {
            throw new Error('Произошла ошибка при получении квестов')
          }
      
          return response?.data 
    }

    return {
        getQuests,
    }
}