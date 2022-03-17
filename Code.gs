function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Parsons Reporting")
    .addItem("Scrub YNAB Import", "scrubImport")
    .addItem("Create Summary", "createSummary")
    .addToUi();
}

function scrubImport(){
  let ui = SpreadsheetApp.getUi();
  var result = ui.alert("Please confirm", "Are you sure you want to continue this destructive action on the current sheet?", ui.ButtonSet.YES_NO);

  if(result == ui.Button.YES){
    scrubYnabImport(); //see importUtils.gs
  }else if(result == ui.Button.NO){

  }
}

function createSummary(){
  let ui = SpreadsheetApp.getUi();
  var result = ui.alert("Please confirm", "Are you sure you want to continue this destructive action on the current sheet?", ui.ButtonSet.YES_NO);

  if(result == ui.Button.YES){
    summarizeActualsByParent(); //summarizeUtils.gs 
  }else if(result == ui.Button.NO){

  }
}
