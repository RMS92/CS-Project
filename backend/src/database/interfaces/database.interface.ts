import { Type } from "@nestjs/common";
import { Observable } from "rxjs";

export interface DatabaseFeatureOptions {
  tableName: string;
}

export interface QueryParams {
  /**
   * The query string using ? or $1 to mark parameters for a parameterized query
   */
  query: string;
  /**
   * Filtering condition on what to query for
   */
  where?: string;
  /**
   * The values to inject into the query at runtime. Helps guard against SQL Injection
   */
  // variables: any[];
}

export interface InsertParams {
  query: string;
  where?: string;
  // variables: any[];
}

export interface UpdateParams {
  query: string;
  where?: string;
  // variables: any[];
}

export interface DeleteParams {
  query: string;
  where: string;
  // variables: any[];
}

export interface JoinParams {
  query: string;
  join: string;
  joinCondition: string;
  where?: string;
}

export interface UpdateManyParams {
  query: string;
  tableAlias: string;
  where?: string;
  tempTable: string;
  variables: any[];
}

export interface DatabaseInterface<T> {
  tableName: string;

  /**
   * method specifically for running queries
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  query(params: QueryParams): Promise<T>;

  /**
   * Method specifically for running inserts
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  insert(params: QueryParams): Promise<T>;

  /**
   * Method specifically for running updates
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  update(params: QueryParams): Promise<T>;

  /**
   * Method specifically for running deletes
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  delete(params: QueryParams): Promise<T>;
}
