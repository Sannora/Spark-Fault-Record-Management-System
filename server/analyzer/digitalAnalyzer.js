function analyzeDigitalSignal(timestamps, signalValues) {
  const transitions = [];
  let lastValue = signalValues[0];
  let currentStartTime = timestamps[0];
  const durations = { '0': 0, '1': 0 };
  let changeCount = 0;

  for (let i = 1; i < signalValues.length; i++) {
    const value = signalValues[i];
    const time = timestamps[i];

    if (value !== lastValue) {
      const duration = time - currentStartTime;
      durations[lastValue] += duration;
      transitions.push({
        from: lastValue,
        to: value,
        at: time
      });

      currentStartTime = time;
      lastValue = value;
      changeCount++;
    }
  }

  const finalDuration = timestamps[timestamps.length - 1] - currentStartTime;
  durations[lastValue] += finalDuration;

  return {
    firstValue: signalValues[0],
    lastValue: signalValues[signalValues.length - 1],
    changeCount,
    totalDuration: durations['0'] + durations['1'],
    durations,
    transitions
  };
}

module.exports = analyzeDigitalSignal;
