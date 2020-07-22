import exprEval from 'expr-eval';
const Parser = exprEval.Parser;


export function getParser() {
    return new Parser();
}


export function getParserReservedWord() {
    return []
        .concat(Object.keys(getParser().binaryOps))
        .concat(Object.keys(getParser().consts))
        .concat(Object.keys(getParser().functions))
        .concat(Object.keys(getParser().unaryOps));
}
