.PHONY: build start stop restart logs clean help server-logs client-logs up

# デフォルトのターゲット
help:
	@echo "gRPC + Docker + Node.js サンプルプロジェクト用 Makefile"
	@echo ""
	@echo "使用可能なコマンド:"
	@echo "  make build        - Docker イメージをビルドする"
	@echo "  make start        - Docker コンテナを起動する"
	@echo "  make up           - Docker イメージをビルドして起動する"
	@echo "  make stop         - Docker コンテナを停止する"
	@echo "  make restart      - Docker コンテナを再起動する"
	@echo "  make logs         - すべてのコンテナのログを表示する"
	@echo "  make server-logs  - サーバーコンテナのログを表示する"
	@echo "  make client-logs  - クライアントコンテナのログを表示する"
	@echo "  make clean        - すべてのコンテナとイメージを削除する"
	@echo "  make install      - ローカル開発用の依存関係をインストールする"
	@echo "  make run-server   - ローカルでサーバーを実行する"
	@echo "  make run-client   - ローカルでクライアントを実行する"
	@echo "  make help         - このヘルプメッセージを表示する"

# Docker 関連のコマンド
build:
	@echo "Docker イメージをビルドしています..."
	docker-compose build

start:
	@echo "Docker コンテナを起動しています..."
	docker-compose up -d

up:
	@echo "Docker イメージをビルドして起動しています..."
	docker-compose up --build

stop:
	@echo "Docker コンテナを停止しています..."
	docker-compose down

restart: stop start

logs:
	@echo "すべてのコンテナのログを表示します..."
	docker-compose logs -f

server-logs:
	@echo "サーバーコンテナのログを表示します..."
	docker-compose logs -f grpc-server

client-logs:
	@echo "クライアントコンテナのログを表示します..."
	docker-compose logs -f grpc-client

clean:
	@echo "すべてのコンテナとイメージを削除します..."
	docker-compose down --rmi all
	docker system prune -f

# ローカル開発用のコマンド
install-server:
	@echo "サーバーの依存関係をインストールしています..."
	cd server && npm install

install-client:
	@echo "クライアントの依存関係をインストールしています..."
	cd client && npm install

install: install-server install-client
	@echo "すべての依存関係のインストールが完了しました"

run-server:
	@echo "ローカルでサーバーを実行します..."
	cd server && node server.js

run-client:
	@echo "ローカルでクライアントを実行します..."
	cd client && node client.js