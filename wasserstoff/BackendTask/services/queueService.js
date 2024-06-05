class FIFOQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(request) {
    this.queue.push(request);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(request) {
    this.queue.push(request);
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

class RoundRobinQueue {
  constructor() {
    this.queues = [];
    this.index = 0;
  }

  addQueue() {
    this.queues.push([]);
  }

  enqueue(request) {
    this.queues[this.index].push(request);
    this.index = (this.index + 1) % this.queues.length;
  }

  dequeue() {
    for (let i = 0; i < this.queues.length; i++) {
      const queue = this.queues[i];
      if (queue.length > 0) {
        return queue.shift();
      }
    }
    return null;
  }

  isEmpty() {
    return this.queues.every(queue => queue.length === 0);
  }
}

module.exports = { FIFOQueue, PriorityQueue, RoundRobinQueue };
