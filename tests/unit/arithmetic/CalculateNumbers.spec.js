import {shallowMount} from '@vue/test-utils'
import CalculateNumbers0_19 from '@/components/arithmetic/CalculateNumbers0_19.vue'

const factory = (values = {}) => {
  return shallowMount(CalculateNumbers0_19, {
    data() {
      return {...values}
    }
  })
}

describe('CalculateNumbers0_19', () => {
  it('getTwoRandomNumbersHavingATotalOfMax9 returns numbers whose sum is greater than 9  ', () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let numbers = CalculateNumbers0_19.methods.getTwoRandomNumbersHavingATotalOfMax9(i, j);
        let sum = numbers[0] + numbers[1];
        console.log(sum)
        if (sum > 9) {
          throw numbers[0] + " + " + numbers[1] + " is greater than 9"
        }
      }
    }
  });
  it('getTwoRandomNumbersHavingATotalOfMax9 return a number which is lass than 0', () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let numbers = CalculateNumbers0_19.methods.getTwoRandomNumbersHavingATotalOfMax9(i, j);
        expect(numbers[0]).toBeGreaterThanOrEqual(0)
        expect(numbers[1]).toBeGreaterThanOrEqual(0)
      }
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
    for (let i = 0; i < roundsToBeFinished; i++){
        wrapper.vm.levelCompleted();
    }
    expect(wrapper.vm.$data.finishedRounds).toEqual(roundsToBeFinished);
    expect(wrapper.vm.$data.selectedLevel).toEqual(maxLevel);
  });
})
