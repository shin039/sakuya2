// -----------------------------------------------------------------------------
//  Constant Definition
// -----------------------------------------------------------------------------
import { saveAs } from 'file-saver';


// Excel Download For Client Side
export const downloadExcel = (workbook /* exceljs.workbook object*/, filename) => {
    workbook.xlsx.writeBuffer().then(function(data) {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}.xlsx`);
    });
}
