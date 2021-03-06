import { BOOK, Book } from '../tables/book';
import { ORDER } from '../tables/order';
import { sync } from '../utils/utils';
import { QuerySource } from "../../dist";

export default (db: QuerySource) => {

    describe('SELECT postgres binding', () => {

        it('SELECT empty result', sync(async () => {
            let items = await db.from(BOOK).select();
            expect(Array.isArray(items)).toBe(true);
            expect(items.length).toEqual(0);

            let emptyTitles = await db.from(BOOK).select(BOOK.title);
            expect(Array.isArray(emptyTitles)).toBe(true);
            expect(emptyTitles.length).toEqual(0);
        }));

        it('SELECT entity result', sync(async () => {
            await db.table(BOOK).insert([
                { title: 'Book 1', author: 'xy' },
                { title: 'Book 2', author: 'abc' }
            ]);

            let inserted: Book[] = await db.from(BOOK).select();
            expect(Array.isArray(inserted)).toBe(true);
            expect(inserted.length).toEqual(2);
            expect(JSON.stringify(inserted)).toEqual(JSON.stringify([
                { id: 1, title: 'Book 1', author: 'xy', price: null, available: null, date: null, data: null },
                { id: 2, title: 'Book 2', author: 'abc', price: null, available: null, date: null, data: null }
            ]));
        }));

        it('SELECT entity result with *', sync(async () => {
            await db.table(BOOK).insert([
                { title: 'Book 1', author: 'xy' },
                { title: 'Book 2', author: 'abc' }
            ]);

            let inserted: Book[] = await db.from(BOOK).select(BOOK.$all);
            expect(Array.isArray(inserted)).toBe(true);
            expect(inserted.length).toEqual(2);
            expect(JSON.stringify(inserted)).toEqual(JSON.stringify([
                { id: 1, title: 'Book 1', author: 'xy', price: null, available: null, date: null, data: null },
                { id: 2, title: 'Book 2', author: 'abc', price: null, available: null, date: null, data: null }
            ]));
        }));

        it('SELECT single column result', sync(async () => {
            await db.table(BOOK).insert([
                { title: 'Book 1', author: 'xy' },
                { title: 'Book 2', author: 'abc' }
            ]);

            let titles: string[] = await db.from(BOOK).select(BOOK.title);
            expect(Array.isArray(titles)).toBe(true);
            expect(titles.length).toEqual(2);
            expect(titles).toEqual(['Book 1', 'Book 2']);

            let ids: number[] = await db.from(BOOK).select(BOOK.id);
            expect(Array.isArray(ids)).toBe(true);
            expect(ids.length).toEqual(2);
            expect(ids).toEqual([1, 2]);
        }));

        it('SELECT column selection result', sync(async () => {
            await db.table(BOOK).insert([
                { title: 'Book 1', author: 'xy' },
                { title: 'Book 2', author: 'abc' }
            ]);

            // custom column selection:
            let columns: any[] = await db.from(BOOK).select(BOOK.title, BOOK.author);
            expect(Array.isArray(columns)).toBe(true);
            expect(columns.length).toEqual(2);
            expect(JSON.stringify(columns)).toEqual(JSON.stringify([{ title: 'Book 1', author: 'xy' }, { title: 'Book 2', author: 'abc' }]));
        }));

        it('SELECT joined tables result', sync(async () => {
            await db.table(BOOK).insert([
                { title: 'Book 1', author: 'xy' },
                { title: 'Book 2', author: 'abc' }
            ]);
            await db.table(ORDER).insert([
                { bookId: 1, customerId: '111', quantity: 3 },
                { bookId: 1, customerId: '222', quantity: 1 }
            ]);

            let joined1: any[] = await db.from(BOOK, ORDER).where(BOOK.id.eq(ORDER.bookId)).select();
            expect(Array.isArray(joined1)).toBe(true);
            expect(joined1.length).toEqual(2);
            expect(JSON.stringify(joined1)).toEqual(JSON.stringify([
                { id: 1, title: 'Book 1', author: 'xy', price: null, available: null, date: null, data: null, bookId: 1, customerId: '111', quantity: 3 },
                { id: 1, title: 'Book 1', author: 'xy', price: null, available: null, date: null, data: null, bookId: 1, customerId: '222', quantity: 1 }
            ]));

            let joined2: any[] = await db.from(BOOK.innerJoin(ORDER).on(BOOK.id.eq(ORDER.bookId))).select();
            expect(Array.isArray(joined2)).toBe(true);
            expect(joined2.length).toEqual(2);
            expect(JSON.stringify(joined2)).toEqual(JSON.stringify([
                { id: 1, title: 'Book 1', author: 'xy', price: null, available: null, date: null, data: null, bookId: 1, customerId: '111', quantity: 3 },
                { id: 1, title: 'Book 1', author: 'xy', price: null, available: null, date: null, data: null, bookId: 1, customerId: '222', quantity: 1 }
            ]));
        }));

        it('COUNT', sync(async () => { // PG converts the COUNT values to strings
            let count: number[] = await db.from(BOOK).select(BOOK.$all.count());
            expect(count).toEqual([0]);

            await db.table(BOOK).insert([
                { title: 'Book 1', author: 'xy' },
                { title: 'Book 2', author: 'abc' }
            ]);

            let count2: number[] = await db.from(BOOK).select(BOOK.$all.count());
            expect(count2).toEqual([2]);
        }));
    });
}
