<template>
  <div ref="rootNode" :style="warpStyle">
    <div ref="innerNode" :style="innerStyle">
      <div
        v-for="(item, i) in event?.items"
        :style="(getItemStyle(i) as CSSProperties)"
        :key="event?.start + i"
        class="vue3-infinite-list"
      >
        <slot :event="event" :item="item" :index="event.start + i"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref, reactive, toRefs, onMounted, onBeforeUnmount, CSSProperties } from 'vue'
import { basicProps, Props } from './props'
import { StyleCache, ScrollDirectionEnum, ItemStyle } from './types'
import { SizeAndPosManager } from './sizeAndPosManager'
import { addEventListener, removeEventListener, isPureNumber } from './utils'
import { Event } from './event'

const props = defineProps(basicProps)

const positionMap = {
  horizontal: 'left',
  vertical: 'top'
}

const scrollMap = {
  vertical: 'scrollTop',
  horizontal: 'scrollLeft'
}

const sizeMap = {
  vertical: 'height',
  horizontal: 'width'
}

let rootNode = ref(null)
let innerNode = ref(null)
let warpStyle = ref({})
let innerStyle = ref({})
const basicInnerStyle = ref({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  minHeight: '100%'
})

let items: any[] = []
let offset: number | undefined
let oldOffset: number | null
let scrollChangeReason: string
let sizeAndPosManager: SizeAndPosManager
let styleCache: StyleCache = {}
const { itemSize, scrollDirection } = toRefs(props)
const event = reactive(new Event())
const getItemStyle = (index: number) => {
  index += event.start
  const style = styleCache[index]
  if (style) return style
  const { size, offset } = sizeAndPosManager.getSizeAndPositionForIndex(index)
  const result: ItemStyle = {
    ...{
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%'
    },
    [getCurrSizeProp()]: addUnit(size),
    [positionMap[props.scrollDirection as ScrollDirectionEnum]]: addUnit(offset)
  }

  return (styleCache[index] = result)
}
const initAll = () => {
  createSizeAndPosManager()
  addEventListener(rootNode.value, 'scroll', handleScroll)

  offset =
    props.scrollOffset ||
    (props.scrollToIndex != null && getOffsetForIndex(props.scrollToIndex)) ||
    0
  scrollChangeReason = 'requested'

  setTimeout(() => {
    if (props.scrollOffset != null) {
      scrollTo(props.scrollOffset)
    } else if (props.scrollToIndex != null) {
      scrollTo(getOffsetForIndex(props.scrollToIndex))
    }
  }, 0)
  setDomStyle()
  scrollRender()
}
const handleScroll = (e: UIEvent) => {
  const nodeOffset = getNodeOffset()
  if (nodeOffset! < 0 || offset === nodeOffset || e.target !== rootNode.value) return
  offset = nodeOffset
  scrollChangeReason = 'observed'
  scrollRender()
}
const scrollRender = () => {
  const { start, stop } = sizeAndPosManager.getVisibleRange({
    containerSize: getCurrSizeVal() || 0,
    offset: offset || 0,
    buffer: props.buffer
  })
  // fill items;
  if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
    items.length = 0
    for (let i = start; i <= stop; i++) {
      items.push(props.data?.[i])
    }
    event.start = start
    event.stop = stop
    event.offset = offset!
    event.items = items
    event.total = getItemCount()
    if (!isPureNumber(itemSize?.value)) {
      innerStyle.value = {
        ...basicInnerStyle.value,
        [getCurrSizeProp()]: addUnit(sizeAndPosManager.getTotalSize())
      }
    }
  }
  renderEnd()
}
const scrollTo = (value: number) => {
  if (!rootNode.value) return
  ;(rootNode.value[getCurrScrollProp()] as number) = value
  oldOffset = value
}
const renderEnd = () => {
  if (oldOffset !== offset && scrollChangeReason === 'requested') {
    scrollTo(offset!)
  }
}

// init SizeAndPosManager
const createSizeAndPosManager = () => {
  if (!sizeAndPosManager)
    sizeAndPosManager = new SizeAndPosManager({
      itemCount: getItemCount(),
      itemSizeGetter: (index) => getSize(index),
      estimatedItemSize: getEstimatedItemSize()
    })
  return sizeAndPosManager
}
const getNodeOffset = () => {
  return rootNode.value?.[getCurrScrollProp()]
}
const getCurrSizeProp = () => {
  return sizeMap[scrollDirection.value as ScrollDirectionEnum]
}
const getCurrSizeVal = () => {
  return props[getCurrSizeProp() as keyof Props] as number
}
const getCurrScrollProp = () => scrollMap[scrollDirection.value as ScrollDirectionEnum]

const getOffsetForIndex = (
  index: number,
  scrollToAlignment: string = props.scrollToAlignment,
  itemCount: number = getItemCount()
): number => {
  if (index < 0 || index >= itemCount) index = 0
  return sizeAndPosManager.getUpdatedOffsetForIndex({
    align: scrollToAlignment,
    containerSize: getCurrSizeVal(),
    currentOffset: offset || 0,
    targetIndex: index
  })
}
const getSize = (index: number): number => {
  if (typeof itemSize?.value === 'function') {
    return itemSize.value(index)
  }
  return itemSize?.value as number
}
const getItemCount = (): number => {
  return props.data ? props.data.length : 0
}
const getEstimatedItemSize = () => {
  return (typeof itemSize?.value === 'number' && itemSize.value) || 50
}
const recomputeSizes = (startIndex = 0) => {
  styleCache = {}
  sizeAndPosManager.resetItem(startIndex)
}
const addUnit = (val: any): string => {
  return typeof val === 'string' ? val : val + 'px'
}
const setDomStyle = () => {
  warpStyle.value = {
    ...{
      overflow: 'auto',
      willChange: 'transform',
      WebkitOverflowScrolling: 'touch'
    },
    height: addUnit(props.height),
    width: addUnit(props.width)
  }
  innerStyle.value = {
    ...basicInnerStyle.value,
    [getCurrSizeProp()]: addUnit(sizeAndPosManager.getTotalSize())
  }
}
const clearStyleCache = () => {
  for (let key in styleCache) {
    delete styleCache[key]
  }
}

onMounted(() => setTimeout(initAll))
onBeforeUnmount(() => {
  clearStyleCache()
  sizeAndPosManager.destroy()
  removeEventListener(rootNode.value, 'scroll', handleScroll)
})

watch(
  () => props.data,
  (newVal, oldVal) => {
    sizeAndPosManager.updateConfig({
      itemCount: getItemCount(),
      estimatedItemSize: getEstimatedItemSize()
    })
    oldOffset = null
    recomputeSizes()
    setDomStyle()
    setTimeout(scrollRender, 0)
  }
)
watch(
  () => props.scrollOffset,
  (newVal, oldVal) => {
    offset = props.scrollOffset || 0
    scrollChangeReason = 'requested'
    scrollRender()
  }
)
watch(
  () => props.scrollToIndex,
  (newVal, oldVal) => {
    offset = getOffsetForIndex(props.scrollToIndex!, props.scrollToAlignment, getItemCount())
    scrollChangeReason = 'requested'
    scrollRender()
  }
)
</script>
