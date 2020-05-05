import { flags } from "@oclif/command"
import { ConnDetails } from "./connections"
import { cli } from "cli-ux"
import { ADTClient } from "abap-adt-api"

export const PASSWORDFLAG = {
  password: flags.string({
    char: "p",
    description: "Password",
    default: ""
  })
}

export const RECURSIVEFLAG = {
  recursive: flags.boolean({
    char: "r",
    description: "Password",
    default: false
  })
}

export const TRANSPORT = {
  transport: flags.string({
    char: "t",
    description: "Transport",
    default: ""
  })
}

export const COMMONFLAGS = { ...PASSWORDFLAG, ...RECURSIVEFLAG }
export const ALLCOMMONFLAGS = {
  ...PASSWORDFLAG,
  ...RECURSIVEFLAG,
  ...TRANSPORT
}
export const COMMONARGS = [
  {
    name: "id",
    required: true,
    description: "connection ID"
  },
  {
    name: "objectType",
    required: true,
    description: "Base object type"
  },
  {
    name: "objectName",
    required: true,
    description: "Base object name"
  }
]
export async function getClient(conn: ConnDetails, password: string) {
  password =
    password ||
    conn.password ||
    (await cli.prompt(`Password for user ${conn.userName} on ${conn.baseUrl}`, {
      type: "hide"
    }))
  const client = new ADTClient(conn.baseUrl, conn.userName, password)
  await client.login() // trigger connection errror on bad details
  return client
}
