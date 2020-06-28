import { Type } from "N/search";
import { FieldValue } from "N/record";

interface SearchLookupFieldsOptions {
    type: Type | string;
    id: FieldValue | string | number;
    columns: (string | string[]);
}

interface SearchResultSetGetRangeOptions {
    start: number;
    end: number;
}