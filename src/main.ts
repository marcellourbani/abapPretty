import { cli } from "cli-ux"
import { green } from "chalk"

import { expand, AbapObject, AbapInclude } from "./lib/abap"
import { ADTClient, session_types, AdtLock } from "abap-adt-api"
const tick = green("\u2713")

export interface Options {
  test: boolean
  transport?: string
}

const tryLock = async (client: ADTClient, url: string) => {
  try {
    return await client.lock(url)
  } catch (error) {
    if (error.type === "ExceptionResourceNoAccess") return
    throw error
  }
}

async function write(
  client: ADTClient,
  incl: AbapInclude,
  formatted: string,
  lock: AdtLock,
  { test, transport }: Options
) {
  const key = `${incl.type} ${incl.name}`
  if (!lock.LOCK_HANDLE) throw new Error(`Failed to lock ${key}`)
  if (transport && lock.CORRNR && lock.CORRNR !== transport)
    throw new Error(
      `Object ${key} locked in transport ${lock.CORRNR} can't use ${transport}`
    )
  cli.action.start(`\t${key}`, ` Writing...`)
  if (!test)
    await client.setObjectSource(
      incl.sourceUrl,
      formatted,
      lock.LOCK_HANDLE,
      transport
    )
  cli.action.start(`\t${key}`, ` Unlocking...`)
  await client.unLock(incl.sourceUrl, lock.LOCK_HANDLE)
  cli.action.start(`\t${key}`, ` Activating...`)
  if (!test) {
    if (incl.type === "PROG/I") {
      const main = await client.statelessClone.mainPrograms(incl.metaUrl)
      await client.activate(incl.name, incl.sourceUrl, main?.[0]["adtcore:uri"])
    } else await client.activate(incl.name, incl.sourceUrl)
  }
  cli.action.start(`\t${tick}${key}`)
}

async function processInclude(
  client: ADTClient,
  incl: AbapInclude,
  options: Options
) {
  const key = `${incl.type} ${incl.name}`
  cli.action.start(`\t${key}`, ` Reading...`)
  const source = await client.statelessClone.getObjectSource(incl.sourceUrl)
  cli.action.start(`\t${key}`, ` Formatting...`)
  const formatted = await client.statelessClone.prettyPrinter(source)
  if (formatted === source) cli.action.start(`\t${tick}${key} (unchanged)`)
  else {
    cli.action.start(`\t${key}`, ` Locking...`)
    const lock = await tryLock(client, incl.sourceUrl)
    if (lock) {
      await write(client, incl, formatted, lock, options)
    } else cli.action.start(`\t${tick}${key} is generated, skipped`)
  }

  cli.action.stop()
}

export async function processObjects(
  client: ADTClient,
  objects: AbapObject[],
  options: Options
) {
  client.stateful = session_types.stateful
  try {
    for (const o of objects) {
      cli.action.start(`${o.type} ${o.name}`)
      const includes = await expand(client, o)
      cli.action.start(`${tick}${o.type} ${o.name}`)
      cli.action.stop()
      for (const incl of includes) await processInclude(client, incl, options)
    }
  } catch (error) {
    client.stateful = session_types.stateless
    await client.dropSession()
    throw error
  }
}
