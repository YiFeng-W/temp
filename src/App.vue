<script setup lang="ts">
import { setFontSize } from '@/utils/local-storage'

onLaunch(() => {
  setFontSize(1)
})
</script>

<style lang="scss">
@import 'uview-plus/index.scss';

body {
  background-color: $sbgcolor7;
}

input {
  height: 18rem;
  font-size: 16rem;
}

.padbg {
  background-color: $sbgcolor7;
  min-height: 100vh;
  font-size: $text4;
}

// 按钮禁用时的颜色
.forbidden {
  background-color: $sbgcolor2 !important;
}
</style>
