var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.3,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');

/**
 * 从文档中获取页面信息，调整画布大小，并渲染页面。
 * @param num Page number.
 */
function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport(scale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    // 更新页面计数器
    // document.getElementById('page_num').textContent = num;
}

/**
 * 如果正在进行另一页渲染，则等待直到渲染结束为止。
 * 完成了。否则，立即执行渲染。
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * 上一页
 */
function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

document.getElementById('prev').addEventListener('click', onPrevPage);

// // 首页
// document.getElementById('first').addEventListener('click', function () {
//     queueRenderPage(1);
// });
// // 尾页
// document.getElementById('last').addEventListener('click', function () {
//     queueRenderPage(pdfDoc.numPages);
// });

/**
 * 下一页
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

document.getElementById('next').addEventListener('click', onNextPage);