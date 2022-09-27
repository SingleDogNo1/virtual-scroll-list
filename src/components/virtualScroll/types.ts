export enum ScrollDirectionEnum {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum AlignmentEnum {
  AUTO = 'auto',
  START = 'start',
  CENTER = 'center',
  END = 'end'
}

export interface ItemStyle {
  position: 'absolute'
  top?: number
  left: number
  width: string | number
  height?: string | number
}

export interface StyleCache {
  [id: number]: ItemStyle
}

export interface ItemInfo {
  index: number
  style: ItemStyle
}

export interface RenderedRows {
  startIndex: number
  stopIndex: number
}
