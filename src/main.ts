import { jsCodegen } from "@/codegen/js_codegen";
import { parse } from "@/parser/parser";
import { tokenize } from "@/tokenizer/tokenizer";
import fs from "fs";
import { exit } from "process";

if (process.argv.length < 3) {
    console.log("Butuh input file")
    exit(1)
}

if (process.argv.length < 4) {
    console.log("Butuh output file")
    exit(1)
}

const inputPath = process.argv[2]
const outPath = process.argv[3]

const content = fs.readFileSync(inputPath).toString()
const tokens = tokenize(content, inputPath)
const ast = parse(tokens)
const output = jsCodegen(ast)
fs.writeFileSync(outPath, output)