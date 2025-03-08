# gRPC + Docker + Node.js サンプルプロジェクト

このプロジェクトは、gRPC、Docker、Node.jsを使用したサンプルアプリケーションです。
4つのパターンのRPC（単純、サーバーストリーミング、クライアントストリーミング、双方向ストリーミング）を実装しています。

## プロジェクト構成

```
.
├── proto/
│   └── hello.proto        # サービス定義
├── server/
│   ├── server.js          # gRPCサーバー実装
│   ├── package.json       # サーバー用パッケージ設定
│   └── Dockerfile         # サーバー用Docker設定
├── client/
│   ├── client.js          # gRPCクライアント実装
│   ├── package.json       # クライアント用パッケージ設定
│   └── Dockerfile         # クライアント用Docker設定
├── docker-compose.yml     # Docker Compose設定
└── README.md              # プロジェクト説明
```

## 実装されているRPCタイプ

1. **Unary RPC (sayHello)**: 通常の1リクエスト1レスポンスの呼び出し
2. **Server Streaming RPC (sayHellosStream)**: サーバーから複数のレスポンスをストリーミング
3. **Client Streaming RPC (sayHelloClientStream)**: クライアントから複数のリクエストをストリーミング
4. **Bidirectional Streaming RPC (sayHelloBidirectional)**: 双方向でのストリーミング

## 使い方

### Dockerを使用する場合

```bash
# プロジェクトをクローンまたは作成
# ...

# Docker Composeを使ってビルドと実行
docker-compose up --build
```

### ローカルで実行する場合（Docker不使用）

```bash
# サーバーの起動
cd server
npm install
node server.js

# 別のターミナルでクライアントを実行
cd client
npm install
node client.js
```

## 動作確認

クライアントは自動的に4つのRPCタイプをテストします。ログを確認して、各RPCタイプがどのように動作するかを観察できます。

## カスタマイズ

- `proto/hello.proto`: サービスとメッセージの定義を変更
- `server/server.js`: サーバー側のロジックを実装
- `client/client.js`: クライアント側のロジックを実装
