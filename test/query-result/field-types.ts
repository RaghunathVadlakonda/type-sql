import { BOOK, Book } from '../tables/book';
import { CUSTOMER } from '../tables/customer';
import { ORDER } from '../tables/order';
import { sync } from '../utils/utils';
import { QuerySource } from "../../dist";

export default (db: QuerySource) => {

    describe('field types postgres binding', () => {

        it('input/output field types for INSERT, UPDATE, SELECT', sync(async () => {
            await db.table(BOOK).insert({
                title: 'asd',
                author: 'xy',
                price: 10,
                available: true,
                date: new Date('2016-10-23T19:11:25.342Z'),
                data: { x: 2, y: 10 }
            });

            let item = await db.table(BOOK).get(1);
            expect(JSON.stringify(item)).toEqual(JSON.stringify({
                id: 1,
                title: 'asd',
                author: 'xy',
                price: 10,
                available: true,
                date: new Date('2016-10-23T19:11:25.342Z'),
                data: { x: 2, y: 10 }
            }));
            expect(item!.date instanceof Date).toBe(true);

            await db.table(BOOK).update(1, {
                title: 'asdf',
                author: 'xyz',
                price: 11,
                available: false,
                date: new Date('2016-11-23T19:11:25.342Z'),
                data: { x: 3, y: 11 }
            });

            let item2 = await db.table(BOOK).get(1);
            expect(JSON.stringify(item2)).toEqual(JSON.stringify({
                id: 1,
                title: 'asdf',
                author: 'xyz',
                price: 11,
                available: false,
                date: new Date('2016-11-23T19:11:25.342Z'),
                data: { x: 3, y: 11 }
            }));
            expect(item2!.date instanceof Date).toBe(true);
        }));

        it('JSON array', sync(async () => {
            await db.table(BOOK).insert({ title: 'My book', data: [12, { x: 2 }, 'xy'] as any } as Book);
            let data = await db.table(BOOK).get(1);
            expect(data!.data).toEqual([12, { x: 2 }, 'xy']);

            await db.table(BOOK).update(1, { data: [3, 2, 1] as any });
            let data2 = await db.table(BOOK).get(1);
            expect(data2!.data).toEqual([3, 2, 1]);
        }));

        it('ID types', sync(async () => {
            await db.table(BOOK).insert({ id: 12345, title: 'My book' } as Book);
            await db.table(CUSTOMER).insert({ name: 'X Y', email: 'x@y.com' });
            await db.table(ORDER).insert({ bookId: 11, customerId: 'X Y', quantity: 10 });

            let book = await db.table(BOOK).get(12345);
            let customer = await db.table(CUSTOMER).get('X Y');
            let order = await db.table(ORDER).get({ bookId: 11, customerId: 'X Y' });

            expect(book!.id).toBe(12345);
            expect(customer!.name).toBe('X Y');
            expect(order!.bookId).toBe(11);
            expect(order!.customerId).toBe('X Y');
        }));
    });
}
