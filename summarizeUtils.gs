function summarizeActualsByParent() {
  let sheet = SpreadsheetApp.getActiveSheet();

  // create a sheet if it doesn't exist
  var summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary 2022");
  if(!summarySheet) {
    summarySheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Summary 2022");
  }

  // TODO: hardcoded to assume you're on the current import sheet
  let pivotDataRange = sheet.getDataRange();

  // create a pivot table for actuals in that sheet
  var summaryPivotTable = summarySheet.getDataRange().createPivotTable(pivotDataRange);

  //assume first 2 columns are Parent and Category, and the rest of the columns are months
  summaryPivotTable.addRowGroup(1); //group by parent
  summaryPivotTable.addRowGroup(2); //group by category

  //iterate over months/columns
  for(var i = 3; i <= pivotDataRange.getNumColumns(); i++){
      summaryPivotTable.addPivotValue(i, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
  }

  SpreadsheetApp.setActiveSheet(summarySheet);


  // compare to target

}
