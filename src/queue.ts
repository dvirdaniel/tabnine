export class MessageQueue<T> {
    private queue: T[] = [];
  
    enqueue(message: T): void {
      this.queue.push(message);
    }
  
    dequeue(): T | undefined {
      return this.queue.shift();
    }
  
    peek(): T | undefined {
      return this.queue[0];
    }
  
    size(): number {
      return this.queue.length;
    }
  }