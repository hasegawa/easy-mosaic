var image; // 画像イメージ
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var rectanglePosition = {x1: 0,y1: 0,x2: 0, y2: 0}; // canvas上に描画する選択範囲の座標
var downloadLink = document.getElementById('download')

// ファイルアップロードとcanvas描画に関係する箇所
document.getElementById("inputFile").addEventListener("change", function (event) {
    var file = event.target.files;
    var reader = new FileReader();
    reader.readAsDataURL(file[0])
    reader.onload = function () {
    image = new Image();
    image.src = reader.result;
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image,0,0);
    }
    }
});
// マウス押下時
function mouseDown(event) {
    var canvasElementPotision = event.target.getBoundingClientRect();
    // canvas要素のページ内での座標を補正
    rectanglePosition.x1 = event.clientX - canvasElementPotision.x;
    rectanglePosition.y1 = event.clientY - canvasElementPotision.y;
    canvas.addEventListener("mousemove", mouseMove);
}
canvas.addEventListener("mousedown", mouseDown);
// マウス押下&移動時
function mouseMove(event) {
    // 画像ファイルを再描画してその上に選択範囲を描画
    context.drawImage(image, 0,0);
    var canvasElementPotision = event.target.getBoundingClientRect();
    // 移動時も同様にcanbas要素のページ内での座標を補正
    rectanglePosition.x2 = event.layerX - rectanglePosition.x1 - canvasElementPotision.x;
    rectanglePosition.y2 = event.layerY - rectanglePosition.y1 - canvasElementPotision.y;
    context.lineWidth = 3;
    context.strokeStyle =  "rgb(181, 255, 20)";
    context.strokeRect(rectanglePosition.x1, rectanglePosition.y1, rectanglePosition.x2, rectanglePosition.y2);
}
// マウス押下終了時
function mouseUp(event) {
    // 元の画像ファイルを再描画してマウス移動時に描画していた選択範囲を消去
    context.drawImage(image, 0, 0);
    // モザイクフィルターAPIへリクエスト
    postFilter();
    // 選択範囲のリセット
    rectanglePosition = {x1: 0, y1: 0, x2: 0, y2: 0};
    canvas.removeEventListener("mousemove", mouseMove);
}
canvas.addEventListener("mouseup", mouseUp);

function postFilter() {
    // x座標は右へマウスを動かした時はそのままの値でよいが左に動かした時は計算が必要
    if (rectanglePosition.x2 > 0) {
        startXPosition = rectanglePosition.x1;
        width = rectanglePosition.x2;
    } else {
        startXPosition = rectanglePosition.x1 + rectanglePosition.x2;
        width = rectanglePosition.x2 * -1;
    }
    // y座標についても同様の計算を行う
    if (rectanglePosition.y2 > 0) {
        startYPosition = rectanglePosition.y1;
        height = rectanglePosition.y2;
    } else {
        startYPosition = rectanglePosition.y1 + rectanglePosition.y2;
        height = rectanglePosition.y2 * -1;
    }
    // 'data:image/png;base64,Base64文字列の形式のためsplitしてBase64文字列のみ取り出す'
    base64Str = canvas.toDataURL('image/png').split(',')[1];
    // 送信データ
    data = {
        base64_str: base64Str,
        start_x_position: parseInt(startXPosition),
        start_y_position: parseInt(startYPosition),
        width: parseInt(width),
        height: parseInt(height),
    }
    // APIリクエスト
    fetch('/api/v1/filter/mosaic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {image.src = 'data:image/png;base64,' + data.image_base64;downloadLink.href=image.src})
    .catch((error) => {console.log(error)})
}