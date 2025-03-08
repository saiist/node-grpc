FROM node:18-alpine

WORKDIR /app

# プロジェクト全体をコピー
COPY ./proto /app/proto
COPY ./client /app/client

# クライアントディレクトリに移動して依存関係をインストール
WORKDIR /app/client
RUN npm install

# クライアントを実行
CMD ["node", "client.js"]
