import { shallowMount } from '@vue/test-utils'
import CalculateNumbers0_19 from '@/components/arithmetic/CalculateNumbers0_19.vue'

const factory = (values = {}) => {
    return shallowMount(CalculateNumbers0_19, {
        data () {
            return {...values}
        }
    })
}

describe('CalculateNumbers0_19', () => {
    it('getRandomNumbersSumIsMax9 returns numbers whose sum is greater than 9  ', () => {
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                let numbers = CalculateNumbers0_19.methods.reduceNumbersSoSumIsMax9(i, j);
                let sum = numbers[0] + numbers[1];
                if(sum > 9){
                    throw numbers[0] + " + " + numbers[1] + " is greater than 9"
                }
            }
        }
    });
    it('getRandomNumbersSumIsMax9 return a number which is lass than 0', () => {
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                let numbers = CalculateNumbers0_19.methods.reduceNumbersSoSumIsMax9(i, j);
                expect(numbers[0]).toBeGreaterThanOrEqual(0)
                expect(numbers[1]).toBeGreaterThanOrEqual(0)
            }
        }
    });
})
