namespace Linq4JS {
    export class SelectEntry {
        public property: string;
        public name: string;

        constructor(n: string, p: string) {
            this.name = n;
            this.property = p;
        }
    }
}