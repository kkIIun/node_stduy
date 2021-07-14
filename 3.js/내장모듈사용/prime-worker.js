const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");

const min = 2;
const max = 10000000;
let primes = [];
console.log(primes.length);

const findPrimes = (start, range) => {
  let isPrime = true;
  let end = start + range;
  for (let i = start; i <= end; i++) {
    for (let j = min; j <= Math.sqrt(i); j++) {
      if (i % j == 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
};

if (isMainThread) {
  const threadCount = 8;
  const threads = new Set();
  let range = Math.ceil((max - min) / threadCount);
  let start = min;
  console.time("prime");
  for (let i = 0; i < threadCount; i++) {
    if (i == threadCount - 1) {
      range = range + ((max - min) % threadCount);
    }
    threads.add(
      new Worker(__filename, {
        workerData: { start, range },
      })
    );
    start += range;
  }
  for (let worker of threads) {
    worker.on("error", (error) => {
      throw error;
    });
    worker.on("exit", () => {
      threads.delete(worker);
      if (threads.size == 0) {
        console.timeEnd("prime");
        console.log(primes.length);
      }
    });
    worker.on("message", (msg) => {
      primes = primes.concat(msg);
    });
  }
} else {
  findPrimes(workerData.start, workerData.range);
  parentPort.postMessage(primes);
}
