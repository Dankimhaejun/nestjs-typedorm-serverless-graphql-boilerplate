/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-nested-ternary */
import { Type } from "@nestjs/common";
import { INDEX_TYPE, Table } from "@typedorm/common";
import {
  BatchManager,
  Connection,
  ConnectionOptions,
  EntityManager,
  ScanManager,
} from "@typedorm/core";

import { TypeDormModuleOptions } from "../interfaces";
import { DEFAULT_CONNECTION_NAME } from "../typedorm.constants";

/**
 * This function returns a Connection injection token for the given Connection, ConnectionOptions or connection name.
 * @param {Connection | TypeDormModuleOptions | string} [connection='default'] This optional parameter is either
 * a Connection, or a ConnectionOptions or a string.
 * @returns {string | Function} The Connection injection token.
 */
export function getConnectionToken(
  connection:
    | Connection
    | TypeDormModuleOptions
    | string = DEFAULT_CONNECTION_NAME
): string | Function | Type<Connection> {
  return DEFAULT_CONNECTION_NAME === connection
    ? Connection
    : "string" === typeof connection
    ? `${connection}Connection`
    : DEFAULT_CONNECTION_NAME === connection.name || !connection.name
    ? Connection
    : `${connection.name}Connection`;
}

/**
 * This function returns an EntityManager injection token for the given Connection, ConnectionOptions or connection name.
 * @param {Connection | ConnectionOptions | string} [connection='default'] This optional parameter is either
 * a Connection, or a ConnectionOptions or a string.
 * @returns {string | Function} The EntityManager injection token.
 */
export function getEntityManagerToken(
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME
): string | Function {
  console.log("connection", connection);
  return DEFAULT_CONNECTION_NAME === connection
    ? EntityManager
    : "string" === typeof connection
    ? `${connection}EntityManager`
    : DEFAULT_CONNECTION_NAME === connection.name || !connection.name
    ? EntityManager
    : `${connection.name}EntityManager`;
}

export function getScanManagerToken(
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME
): string | Function {
  return DEFAULT_CONNECTION_NAME === connection
    ? ScanManager
    : "string" === typeof connection
    ? `${connection}ScanManager`
    : DEFAULT_CONNECTION_NAME === connection.name || !connection.name
    ? ScanManager
    : `${connection.name}ScanManager`;
}

export function batchManagerToken(
  connection: Connection | ConnectionOptions | string = DEFAULT_CONNECTION_NAME
): string | Function {
  return DEFAULT_CONNECTION_NAME === connection
    ? BatchManager
    : "string" === typeof connection
    ? `${connection}BatchManager`
    : DEFAULT_CONNECTION_NAME === connection.name || !connection.name
    ? BatchManager
    : `${connection.name}BatchManager`;
}

export function getConnectionName(options: ConnectionOptions) {
  return options && options.name ? options.name : DEFAULT_CONNECTION_NAME;
}

export const masterTable = new Table({
  name: process.env.TABLE_NAME,
  partitionKey: "PK",
  sortKey: "SK",
  indexes: {
    GSI1: {
      type: INDEX_TYPE.GSI,
      partitionKey: "GSI1PK",
      sortKey: "GSI1SK",
    },
    GSI2: {
      type: INDEX_TYPE.GSI,
      partitionKey: "GSI2PK",
      sortKey: "GSI2SK",
    },
    GSI3: {
      type: INDEX_TYPE.GSI,
      partitionKey: "GSI3PK",
      sortKey: "GSI3SK",
    },
  },
});
