import { BehaviorSubject, Subject } from 'rxjs';

class ImporterQueue {
  constructor(dbIsReady: boolean) {
    this.queue = new Subject();
    this.isReady = new BehaviorSubject(dbIsReady);
    this.stack = [];

    this.queue.subscribe((task) => {
      if (this.isReady.value) {
        this.importData(task.name, task.data);
      } else {
        this.stack.push(task);
      }
    });

    this.isReady.subscribe((ready) => {
      if (ready) {
        while (this.stack.length > 0) {
          const task = this.stack.shift();
          this.importData(task.name, task.data);
        }
      }
    });
  }

  addToQueue(name, data) {
    this.queue.next({ name, data });
  }

  importData(name, data) {
    // Your import logic here
    console.log(`Importing ${name}`, data);
  }

  updateReadyStatus(status) {
    this.isReady.next(status);
  }
}

// BroadcastChannel setup
// const channel = new BroadcastChannel('myChannel');
// const taskQueue = new ImporterQueue();

// channel.onmessage = (event) => {
//   if (event.data && event.data.isReady !== undefined) {
//     taskQueue.updateReadyStatus(event.data.isReady);
//   }
// };

// // Example usage
// taskQueue.addToQueue('link', { from: 'aaa', to: 'bbb' });
