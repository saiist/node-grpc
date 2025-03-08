FROM node:18-alpine

WORKDIR /app

# プロジェクト全体をコピー
COPY ./proto /app/proto
COPY ./server /app/server

# サーバーディレクトリに移動して依存関係をインストール
WORKDIR /app/server
RUN npm install

# ポートを公開
EXPOSE 50051

# サーバーを起動
CMD ["node", "server.js"]
