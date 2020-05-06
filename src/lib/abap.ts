/* eslint-disable operator-linebreak */
import { ADTClient, Node, isClassStructure } from "abap-adt-api"

export const PACKAGE = "DEVC/K"
const PACKAGETYPE = { desc: "Package", type: PACKAGE }
export const treatableTypes = [
  { desc: "Class", type: "CLAS/OC" },
  { desc: "FunctionFroup", type: "FUGR/F" },
  { desc: "Interface", type: "INTF/OI" },
  { desc: "Include", type: "PROG/I" },
  { desc: "Program", type: "PROG/P" }
]
export const supportedTypes = [PACKAGETYPE, ...treatableTypes]

export interface AbapObject {
  type: string
  name: string
  url: string
}

export interface AbapInclude {
  type: string
  name: string
  metaUrl: string
  sourceUrl: string
}
const follow = (base: string, next: string) => {
  if (next.startsWith("/")) return next
  if (next.startsWith("./")) {
    const rest = next.substr(2)
    return base.endsWith("/")
      ? `${base}${rest}`
      : `${base.replace(/\/[^/]*$/, "/")}${rest}`
  }

  return `${base.replace(/\$/, "")}/${next}`
}

export type Notifier = (message: string) => void
const fromObject = (o: AbapObject, url: string): AbapInclude => {
  const { type, name, url: metaUrl } = o

  return { type, name, metaUrl, sourceUrl: follow(metaUrl, url) }
}

const canProcess = (n: Node) =>
  n.OBJECT_URI &&
  n.OBJECT_NAME &&
  treatableTypes.find(t => t.type === n.OBJECT_TYPE)

const supportedType = (type: string) =>
  !!supportedTypes.find(t => t.type === type)

const fromNode = (n: Node) => ({
  type: n.OBJECT_TYPE,
  name: n.OBJECT_NAME,
  url: n.OBJECT_URI
})

async function expandPackage(
  client: ADTClient,
  name: string,
  notifier: Notifier,
  recursive: boolean
) {
  const objects: AbapObject[] = []
  notifier(`Expanding package ${name}`)
  const { nodes } = await client.statelessClone.nodeContents(PACKAGE, name)
  const children = nodes.filter(canProcess).map(fromNode)
  objects.push(...children)
  if (recursive)
    for (const child of nodes.filter(
      n => n.OBJECT_TYPE === PACKAGE && n.OBJECT_NAME
    )) {
      const granchildren = await expandPackage(
        client,
        child.OBJECT_NAME,
        notifier,
        recursive
      )
      objects.push(...granchildren)
    }
  return objects
}

export async function list(
  client: ADTClient,
  type: string,
  name: string,
  notifier: Notifier,
  recursive = false
) {
  if (!supportedType(type)) throw new Error(`Type ${type} is not supported`)

  const list = await client.statelessClone.searchObject(name, type)
  const found = list.find(
    c => c["adtcore:type"] === type && c["adtcore:name"] === name
  )
  if (!found) throw new Error(`Object ${type} ${name} not found`)
  switch (type) {
    case PACKAGE:
      return expandPackage(client, name, notifier, recursive)
    default:
      return [{ type, name, url: found["adtcore:uri"] }]
  }
}

async function expandClass(client: ADTClient, base: AbapObject) {
  const stru = await client.statelessClone.objectStructure(base.url)
  if (isClassStructure(stru))
    return stru.includes.map(i => {
      const url =
        i.links.find(
          l =>
            l.rel === "http://www.sap.com/adt/relations/source" &&
            l.type === "text/plain"
        )?.href || i["abapsource:sourceUri"]

      return {
        name: `${base.name} ${i["class:includeType"]}`,
        type: i["adtcore:type"],
        metaUrl: base.url,
        sourceUrl: follow(base.url, url)
      }
    })
  return []
}

async function expandFunc(client: ADTClient, name: string, metaUrl: string) {
  const { nodes } = await client.statelessClone.nodeContents("FUGR/F", name)
  const [ns = "", base = ""] = name.match(/(\/[^/]+\/)?(.*)/)?.slice(1) || []
  const prefix = `${ns}L${base}`
  const goodInclude = (n: string) => n.startsWith(prefix) && !n.endsWith("UXX")
  const filtFunc = (n: Node) =>
    (n.OBJECT_NAME && n.OBJECT_TYPE === "FUGR/FF") ||
    (n.OBJECT_TYPE === "FUGR/I" && goodInclude(n.OBJECT_NAME))
  const children: AbapInclude[] = []

  for (const n of nodes.filter(filtFunc)) {
    const structure = await client.statelessClone.objectStructure(n.OBJECT_URI)
    const sourceUrl = ADTClient.mainInclude(structure, true)
    children.push({
      type: n.OBJECT_TYPE,
      name: n.OBJECT_NAME,
      sourceUrl,
      metaUrl
    })
  }
  return children
}

export async function expand(client: ADTClient, base: AbapObject) {
  switch (base.type) {
    case "CLAS/OC":
      return expandClass(client, base)
    case "FUGR/F":
      return expandFunc(client, base.name, base.url)
  }
  const structure = await client.statelessClone.objectStructure(base.url)
  const url = ADTClient.mainInclude(structure, true)
  return [fromObject(base, url)]
}
