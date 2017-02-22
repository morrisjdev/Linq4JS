namespace Linq4JS {
    export class OrderEntry {
        public Direction: OrderDirection;
        public ValueSelector: (item: any) => any;

        constructor(_direction: OrderDirection, _valueSelector: (item: any) => any) {
            this.Direction = _direction;
            this.ValueSelector = _valueSelector;
        }
    }

    export enum OrderDirection {
        Ascending, Descending
    }
}