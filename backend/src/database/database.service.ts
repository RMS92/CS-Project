import { Injectable } from "@nestjs/common";
import { OgmaService } from "@ogma/nestjs-module";
import { Pool } from "pg";
import {
  DatabaseFeatureOptions,
  DatabaseInterface,
  DeleteParams,
  InsertParams,
  JoinParams,
  QueryParams,
  UpdateParams,
} from "./interfaces/database.interface";
import { WorkbookService } from "../workbook/workbook.service";
import { ConfigService } from "../config/config.service";
import PromiseMatchers = jest.PromiseMatchers;

@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  tableName: string;

  constructor(
    private readonly pool: Pool,
    readonly feature: DatabaseFeatureOptions,
    private readonly logger: OgmaService,
    private readonly workbookService: WorkbookService,
    private readonly configService: ConfigService
  ) {
    this.configService = new ConfigService({
      useProcess: true,
    });
    this.workbookService = new WorkbookService();
    this.tableName = feature.tableName;
  }

  //----------- Query normal -----------//

  private async executeQuery(query: string, input): Promise<T[]> {
    // Add query in worksheet
    await this.workbookService.addRow(
      input,
      query,
      this.configService.databaseSecurity.securityLevel
    );
    await this.workbookService.writeWorkbook(this.tableName);

    const res = await this.pool.query(query);
    return res.rows;
  }

  async queryAll(params: QueryParams): Promise<T[]> {
    const query =
      "SELECT " +
      params.query +
      " FROM public." +
      this.tableName +
      " " +
      params.where;
    console.log("QUERY: ", query);
    return this.executeQuery(query, [params]);
  }

  async query(params: QueryParams): Promise<T> {
    const query =
      "SELECT " +
      params.query +
      " FROM public." +
      this.tableName +
      " WHERE " +
      params.where;
    console.log("QUERY: ", query);
    const rows = await this.executeQuery(query, params);
    return rows[0];
  }

  async insert(params: InsertParams): Promise<T> {
    const query =
      "INSERT INTO public." +
      this.tableName +
      " (" +
      params.query +
      ") VALUES (" +
      params.where +
      ") RETURNING *;";
    console.log("QUERY: ", query);
    const rows = await this.executeQuery(query, params);
    return rows[0];
  }

  async update(params: UpdateParams): Promise<T> {
    const query =
      "UPDATE public." +
      this.tableName +
      " SET " +
      params.query +
      " WHERE " +
      params.where +
      " RETURNING *;";
    console.log("QUERY: ", query);
    const rows = await this.executeQuery(query, params);
    return rows[0];
  }

  async join(params: JoinParams): Promise<T[]> {
    const query =
      "SELECT " +
      params.query +
      " FROM public." +
      this.tableName +
      " JOIN public." +
      params.join +
      " ON " +
      params.joinCondition +
      params.where;
    console.log("QUERY: ", query);
    return await this.executeQuery(query, params);
  }

  async delete(params: DeleteParams): Promise<T> {
    const query =
      "DELETE FROM public." + this.tableName + " WHERE " + params.where;
    console.log("QUERY: ", query);
    const rows = await this.executeQuery(query, params);
    return rows[0];
  }

  //----------- Prepared statement -----------//
  private async runQuery(
    query: string,
    params: any[],
    queryToSave: string
  ): Promise<T[]> {
    // Don't save records in csv for prepared statements
    await this.workbookService.addRow(params, queryToSave, 3);
    await this.workbookService.writeWorkbook(this.tableName);

    const res = await this.pool.query(query, params);
    return res.rows;
  }

  async preparedQueryAll(params: QueryParams): Promise<T[]> {
    const query =
      "SELECT " +
      params.query +
      " FROM public." +
      this.tableName +
      " " +
      params.where;
    console.log("PREPARED QUERY: ", query);
    const preparedQueryToSave: string = this.saveFormattedPreparedQuery(
      query,
      params.variables
    );
    return this.runQuery(query, params.variables, preparedQueryToSave);
  }

  async preparedQuery(params: QueryParams): Promise<T> {
    const query =
      "SELECT " +
      params.query +
      " FROM public." +
      this.tableName +
      " WHERE " +
      params.where;
    console.log("PREPARED QUERY: ", query);
    const preparedQueryToSave = this.saveFormattedPreparedQuery(
      query,
      params.variables
    );
    const rows = await this.runQuery(
      query,
      params.variables,
      preparedQueryToSave
    );
    return rows[0];
  }

  async preparedInsert(params: InsertParams): Promise<T> {
    const query =
      "INSERT INTO public." +
      this.tableName +
      " (" +
      params.query +
      ") VALUES (" +
      params.where +
      ") RETURNING *;";
    console.log("PREPARED QUERY: ", query);
    const preparedQueryToSave = this.saveFormattedPreparedQuery(
      query,
      params.variables
    );
    const rows = await this.runQuery(
      query,
      params.variables,
      preparedQueryToSave
    );
    return rows[0];
  }

  async preparedUpdate(params: UpdateParams): Promise<T> {
    const query =
      "UPDATE public." +
      this.tableName +
      " SET " +
      params.query +
      " WHERE " +
      params.where +
      " RETURNING *;";
    console.log("PREPARED QUERY: ", query);
    const preparedQueryToSave = this.saveFormattedPreparedQuery(
      query,
      params.variables
    );
    const rows = await this.runQuery(
      query,
      params.variables,
      preparedQueryToSave
    );
    return rows[0];
  }

  async preparedJoin(params: JoinParams): Promise<T[]> {
    const query =
      "SELECT " +
      params.query +
      " FROM public." +
      this.tableName +
      " JOIN public." +
      params.join +
      " ON " +
      params.joinCondition +
      params.where;
    console.log("PREPARED QUERY: ", query);
    const preparedQueryToSave = this.saveFormattedPreparedQuery(
      query,
      params.variables
    );
    return await this.runQuery(query, params.variables, preparedQueryToSave);
  }

  async preparedDelete(params: DeleteParams): Promise<T> {
    const query =
      "DELETE FROM public." + this.tableName + " WHERE " + params.where;
    console.log("PREPARED QUERY: ", query);
    const preparedQueryToSave = this.saveFormattedPreparedQuery(
      query,
      params.variables
    );
    const rows = await this.runQuery(
      query,
      params.variables,
      preparedQueryToSave
    );
    return rows[0];
  }

  private saveFormattedPreparedQuery(query: string, variables: any[]): string {
    let savedQuery = query;
    console.log("oooooooo", savedQuery);
    if (variables.length !== 0) {
      for (let i = 0; i < variables.length; i++) {
        const removeStr = "[$]" + `${i + 1}`;
        const regex = new RegExp(removeStr);
        savedQuery = savedQuery.replace(
          regex,
          typeof variables[i] === "number" ? variables[i] : `'${variables[i]}'`
        );
      }
    } else {
      savedQuery = query;
    }
    return savedQuery;
  }
}
