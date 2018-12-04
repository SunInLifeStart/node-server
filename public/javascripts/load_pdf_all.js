//创建
function createPdfContainer(id,className) {

    var pdfContainer = document.getElementById('the-canvas');
    var canvasNew =document.createElement('canvas');
    canvasNew.id = id;
    canvasNew.className = className;
    pdfContainer.appendChild(canvasNew);
};
//渲染pdf
//建议给定pdf宽度
function renderPDF(pdf,i,id) {
    pdf.getPage(i).then(function(page) {
        var scale = 1.25;
        var viewport = page.getViewport(scale);
        //  准备用于渲染的 canvas 元素
        var canvas = document.getElementById(id);
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width
        // 将 PDF 页面渲染到 canvas 上下文中
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        console.log(context);
        page.render(renderContext);
    });
};
//创建和pdf页数等同的canvas数
function createSeriesCanvas(num,template) {
    var id = '';
    for(var j = 1; j <= num; j++){
        id = template + j;
        createPdfContainer(id,'pdfClass');
    }
}
//读取pdf文件，并加载到页面中
function loadPDF(fileURL) {
    pdfjsLib.getDocument(fileURL).then(function(pdf) {
        //用 promise 获取页面
        var id = '';
        var idTemplate = 'cw-pdf-';
        var pageNum = pdf.numPages;
        //根据页码创建画布
        createSeriesCanvas(pageNum,idTemplate);
        //将pdf渲染到画布上去
        for (var i = 1; i <= pageNum; i++) {
            id = idTemplate + i;
            renderPDF(pdf,i,id);
        }
    });
}
// loadPDF('1109.pdf');