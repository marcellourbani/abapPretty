import { Command } from "@oclif/command"
import { getConnections } from "../../lib/connections"
import { cli } from "cli-ux"

export default class LoginList extends Command {
  static description = "Lists stored connection details"

  static examples = ["$ apapPretty connection"]

  async run() {
    try {
      const connections = getConnections()
      cli.table(connections, {
        id: {},
        baseUrl: {},
        userName: {},
        password: {}
      })
    } catch (error) {
      this.log(error.toString())
    }
  }
}
