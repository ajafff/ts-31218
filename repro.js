"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
var commandLineCache = new Map();
function getParsedCommandLine(file) {
    if (!ts.sys.fileExists(file))
        return;
    var result = commandLineCache.get(file);
    if (result === undefined) {
        var content = ts.sys.readFile(file);
        var sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.JSON);
        result = ts.parseJsonSourceFileConfigFileContent(sourceFile, parseConfigHost, path.dirname(file), undefined, file);
        commandLineCache.set(file, result);
    }
    return result;
}
;
var parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
};
var commandLine = getParsedCommandLine('project/tsconfig.json');
var compilerHost = __assign({}, ts.createCompilerHost(commandLine.options), { getParsedCommandLine: getParsedCommandLine });
var program = ts.createProgram({
    host: compilerHost,
    options: commandLine.options,
    projectReferences: commandLine.projectReferences,
    rootNames: commandLine.fileNames
});
ts.createProgram({
    host: compilerHost,
    options: commandLine.options,
    projectReferences: commandLine.projectReferences,
    rootNames: commandLine.fileNames,
    oldProgram: program
});
