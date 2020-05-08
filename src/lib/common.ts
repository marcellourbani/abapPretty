import { flags } from "@oclif/command"
import { getConnection } from "./connections"
import { cli } from "cli-ux"
import { ADTClient, createSSLConfig } from "abap-adt-api"
import chalk = require("chalk")

export interface LoginData {
  connectionId?: string
  client?: string
  password?: string
  ashost?: string
  port?: number
  user?: string
  ssl?: boolean
  "skip-ssl-validation"?: string
  certPath?: string
}

export interface ListOptions {
  recursive: boolean
  file: string
}

export const ABAPLINT_DEFAULT = "<default>"

export const RECURSIVEFLAG = {
  recursive: flags.boolean({
    char: "r",
    description: "Expand subpackages",
    default: false
  })
}

const PPONLYFLAGS = {
  transport: flags.string({
    char: "t",
    description: "Transport",
    default: ""
  }),
  abaplint: flags.string({
    char: "a",
    description: `Format using abapLint config file.\nIf left blank or set to ${ABAPLINT_DEFAULT} the default configuration will be used`,
    parse: x => x || ABAPLINT_DEFAULT
  }),
  file: flags.string({
    char: "f",
    description: "File with a list of objects to process",
    default: ""
  })
}

const LOGINOPTS = {
  connectionId: flags.string({
    char: "c",
    required: false,
    description: "connection ID"
  }),
  ashost: flags.string({
    char: "h",
    description: "SAP hostname",
    env: "SAP_ASHOST"
  }),
  port: flags.integer({
    char: "P",
    description: "Port to connect to",
    env: "SAP_PORT"
  }),
  user: flags.string({ char: "u", description: "Username", env: "SAP_USER" }),
  client: flags.string({
    char: "C",
    description: "SAP client to connect to",
    env: "SAP_CLIENT"
  }),
  ssl: flags.boolean({
    default: true,
    description: "use SSL (default)",
    allowNo: true
  }),
  "skip-ssl-validation": flags.string({
    char: "s",
    description: "Don't validate SSL certificate - DANGEROUS"
  }),
  certPath: flags.string({
    description: "Path to SSL certificate",
    env: "SAP_SSL_SERVER_CERT"
  }),
  password: flags.string({
    char: "p",
    description: "Password",
    env: "SAP_PASSWORD",
    default: ""
  })
}

export const COMMONFLAGS = { ...RECURSIVEFLAG, ...LOGINOPTS }
export const ALLCOMMONFLAGS = {
  ...COMMONFLAGS,
  ...PPONLYFLAGS
}

export const COMMONARGS = [
  {
    name: "objectType",
    required: false,
    default: "",
    description: "Base object type"
  },
  {
    name: "objectName",
    required: false,
    default: "",
    description: "Base object name"
  }
]
async function getClientInt(data: LoginData) {
  if (data.ashost && data.port) {
    if (!data.user || !data.password)
      cli.error("User and password are mandatory unless using connectionIds")

    const nossl = !data.ssl || process.env.SAP_SSL?.match(/^no|off|false$/i)
    const nosslValid =
      data["skip-ssl-validation"] || process.env.SAP_SSL_VERIFY === "no"
    const config = createSSLConfig(!!nosslValid, data.certPath)
    return new ADTClient(
      `http${nossl ? "" : "s"}://${data.ashost}:${data.port}`,
      data.user,
      data.password,
      data.client,
      undefined,
      config
    )
  }

  if (!data.connectionId) cli.error("No connection details provided")
  const conn = getConnection(data.connectionId)
  if (!conn) cli.error(`Invalid connection id ${data.connectionId}`)
  const password =
    data.password ||
    conn.password ||
    (await cli.prompt(`Password for user ${conn.userName} on ${conn.baseUrl}`, {
      type: "hide"
    }))
  const config = createSSLConfig(!!conn.nosslvalidation, conn.certPath)
  return new ADTClient(
    conn.baseUrl,
    conn.userName,
    password,
    data.client,
    undefined,
    config
  )
}

export async function getClient(data: LoginData) {
  const client = await getClientInt(data)
  await client.login() // trigger connection errror on bad details
  return client
}
