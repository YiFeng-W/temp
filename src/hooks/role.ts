import { RoleEnum } from '@/enum'
import { getUserInfo } from '~/utils/local-storage'

export const useRoleMisc = () => {
  const roleRef = ref<RoleEnum>()

  const init = () => {
    const buyerOrSeller = getUserInfo()?.buyerOrSeller
    roleRef.value = buyerOrSeller
  }

  init()

  /**
   * 是否是 胶农
   */
  const isFarmRef = computed(() => !roleRef.value || roleRef.value === RoleEnum.Farm)
  /**
   * 是否是 胶厂
   */
  const isFactoryRef = computed(() => roleRef.value === RoleEnum.Factory)
  /**
   * 是否是 胶站
   */
  const isStationRef = computed(() => roleRef.value === RoleEnum.Station)

  return {
    roleRef,
    /**
     * 是否是 胶厂
     */
    isFactoryRef,
    /**
     * 是否是 胶农
     */
    isFarmRef,
    /**
     * 是否是 胶站
     */
    isStationRef,
  }
}
