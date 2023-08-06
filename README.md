# 概要
easy-mosaicはアップロードした画像の選択した範囲にモザイクをかけるシステムです。

![アニメーション](./animation.gif)

# 構成
- WebとAPIサーバーをdocker-composeで作成しています
- APIとの通信はAjax
- 画像処理にOpenCVを使っています

# 動かし方
下記コマンドでコンテナを立ち上げて、`http://localhost:8000/` へアクセスしてください。  
動作確認用サンプル画像として `sample.png` をご利用いただいてもよいです。
```
$ docker-compose up -d
```