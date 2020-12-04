import MemoryGame from '@/components/memory/MemoryGame.vue'

describe('MemoryGame', () => {

    let maxLevels = 11;

    it('Correct grids are calculated', () => {
        expect(MemoryGame.data().levels[0]).toEqual({rows: 1, columns: 2});
        expect(MemoryGame.data().levels[1]).toEqual({rows: 2, columns: 2});
        expect(MemoryGame.data().levels[2]).toEqual({rows: 2, columns: 3});
        expect(MemoryGame.data().levels[3]).toEqual({rows: 3, columns: 4});
        expect(MemoryGame.data().levels[4]).toEqual({rows: 4, columns: 4});
        expect(MemoryGame.data().levels[5]).toEqual({rows: 4, columns: 5});
        expect(MemoryGame.data().levels[6]).toEqual({rows: 5, columns: 6});
        expect(MemoryGame.data().levels[7]).toEqual({rows: 6, columns: 6});
        expect(MemoryGame.data().levels[8]).toEqual({rows: 6, columns: 7});
        expect(MemoryGame.data().levels[9]).toEqual({rows: 7, columns: 8});
        expect(MemoryGame.data().levels[10]).toEqual({rows: 8, columns: 8});
    });

    it('Number of rows is equal to number of columns or number of columns-1', () => {
        for (let level = 0; level < maxLevels; level++) {
            let grid = MemoryGame.data().levels[level];
            expect(grid.rows === grid.columns || grid.rows === grid.columns - 1).toEqual(true);
        }
    });

    it('Number of rows * columns is even', () => {
        for (let level = 0; level < maxLevels; level++) {
            let grid = MemoryGame.data().levels[level];
            expect(((grid.rows * grid.columns) % 2) === 0).toBeTruthy();
        }
    });
})
