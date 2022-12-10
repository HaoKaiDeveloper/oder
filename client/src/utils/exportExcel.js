import ExcelJs from "exceljs";

async function exportData(orders, statisticData) {
  const workbook = new ExcelJs.Workbook(); // 創建試算表檔案
  const sheet = workbook.addWorksheet("所有訂單");
  const sheet2 = workbook.addWorksheet("今日商品統計");
  const sheet3 = workbook.addWorksheet("每月訂單累計");
  const sheet4 = workbook.addWorksheet("每月商品累計");
  const sheet5 = workbook.addWorksheet("今日已結帳訂單");
  const orderRow = [
    "Id",
    "姓名",
    "電話",
    "Email",
    "收貨方式",
    "地址",
    "付款方式",
    "總金額",
    "完成狀態",
    "購買時間",
    "結帳時間",
  ];
  const orderColumn = [
    { key: "_id", width: 30 },
    { key: "clientName", width: 30 },
    { key: "clientPhone", width: 30 },
    { key: "clientEmail", width: 30 },
    { key: "delivery", width: 20 },
    { key: "clientAddress", width: 30 },
    { key: "payment", width: 20 },
    { key: "total", width: 30 },
    { key: "completed", width: 20 },
    { key: "createdAt", width: 30 },
    { key: "paidTime", width: 30 },
  ];

  //在檔案中新增工作表 參數放自訂名稱
  sheet.getRow(1).values = orderRow;
  sheet2.getRow(1).values = ["商品名稱", "分類", "單價", "數量", "總計"];
  sheet3.getRow(1).values = ["月份", "訂單數", "付款狀態"];
  sheet4.getRow(1).values = [
    "月份",
    "商品名稱",
    "分類",
    "單價",
    "數量",
    "總計",
  ];
  sheet5.getRow(1).values = orderRow;
  // 寬度的關鍵在於width
  sheet.columns = orderColumn;
  sheet2.columns = [
    { key: "productName", width: 30 },
    { key: "category", width: 30 },
    { key: "price", width: 30 },
    { key: "amount", width: 30 },
    { key: "total", width: 30 },
  ];
  sheet3.columns = [
    { key: "date", width: 20 },
    { key: "orderNum", width: 20 },
    { key: "payment", width: 30 },
  ];
  sheet4.columns = [
    { key: "date", width: 20 },
    { key: "productName", width: 30 },
    { key: "category", width: 30 },
    { key: "price", width: 30 },
    { key: "amount", width: 30 },
    { key: "total", width: 30 },
  ];
  sheet5.columns = orderColumn;

  const sheetData = orders;
  const sheet2Data = statisticData.products;
  const sheet3Data = statisticData.allData;
  const seet5Data = statisticData.paidOrders;
  let tempArr = [];

  statisticData.allData.map((d) => {
    let tempObj = {};
    d.products.map((p) => {
      tempObj = {
        date: d.date,
        ...p,
      };
      tempArr = [...tempArr, tempObj];
    });
  });
  const sheet4Data = tempArr;

  sheet.addRows(sheetData);
  sheet2.addRows(sheet2Data);
  sheet3.addRows(sheet3Data);
  sheet4.addRows(sheet4Data);
  sheet5.addRows(seet5Data);

  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement("a");
    const blobData = new Blob([content], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    link.download = "訂單及統計.xlsx";
    link.href = URL.createObjectURL(blobData);
    link.click();
  });
}

export { exportData };
