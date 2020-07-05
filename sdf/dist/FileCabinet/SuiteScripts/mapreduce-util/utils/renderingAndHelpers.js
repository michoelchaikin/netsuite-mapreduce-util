/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @author Mayer Lench
 */
define(["require", "exports", "N/search", "N/file"], function (require, exports, search, file) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getClient = void 0;
    exports.getClient = () => {
        try {
            const indexFile = file.load({ id: '../client/index.html' });
            const clientFolderPath = indexFile.path.replace('index.html', '');
            const files = getStaticFiles(indexFile.folder, clientFolderPath);
            const html = indexFile.getContents();
            return files.reduce((pre, cur) => {
                return (pre = replaceGlobally(pre, cur.path, cur.url));
            }, html);
        }
        catch (e) {
            throw "Cannot load Client. Please contact app administrator";
        }
    };
    const replaceGlobally = (original, searchTxt, replaceTxt) => {
        const regex = new RegExp(searchTxt, "g");
        return original.replace(regex, replaceTxt);
    };
    const getStaticFiles = (folderId, clientFolderPath) => {
        return search
            .create({
            type: "file",
            filters: [["folder", "anyof", folderId]],
            columns: ["name", "url"],
        })
            .run()
            .getRange({ start: 0, end: 1000 })
            .map((m) => {
            return {
                id: m.id,
                name: m.getValue("name"),
                url: m.getValue("url"),
                path: '/' + file.load({ id: m.id }).path.replace(clientFolderPath, '')
            };
        });
    };
});
