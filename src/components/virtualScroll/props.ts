import { ScrollDirectionEnum, AlignmentEnum } from './types'

export interface Props {
  /** 滚动列表的宽度, 默认值 100%. 当滚动方向为水平滚动时必填(需要确定的宽度计算相关值) */
  width?: number | string
  /** 滚动列表的高度, 默认值 100%. 当滚动方向为竖直滚动时必填(需要确定的宽度计算相关值) */
  height?: number | string
  /** 虚拟列表数据 */
  data: Record<string, any>[]
  /** 滚动方向 */
  scrollDirection?: ScrollDirectionEnum
  /** 配合 scrollToIndex 使用, 控制当前焦点的对齐方式 */
  scrollToAlignment?: AlignmentEnum
  /** 在显示内容之外预加载的缓冲列表项个数，用来优化滚动时的效果 */
  buffer?: number
  /** 列表项的高度/宽度(取决于滚动方向), 必填. 可以是具体的数字或返回给定高度的函数 */
  itemSize: number | { (index: number): Record<number, number> }
  /** 设置滚动的偏移量 */
  scrollOffset?: number
  /** 设置滚动到列表项的索引 */
  scrollToIndex?: number
}

export const basicProps = {
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '100%'
  },
  data: {
    type: Array,
    required: true
  },
  scrollDirection: {
    type: String,
    validator(value: string) {
      return ['horizontal', 'vertical'].includes(value)
    },
    default: 'vertical'
  },
  scrollToAlignment: {
    type: String,
    validator(value: string) {
      return ['auto', 'start', 'center', 'end'].includes(value)
    },
    default: 'auto'
  },
  buffer: {
    type: Number,
    default: 4
  },
  itemSize: {
    type: [Number, Function],
    required: true
  },
  scrollOffset: {
    type: Number
  },
  scrollToIndex: {
    type: Number
  }
}
