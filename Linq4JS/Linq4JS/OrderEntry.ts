namespace Linq4JS {
    export class OrderEntry{
        Direction: OrderDirection;
        ValueSelector: Function;

        constructor(_direction: OrderDirection, _valueSelector: Function) {
            this.Direction = _direction;
            this.ValueSelector = _valueSelector;
        }
    }

    export enum OrderDirection {
        Ascending, Descending
    }
}