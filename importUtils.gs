
function scrubYnabImport() {
  //delete average and total columns
  var sheet = SpreadsheetApp.getActiveSheet();
  deleteAvgAndTotalColumns(sheet);

  //add parent category column to all remaining line items
  addParentCategory(sheet);

  //remove category line items
  deleteParentRecords(sheet);

  moveIncomeToNewSheet(sheet);
  
  convertToAbsoluteValue(sheet);
}

function deleteAvgAndTotalColumns(sheet){
  if(sheet) {
    var maxColumns = sheet.getLastColumn(); 

    if (maxColumns){
      sheet.deleteColumns(maxColumns-1, 2);
    }else{
      Logger.log("no columns");
    }
  } else {
    Logger.log("no sheet found");
  }
}

function addParentCategory(mainSheet){

  mainSheet.insertColumnBefore(1);
  
  var parentHeader = mainSheet.getRange("A1");
  parentHeader.setValue("Parent");
}

function deleteParentRecords(mainSheet) {
  let dataRange = mainSheet.getDataRange();
  let values = dataRange.getValues();

  //lookup master categories
  var masterParentSheet = SpreadsheetApp.getActive().getSheetByName("Master Categories");
  let parentCategories = masterParentSheet.getDataRange().getValues().flat();
  var currentParent = "";

  //iterate over sheet records, skipping title row
  for(var i = 1; i < values.length; i++){
    var row = values[i];

    var parentValue = row[0];
    let categoryValue = row[1];
    
    if(currentParent != categoryValue && parentCategories.includes(categoryValue)){
      currentParent = categoryValue;
    }
    mainSheet.getRange("A"+(i+1)).setValue(currentParent);
  }

  let freshValues = dataRange.getValues();
  var rowsToDelete = [];
  for(var j = 1; j < freshValues.length; j++){
    var row = freshValues[j];
    if(row[0] == row[1]) {
      //delete row
      rowsToDelete.push(j);
    }
  }

  rowsToDelete.reverse();
  rowsToDelete.forEach(rowIndex => {
    mainSheet.deleteRow(rowIndex+1);
  });
}

function moveIncomeToNewSheet(mainSheet){
  var dataRange = mainSheet.getDataRange();

  var rowsToMove = [];
  for(var i = 1; i < dataRange.getNumRows(); i++){
    let row = dataRange.getValues()[i];
    if(row[0] == "All Income Sources"){
      rowsToMove.push(i);
    }
  }

  var incomeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Income 2022");
  if(!incomeSheet){
    incomeSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Income 2022");
  }

  var rangeToMove = mainSheet.getRange(rowsToMove[0], 1, rowsToMove.length, dataRange.getNumColumns());
  rangeToMove.copyTo(incomeSheet.getRange(1, 1, rowsToMove.length, dataRange.getNumColumns()));

  mainSheet.deleteRows(rowsToMove[0]+1, rowsToMove.length);
}

function convertToAbsoluteValue(mainSheet){
  var dataRange = mainSheet.getDataRange();

  var rangeToConvert = mainSheet.getRange(2, 3, dataRange.getNumRows(), dataRange.getNumColumns()-2);
  var values = rangeToConvert.getValues();

  for(var row in values){
    for(var col in values[row]){
      values[row][col] = Math.abs(values[row][col]);
    }
  }

  rangeToConvert.setValues(values);
}
