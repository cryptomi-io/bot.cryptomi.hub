export const useHelper = () => {
  const capitalizeFirstLetter = (str) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const countConsecutiveZeros = (num) => {
    const str = num.toString()
    const index = str.indexOf('.')
    if (index === -1) {
      return 0
    }
    const decimalPart = str.slice(index + 1)
    const match = decimalPart.match(/^0*/)
    return match ? match[0].length : 0
  }
  const numberFormat = (number, decimals = 8, isWhole = false, isPercent = false) => {
    if (number === 0) return 0
    if (!number) return '-'
    if (number > 1000 || isWhole) {
      if (number >= 1e12) {
        return (number / 1e12).toFixed(1) + 'T'
      } else if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'B'
      } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M'
      } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K'
      } else {
        if (!isPercent) return number.toString()
        else return number.toFixed(1)
      }
    } else {
      const num = number.toFixed(decimals)
      const count = countConsecutiveZeros(num)
      const str = num.toString().split('.')

      const zeroText = count > 1 ? `0<small class="text-[8px]">${count}</small>` : `0`
      return str[0] + '.' + (count > 0 ? `${zeroText}` : '') + str[1].slice(count, count + 4)
    }
  }

  const shortenContractAddress = (address, chars = 4) => {
    if (!address) return address
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
  }
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  return {
    delay,
    numberFormat,
    countConsecutiveZeros,
    capitalizeFirstLetter,
    shortenContractAddress
  }
}
