import BasicColumn from "./column/basic-column";
import GenericsHelper from "./generics-helper";
import JoinedTablesChain from "./join/joined-tables-chain";


abstract class QueryTable<Entity, Id> {

    constructor(protected _$name: string) {}

    protected _$type: GenericsHelper<Entity>;

    // abstract readonly $id; // FIXME

    $all = new BasicColumn<this, Entity>(this, '*');

    innerJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<this | JoinTable> {
        return new JoinedTablesChain<this | JoinTable>(table, 'inner', this);
    }

    leftJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<this | JoinTable> {
        return new JoinedTablesChain<this | JoinTable>(table, 'left', this);
    }

    rightJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<this | JoinTable> {
        return new JoinedTablesChain<this | JoinTable>(table, 'right', this);
    }

    fullJoin<JoinTable extends QueryTable<any, any>>(table: JoinTable): JoinedTablesChain<this | JoinTable> {
        return new JoinedTablesChain<this | JoinTable>(table, 'full', this);
    }
}

export default QueryTable;
