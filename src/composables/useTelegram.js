const tg = window.Telegram.WebApp
export function useTelegram() {
  const onClose = () => {
    tg?.close()
  }

  const expandApp = () => {
    tg?.expand()
  }

  const closeApp = () => {
    tg?.close()
  }
  return {
    tg,
    user: tg.initDataUnsafe?.user,
    onClose,
    expandApp,
    closeApp
  }
}
