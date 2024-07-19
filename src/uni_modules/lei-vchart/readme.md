# lei-vchart

> 一款基于vchart封装的图表库，该库默认了最简单的图表，需根据自己的需求进行打包。

- vchart官网：[https://visactor.io/vchart](https://visactor.io/vchart)
- vchart在线定制：[https://visactor.io/vchart/bundle](https://visactor.io/vchart/bundle)

### 示例
```vue
<template>
  <lei-vchart :spec="spec" :options="options" :events="events" canvasId="chart" @chartinit="chartinit"
    @chartready="chartready"></lei-vchart>
</template>

<script setup>
  import {
    reactive
  } from 'vue';

  const spec = {
    type: 'bar',
    data: [{
      id: 'barData',
      values: [{
          type: 'Autocracies',
          year: '1930',
          value: 129
        },
        {
          type: 'Autocracies',
          year: '1940',
          value: 133
        },
        {
          type: 'Democracies',
          year: '1930',
          value: 22
        },
        {
          type: 'Democracies',
          year: '1940',
          value: 13
        },
      ]
    }],
    xField: ['year', 'type'],
    yField: 'value',
    seriesField: 'type',
    legends: {
      visible: true,
      orient: 'top',
      position: 'start'
    },
    axes: [{
      orient: 'left',
      label: {}
    }]
  }

  const options = {}

  const events = []

  const chartinit = (e) => {
    console.log('chartinit:', e)
  }

  const chartready = (e) => {
    console.log('chartready:', e)
  }
</script>
```

### 属性说明

| 属性名						| 类型				| 默认值				| 说明										|
|-----------------|----------	|-------------|-----------------------|
| canvasId				| String		|							| 必填，图表ID						|
| options					| Object		|							| 初始化配置项						|
| spec						| Object		|							| 图表配置								|
| events					| Array			|							| 图表事件回调						|

### 事件说明

| 属性名						| 类型				|  说明									|
|-----------------|----------	|-----------------------|
| chartinit				|						|图表库初始化触发事件			|
| chartready			|						|图表库渲染后触发事件			|


### 定制说明：

**1，设置定制内容**
- 打包格式：`esm`
- 是否压缩代码：`否`
- 选择环境类型：`微信`

**2，下载下来后替换掉`vchart.js`文件**

**3，修改`vchart.js`文件内容**
- 将 `wx.getSystemInfoSync` 修改 `uni.getWindowInfo`
- 将 `wx.createSelectorQuery` 修改 `uni.createSelectorQuery`