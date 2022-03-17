function summarizeActualsByParent() {
  // create a sheet if it doesn't exist
  var summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary 2022");
  if(!summarySheet) {
    summarySheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Summary 2022");
  }

  // TODO: hardcoded to assume you're on the current import sheet
  createPivotTable(summarySheet);

  // compare to target
}

function createPivotTable(summarySheet){
  let pivotDataRange = SpreadsheetApp.getActiveSheet().getDataRange();

  // create a pivot table for actuals in that sheet
  var summaryPivotTable = summarySheet.getDataRange().createPivotTable(pivotDataRange);

  //assume first 2 columns are Parent and Category, and the rest of the columns are months
  summaryPivotTable.addRowGroup(1); //group by parent
  summaryPivotTable.addRowGroup(2); //group by category

  //iterate over months/columns
  for(var i = 3; i <= pivotDataRange.getNumColumns(); i++){
      var monthColumn = summaryPivotTable.addPivotValue(i, SpreadsheetApp.PivotTableSummarizeFunction.SUM);
      //var percentColumn = summaryPivotTable.addPivotValue(i, SpreadsheetApp.PivotTableSummarizeFunction.SUM).showAs(SpreadsheetApp.PivotValueDisplayType.PERCENT_OF_COLUMN_TOTAL);
      //percentColumn.setDisplayName("Percent of " + pivotDataRange.getCell(1, i).getValue());
  }

  SpreadsheetApp.setActiveSheet(summarySheet);

}

function addTargetToRawData() {
  let targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Target Budget 2022");
  let targetDataRange = targetSheet.getDataRange();

  var actualsSheet = SpreadsheetApp.getActiveSheet();
  var actualsDataRange = actualsSheet.getDataRange();
  var actualsValues = actualsDataRange.getValues();

  actualsSheet.insertColumnAfter(actualsDataRange.getNumColumns());

  actualsSheet.getRange(1, actualsDataRange.getNumColumns()+1).setValue("2022 Target");

  for(var targetRowCount = 1; targetRowCount < targetDataRange.getNumRows(); targetRowCount++){
    //check raw sheet to see if row exists
    let targetRow = targetDataRange.getValues()[targetRowCount];

    for(var i = 1; i < actualsValues.length; i++){
      let actualsRow = actualsValues[i];

      if(targetRow[0] == actualsRow[0] && targetRow[1] == actualsRow[1]){
        actualsSheet.getRange(i+1, actualsDataRange.getNumColumns()+1).setValue(targetRow[2]);
      }
    }
    
    //if it does, add target value to column

    //if it doesn't, add a row with 0s for each month and add target value to column
  }
}

