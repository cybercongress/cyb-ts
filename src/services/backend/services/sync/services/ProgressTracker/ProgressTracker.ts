import { ProgressTracking } from 'src/services/backend/types/services';

const ROLLING_WINDOW = 10;

type onProgressUpdateFunc = (progress: ProgressTracking) => void;

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export class ProgressTracker {
  private timestamps: number[] = [];

  private totalRequests = 0;

  private completedRequests = 0;

  private onProgressUpdate?: onProgressUpdateFunc;

  constructor(onProgressUpdate?: onProgressUpdateFunc) {
    this.onProgressUpdate = onProgressUpdate;
  }

  public start(totalRequests: number) {
    this.totalRequests = totalRequests;
    this.timestamps = [];
    this.completedRequests = 0;

    // add inital timestamp
    this.addTimestamp();
  }

  private addTimestamp() {
    const now = Date.now();
    this.timestamps.push(now);
  }

  public trackProgress() {
    this.addTimestamp();

    if (this.timestamps.length > ROLLING_WINDOW) {
      this.timestamps.shift();
    }

    // if (this.timestamps.length > 1) {
    const averageTime = this.calculateAverageTime();
    const remainingRequests = this.totalRequests - this.completedRequests;
    const estimatedRemainingTime = averageTime * remainingRequests;

    const progress = {
      totalCount: this.totalRequests,
      completeCount: this.completedRequests + 1,
      estimatedTime: estimatedRemainingTime,
    };
    // Call the callback function with the estimated remaining time
    this.onProgressUpdate && this.onProgressUpdate(progress);
    // }

    this.completedRequests++;

    return progress;
  }

  private calculateAverageTime(): number {
    let totalDiff = 0;
    for (let i = 1; i < this.timestamps.length; i++) {
      totalDiff += this.timestamps[i] - this.timestamps[i - 1];
    }
    return totalDiff / (this.timestamps.length - 1);
  }
}

// Usage example (in another file)
// import { ProgressTracker } from './progressTracker';

// const onProgressUpdate = (estimatedTime: number) => {
//     console.log(`Estimated remaining time: ${estimatedTime} seconds`);
// };

// const tracker = new ProgressTracker(1000, onProgressUpdate);
// const requestHandler = () => tracker.handleRequest(requestHandler);
// requestHandler();
