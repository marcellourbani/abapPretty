import { Command } from "@oclif/command"
import { getConnections, ConnDetails } from "../../lib/connections"
import { cli } from "cli-ux"

export default class LoginList extends Command {
  static description = "Lists stored connection details"

  async run() {
    try {
      const connections = getConnections()
      const opt = (key: keyof ConnDetails, def: any = "") => ({
        get: (x: any) => x[key] || def
      })

      cli.table(connections, {
        id: {},
        baseUrl: {},
        userName: {},
        password: {},
        client: opt("client"),
        nosslvalidation: opt("nosslvalidation", false),
        certPath: opt("certPath")
      })
    } catch (error) {
      this.log(error.toString())
    }
  }
}
