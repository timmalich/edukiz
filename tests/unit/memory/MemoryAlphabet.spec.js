import MemoryAlphabet from '@/components/memory/MemoryAlphabet.vue'

describe('MemoryAlphabet', () => {
    let maxLevels = 10;

    it('Correct grids are calculated', () => {
        expect(MemoryAlphabet.data().levels[0]).toEqual({ rows: 1, columns: 2});
        expect(MemoryAlphabet.data().levels[1]).toEqual({ rows: 2, columns: 2});
        expect(MemoryAlphabet.data().levels[2]).toEqual({ rows: 2, columns: 3});
        expect(MemoryAlphabet.data().levels[3]).toEqual({ rows: 3, columns: 4});
        expect(MemoryAlphabet.data().levels[4]).toEqual({ rows: 4, columns: 4});
        expect(MemoryAlphabet.data().levels[5]).toEqual({ rows: 4, columns: 5});
        expect(MemoryAlphabet.data().levels[6]).toEqual({ rows: 5, columns: 6});
        expect(MemoryAlphabet.data().levels[7]).toEqual({ rows: 6, columns: 6});
        expect(MemoryAlphabet.data().levels[8]).toEqual({ rows: 6, columns: 7});
        expect(MemoryAlphabet.data().levels[9]).toEqual({ rows: 7, columns: 8});
        expect(MemoryAlphabet.data().levels[10]).toEqual({ rows: 8, columns: 8});
    });

    it('Number of rows is equal to number of columns or number of columns-1', () => {
        for (let level = 0; level <= maxLevels; level++) {
            let grid = MemoryAlphabet.data().levels[level];
            expect(grid.rows === grid.columns || grid.rows === grid.columns - 1).toEqual(true);
        }
    });

    it('Number of rows * columns is even', () => {
        for (let level = 0; level < 10; level++) {
            let grid = MemoryAlphabet.data().levels[level];
            expect(((grid.rows * grid.columns) % 2) === 0).toBeTruthy();
        }
    });
})
