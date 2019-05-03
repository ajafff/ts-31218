import * as ts from 'typescript';
import * as path from 'path';

const commandLineCache = new Map<string, ts.ParsedCommandLine>();
function getParsedCommandLine(file: string) {
    if (!ts.sys.fileExists(file))
        return;
    let result = commandLineCache.get(file);
    if (result === undefined) {
        const content = ts.sys.readFile(file);
        const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.JSON)
        result = ts.parseJsonSourceFileConfigFileContent(<ts.JsonSourceFile>sourceFile, parseConfigHost, path.dirname(file), undefined, file);
        commandLineCache.set(file, result);
    }
    return result;
};
const parseConfigHost: ts.ParseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
};
const commandLine = getParsedCommandLine('project/tsconfig.json')!;
const compilerHost: ts.CompilerHost = {...ts.createCompilerHost(commandLine.options), getParsedCommandLine};

const program = ts.createProgram({
    host: compilerHost,
    options: commandLine.options,
    projectReferences: commandLine.projectReferences,
    rootNames: commandLine.fileNames,
});
ts.createProgram({
    host: compilerHost,
    options: commandLine.options,
    projectReferences: commandLine.projectReferences,
    rootNames: commandLine.fileNames,
    oldProgram: program,
})