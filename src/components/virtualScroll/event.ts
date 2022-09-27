export class Event {
  items: any[] = []
  offset = 0
  data: any[] | null = null
  start = 0
  stop = 0
  total = 0

  toString(): string {
    return `start:${this.start} stop:${this.stop} total:${this.total} offset:${this.offset}`
  }
}
