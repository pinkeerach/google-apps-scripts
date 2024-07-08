
function scrubYnabImport() {
  //delete average and total columns
  var sheet = SpreadsheetApp.getActiveSheet();

  insertParentColumn(sheet);
  deleteParentRecords(sheet);
  deleteAverageColumn(sheet);

  moveIncomeToNewSheet(sheet);
  //convertToAbsoluteValue(sheet); //for cashflow, need positive/negatives
}

function deleteAverageColumn(sheet){
  if(sheet) {
    var maxColumns = sheet.getLastColumn();
    var columnsRange = sheet.getDataRange();

    if (maxColumns){
      for(var i = 1; i < maxColumns; i++){

        var columnTitle = columnsRange.getCell(1,i).getValue();

        if(columnTitle == "Average"){
          sheet.deleteColumns(i, 1);
          break;
        }
      }
    }else{
      Logger.log("no columns");
    }
  } else {
    Logger.log("no sheet found");
  }
}

function insertParentColumn(mainSheet){
  mainSheet.insertColumnAfter(1);
  mainSheet.getRange("A1").setValue("Parent Category");
  mainSheet.getRange("B1").setValue("Category");

  let dataRange = mainSheet.getDataRange();
  let values = dataRange.getValues();

  //lookup master categories
  var masterParentSheet = SpreadsheetApp.getActive().getSheetByName("Master Categories");
  let parentCategories = masterParentSheet.getDataRange().getValues().flat();
  var currentParent = "";

  //iterate over sheet records, skipping title row
  for(var i = 1; i < values.length; i++){
    var row = values[i];

    var categoryValue = row[0];
    
    if(currentParent != categoryValue && parentCategories.includes(categoryValue)){
      currentParent = categoryValue;
    }
    mainSheet.getRange("A"+(i+1)).setValue(currentParent);
    mainSheet.getRange("B"+(i+1)).setValue(categoryValue);
  }

}

function deleteParentRecords(mainSheet) {
  let dataRange = mainSheet.getDataRange();
  let values = dataRange.getValues();

  var rowsToDelete = [];

  for(var j = 1; j < values.length; j++){
    var row = values[j];
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
    }else{
      break;
    }
  }

  //number of columns needs to exclude the total column
  var numberOfColumns = dataRange.getNumColumns()-1;
  var rangeToMove = mainSheet.getRange(2, 1, rowsToMove.length, numberOfColumns);
  rangeToMove.activate();

  var incomeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Income2024");
  //hardcoding range on the income sheet for now
  var incomeSheetRange = incomeSheet.getRange(13, 2, rowsToMove.length, numberOfColumns);
  rangeToMove.copyTo(incomeSheetRange);

  mainSheet.deleteRows(2, rowsToMove.length);
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