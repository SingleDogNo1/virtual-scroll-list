export function addEventListener(ele: any, eventType: string, callback: any) {
  if (ele.addEventListener) {
    return ele.addEventListener(eventType, callback, false)
  } else if (ele['attachEvent']) {
    return ele['attachEvent'](eventType, callback)
  } else {
    return (ele['on' + eventType] = callback)
  }
}

export function removeEventListener(ele: any, eventType: string, callback: any) {
  if (ele.removeEventListener) {
    return ele.removeEventListener(eventType, callback, false)
  } else if (ele['detachEvent']) {
    return ele['detachEvent'](eventType, callback)
  } else {
    return (ele['on' + eventType] = null)
  }
}

export function isPureNumber(val: any): boolean {
  if (typeof val === 'number' || !val) return true
  else return false
}
