 function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Parsons Reporting")
    .addItem("Scrub YNAB Import", "scrubImport")
    .addToUi();
}

function scrubImport(){
  scrubYnabImport(); //see budgetUtils.gs
}

