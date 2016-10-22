import QueryColumnCondition from "./query-column-condition";
import QueryTable from "./query-table";
import ValueColumn from "./value-column";


export default class NumberColumn<Table extends QueryTable<any>> extends ValueColumn<Table, number> {

    constructor(table: Table, params, modifiers?) {
        super(table, params, modifiers);
    }

    lt(value: number) {
        return new QueryColumnCondition<Table, number>(this, 'lt', value);
    }

    gt(value: number) {
        return new QueryColumnCondition<Table, number>(this, 'gt', value);
    }

    lte(value: number) {
        return new QueryColumnCondition<Table, number>(this, 'lte', value);
    }

    gte(value: number) {
        return new QueryColumnCondition<Table, number>(this, 'gte', value);
    }

    sum(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat({ name: 'sum' }));
    }

    avg(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat({ name: 'avg' }));
    }

    min(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat({ name: 'min' }));
    }

    max(): NumberColumn<Table> {
        return new NumberColumn<Table>(this._table, this._params, this._modifiers.concat({ name: 'max' }));
    }

    count(): NumberColumn<Table> {
        return new NumberColumn(this._table, this._params, this._modifiers.concat({ name: 'count' }));
    }
}
