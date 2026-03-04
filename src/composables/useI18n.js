import { ref, computed } from 'vue'
import { zh, en } from './index.js'

const locales = { zh, en }
const currentLocale = ref(localStorage.getItem('locale') || 'zh')

export function useI18n() {
  const t = computed(() => locales[currentLocale.value])

  const locale = computed({
    get: () => currentLocale.value,
    set: (val) => {
      currentLocale.value = val
      localStorage.setItem('locale', val)
    }
  })

  const toggleLocale = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
  }

  return { t, locale, toggleLocale }
}