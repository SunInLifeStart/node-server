const xl = require('xlsx');
//workbook 对象，指的是整份 Excel 文档。我们在使用 js-xlsx 读取 Excel 文档之后就会获得 workbook 对象。
var workbook =  xl.readFile("E:/Table/excel/aaa.xlsx");
var sheetNames = workbook.SheetNames;
var worksheet = workbook.Sheets[sheetNames[0]];
console.log(workbook,"====");
//返回json数据
var dataa =xl.utils.sheet_to_json(worksheet);
console.log(dataa,"======================");




