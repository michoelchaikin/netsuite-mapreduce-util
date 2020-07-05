define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAllResults = void 0;
    exports.getAllResults = (searchObject) => {
        const loop = (searchObject, arr, start) => {
            const range = searchObject.getRange({
                start,
                end: start + 1000,
            });
            // If we don't have all the results loop again
            if (range != null && range.length == 1000)
                return loop(searchObject, arr.concat(range), start + 1000);
            // When we have them all return
            else
                return arr.concat(range);
        };
        return loop(searchObject.run(), [], 0);
    };
});
