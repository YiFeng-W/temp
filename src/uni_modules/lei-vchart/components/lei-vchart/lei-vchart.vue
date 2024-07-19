<template>
  <view :id="canvasId" class="vchart">
    <canvas class="vchart" :id="`${canvasId}_draw_canvas`" :canvas-id="`${canvasId}_draw_canvas`" type="2d"
      @touchstart="bindEvent" @touchmove="bindEvent" @touchend="bindEvent" @mousemove="bindEvent" @mouseover="bindEvent"
      @mouseout="bindEvent" @mousedown="bindEvent" @mouseup="bindEvent"></canvas>
    <canvas :width="offscreenCanvasWidth" :height="offscreenCanvasHeight" :id="`${canvasId}_hit_canvas`"
      :canvas-id="`${canvasId}_hit_canvas`" type="2d"></canvas>
    <canvas :width="offscreenCanvasWidth" :height="offscreenCanvasHeight" :id="`${canvasId}_tooltip_canvas`"
      :canvas-id="`${canvasId}_tooltip_canvas`" type="2d"></canvas>
  </view>
</template>

<script setup>
  import {
    onMounted,
    reactive,
    ref,
    getCurrentInstance,
    onUnmounted
  } from 'vue'
  import {
    onReady,
    onResize
  } from '@dcloudio/uni-app'
  import {
    VChart
  } from './vchart.js'

  const emit = defineEmits(['chartinit', 'chartready'])
  const props = defineProps({
    canvasId: {
      type: String,
    },
    spec: {
      type: Object,
    },
    options: {
      type: Object,
    },
    events: {
      type: Array
    }
  });

  const {
    pixelRatio
  } = uni.getWindowInfo();
  const {
    brand
  } = uni.getDeviceInfo();
  const app = getCurrentInstance().proxy;
  const chart = ref(null)
  const offscreenCanvasWidth = ref(0);
  const offscreenCanvasHeight = ref(0);

  const bindEvent = (event) => {
    // 处理下 mouse 事件和 touch 事件，防止重复触发
    if (brand === 'PC' && event.type.startsWith('touch')) {
      return;
    }
    if (brand !== 'PC' && event.type.startsWith('mouse')) {
      return;
    }
    if (chart.value) {
      event.target = chart.value.getCanvas();
      chart.value.getStage().window.dispatchEvent(event);
    }
  }

  const getCanvasInfo = () => {
    return new Promise((resolve) => {
      uni.createSelectorQuery().in(app).select(`#${props.canvasId}_draw_canvas`).fields({
        node: true,
        size: true,
      }).exec(async (res) => {
        resolve(res[0])
      })
    })
  }

  const initChart = async () => {
    const {
      node,
      width,
      height
    } = await getCanvasInfo();

    offscreenCanvasWidth.value = width;
    offscreenCanvasHeight.value = height;

    const domref = {
      width,
      height
    }

    const canvasIdLists = [`${props.canvasId}_draw_canvas`, `${props.canvasId}_tooltip_canvas`,
      `${props.canvasId}_hit_canvas`
    ]

    chart.value && chart.value.release();

    await VChart.vglobal.setEnv('wx', {
      domref,
      force: true,
      canvasIdLists,
      component: app,
      freeCanvasIdx: 2
    });

    const chartInstance = new VChart({
      ...(props.spec || {}),
      ...domref,
    }, {
      mode: 'wx',
      modeParams: {
        domref,
        force: true,
        canvasIdLists,
        tooltipCanvasId: `${props.canvasId}_tooltip_canvas`,
        freeCanvasIdx: 2
      },
      dpr: pixelRatio,
      renderCanvas: `${props.canvasId}_draw_canvas`,
      ...(props.options || {})
    });

    chart.value = chartInstance;
    emit('chartinit');

    if (props.events) {
      props.events.forEach(event => {
        event && chartInstance.on(event.type, {
          ...event.query,
          source: 'chart'
        }, event.handler);
      });
    }

    chartInstance.renderAsync().then(() => {
      emit('chartready')
    })
  }

  onReady(() => {
    initChart();
  })

  onResize(() => {
    initChart()
  })

  onUnmounted(() => {
    chart.value && chart.value.release();
  })
</script>

<style scoped>
  .vchart {
    width: 100%;
    height: 400rpx;
    background-color: #fff;
  }
</style>