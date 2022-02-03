import { Injectable, Type } from "@nestjs/common";
import { OgmaService } from "@ogma/nestjs-module";
import { Pool } from "pg";
import {
  DatabaseFeatureOptions,
  DatabaseInterface,
  DeleteParams,
  InsertParams,
  JoinParams,
  QueryParams,
  UpdateManyParams,
  UpdateParams,
} from "./interfaces/database.interface";
import { WorkbookService } from "../workbook/workbook.service";

@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  tableName: string;

  constructor(
    private readonly pool: Pool,
    readonly feature: DatabaseFeatureOptions,
    private readonly logger: OgmaService,
    private readonly workbookService: WorkbookService
  ) {
    this.workbookService = new WorkbookService();
    this.tableName = feature.tableName;
  }

  private async executeQuery(query: string) {
    // Add query in worksheet
    await this.workbookService.addRow(query, 1);
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
    return this.executeQuery(query);
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
    const rows = await this.executeQuery(query);
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
    console.log(query);
    const rows = await this.executeQuery(query);
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
    const rows = await this.executeQuery(query);
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

    console.log("QUERY JOIN: ", query);
    return await this.executeQuery(query);
  }

  async updateMany(params: UpdateManyParams): Promise<T[]> {
    const query =
      "UPDATE " +
      this.tableName +
      " AS " +
      params.tableAlias +
      " SET " +
      params.query +
      " FROM " +
      params.tempTable +
      " WHERE " +
      params.where +
      " RETURNING *;";
    return this.executeQuery(query);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(params: DeleteParams): Promise<T> {
    const query =
      "DELETE FROM public." + this.tableName + " WHERE " + params.where;
    console.log(query);
    const rows = await this.executeQuery(query);
    return rows[0];
  }
}
