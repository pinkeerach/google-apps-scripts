 function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Parsons Reporting")
    .addItem("Scrub YNAB Import", "scrubImport")
    .addItem("Create Summary", "createSummary")
    .addItem("Normalize to Absolute Values", "convertToAbsValue")
    //.addItem("Move Income", "moveIncome")
    .addToUi();
}

function scrubImport(){
  let ui = SpreadsheetApp.getUi();
  var result = ui.alert("Please confirm", "Are you sure you want to continue this destructive action on the CURRENT sheet?", ui.ButtonSet.YES_NO);

  if(result == ui.Button.YES){
    scrubYnabImport(); //see importUtils.gs
  }else if(result == ui.Button.NO){

  }
}

function createSummary(){
  let ui = SpreadsheetApp.getUi();
  var result = ui.alert("Please confirm", "Are you sure you want to continue this destructive action on the Summary 2024 sheet?", ui.ButtonSet.YES_NO);

  if(result == ui.Button.YES){
    summarizeActualsByParent(); //summarizeUtils.gs 
  }else if(result == ui.Button.NO){

  }
}

function convertToAbsValue(){
  var sheet = SpreadsheetApp.getActiveSheet();
  convertToAbsoluteValue(sheet);
}

function moveIncome(){
  var sheet = SpreadsheetApp.getActiveSheet();
  moveIncomeToNewSheet(sheet);
}