namespace Linq4JS {
    export class OrderEntry{
        Direction: OrderDirection;
        ValueSelector: (item: any) => any;

        constructor(_direction: OrderDirection, _valueSelector: (item: any) => any) {
            this.Direction = _direction;
            this.ValueSelector = _valueSelector;
        }
    }

    export enum OrderDirection {
        Ascending, Descending
    }
}