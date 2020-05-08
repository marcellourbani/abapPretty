import { Command } from "@oclif/command"
import { getClient, ALLCOMMONFLAGS, COMMONARGS, logError } from "../lib/common"

import { Main } from "../main"

export default class Pretty extends Command {
  static description =
    "Pretty prints every supported include file in the selected range"

  static examples = [
    "$ abapPretty prettyprint -c MYCONN DEVC/K ZMYPACKAGE",
    "$ abapPretty prettyprint -h host -P port -u user -p password DEVC/K ZMYPACKAGE -t transportnumber",
    `$ SAP_ASHOST=host SAP_PORT=port SAP_USER=user SAP_PASSWORD=bash -c 'abapPretty prettyprint DEVC/K ZMYPACKAGE'`
  ]

  static flags = ALLCOMMONFLAGS

  static args = COMMONARGS

  async run() {
    const { args, flags } = this.parse(Pretty)

    const { objectType = "", objectName = "" } = args
    const client = await getClient(flags)
    const main = new Main(client, flags.abaplint)
    const objects = await main.list(objectType, objectName, flags)
    await main.processObjects(objects, {
      test: false,
      transport: flags.transport
    })
  }
}
