const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    comparator(testA, testB) {
        if (!testA.order) {
            return -1;
        }
        if (!testB.order) {
            return 1;
        }
        return testA.order > testB.order ? 1 : -1;
    }
    sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort(comparator);
    }
}

module.exports = CustomSequencer;