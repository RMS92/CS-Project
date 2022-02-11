import { Injectable } from "@nestjs/common";
import { Workbook, Worksheet } from "exceljs";
const excel = require("exceljs");

@Injectable()
export class WorkbookService {
  workbook: Workbook;
  worksheet: Worksheet;

  constructor() {
    this.workbook = new excel.Workbook();

    this.worksheet = this.workbook.addWorksheet("Requêtes");

    this.worksheet.columns = [
      { header: "Input", key: "input" },
      { header: "Requête", key: "request" },
      { header: "Niveau", key: "level" },
    ];

    this.worksheet.columns.forEach((column) => {
      column.width = 50;
    });

    // Make the header bold.
    this.worksheet.getRow(1).font = { bold: true };
  }

  async addRow(input, query: string, level: number): Promise<boolean> {
    await this.worksheet.addRow({
      input: input,
      request: query,
      level: level,
    });
    return true;
  }

  async writeWorkbook(tableName): Promise<void> {
    await this.workbook.csv.writeFile(`Requêtes-${tableName}.csv`);
  }
}
