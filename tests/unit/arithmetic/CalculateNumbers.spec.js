import {shallowMount} from '@vue/test-utils'
import CalculateNumbers0To18 from '@/components/misc/CalculateNumbers0To18.vue'

jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})

const factory = (values = {}) => {
  return shallowMount(CalculateNumbers0To18, {
    data() {
      return {...values}
    }
  })
}

const expectMaxTotalOfNumbers = function (maxTotal, numbers){
  let sum = numbers[0] + numbers[1];
  if (sum > maxTotal) {
    throw numbers[0] + " + " + numbers[1] + " is greater than " + maxTotal
  }
}

const expectNumbersNotNegative = function (numbers){
  expect(numbers[0]).toBeGreaterThanOrEqual(0)
  expect(numbers[1]).toBeGreaterThanOrEqual(0)
}

describe('CalculateNumbers0To18', () => {
  it('getTwoRandomNumbersHavingATotalOfMaxN returns numbers whose sum is greater than N', () => {
    for (let i = 0; i < 100; i++) {
      let maxTotal = 9;
      expectMaxTotalOfNumbers(maxTotal, CalculateNumbers0To18.methods.getTwoRandomNumbersHavingATotalOfMaxN(maxTotal));
      maxTotal = 5;
      expectMaxTotalOfNumbers(maxTotal, CalculateNumbers0To18.methods.getTwoRandomNumbersHavingATotalOfMaxN(maxTotal));
    }
  });

  it('getTwoRandomNumbersHavingATotalOfMaxN return a number which is lass than N', () => {
    for (let i = 0; i < 100; i++) {
      expectNumbersNotNegative(CalculateNumbers0To18.methods.getTwoRandomNumbersHavingATotalOfMaxN(9));
      expectNumbersNotNegative(CalculateNumbers0To18.methods.getTwoRandomNumbersHavingATotalOfMaxN(5));
    }
  });

  it('increaseLevel increases after 3 finished rounds', () => {
    const wrapper = factory();
    expect(wrapper.vm.$data.selectedLevel).toEqual(1);
    wrapper.vm.levelCompleted();
    wrapper.vm.levelCompleted();
    wrapper.vm.levelCompleted();
    expect(wrapper.vm.$data.finishedRounds).toEqual(3);
    expect(wrapper.vm.$data.selectedLevel).toEqual(2);
  });

  it('increaseLevel cannot increase above maxLevel', () => {
    const wrapper = factory();
    let maxLevel = wrapper.vm.$data.maxLevel;
    let finishedRoundsUntilLevelIncrease = 3;
    expect(maxLevel).toBeGreaterThanOrEqual(6);

    let roundsToBeFinished = maxLevel * finishedRoundsUntilLevelIncrease + 10;
    for (let i = 0; i < roundsToBeFinished; i++) {
      wrapper.vm.levelCompleted();
    }
    expect(wrapper.vm.$data.finishedRounds).toEqual(roundsToBeFinished);
    expect(wrapper.vm.$data.selectedLevel).toEqual(maxLevel);
  });
})
