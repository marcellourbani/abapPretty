import { PrettyPrinter } from "@abaplint/core"
import { cli } from "cli-ux"
import {
  ABAPFile,
  MemoryFile,
  Registry,
  ABAPObject,
  Config
} from "@abaplint/core"
import { readFileSync } from "fs"
import { AbapInclude, includeName } from "./abap"

const isAbapObject = (o: any): o is ABAPObject => o instanceof ABAPObject

function parse(name: string, abap: string): ABAPFile {
  const reg = new Registry().addFile(new MemoryFile(name, abap)).parse()
  const objects = [...reg.getObjects()].filter(isAbapObject)
  return objects[0]?.getABAPFiles()[0]
}

let config = Config.getDefault()

export async function loadAbapLintConfig(path: string) {
  try {
    const source = readFileSync(path).toString()
    config = new Config(source)
  } catch (error) {
    cli.error(`Error loading config file ${path}: ${error.toString()}`)
  }
}

export function abapLintprettyPrint(include: AbapInclude, source: string) {
  const name = includeName(include)
  const f = parse(name, source)
  const result = new PrettyPrinter(f, config).run()
  if (source && !result) cli.error(`Abaplint formatting failed for ${name}`)
  return result
}
