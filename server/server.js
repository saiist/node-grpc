const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// protoファイルの読み込み
const PROTO_PATH = path.resolve(__dirname, '../proto/hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

// サーバーの実装
const server = new grpc.Server();

// 単純なRPC
function sayHello(call, callback) {
  console.log(`SayHello called with name: ${call.request.name}`);
  callback(null, {
    message: `Hello, ${call.request.name}!`,
    timestamp: Math.floor(Date.now() / 1000)
  });
}

// サーバーストリーミングRPC
function sayHellosStream(call) {
  const name = call.request.name;
  console.log(`SayHellosStream called with name: ${name}`);
  
  // 5回のレスポンスを送信
  for (let i = 0; i < 5; i++) {
    call.write({
      message: `Hello stream ${i + 1}, ${name}!`,
      timestamp: Math.floor(Date.now() / 1000)
    });
    
    // 少し待機（実際の実装では異なる方法で非同期処理を行う）
    const waitTill = new Date(new Date().getTime() + 500);
    while (waitTill > new Date()) {}
  }
  
  call.end();
}

// クライアントストリーミングRPC
function sayHelloClientStream(call, callback) {
  let names = [];
  
  call.on('data', (request) => {
    console.log(`Received client stream data: ${request.name}`);
    names.push(request.name);
  });
  
  call.on('end', () => {
    const message = `Hello to ${names.join(', ')}!`;
    callback(null, {
      message: message,
      timestamp: Math.floor(Date.now() / 1000)
    });
  });
  
  call.on('error', (error) => {
    console.error('Error in client stream:', error);
  });
}

// 双方向ストリーミングRPC
function sayHelloBidirectional(call) {
  call.on('data', (request) => {
    console.log(`Received bidirectional stream data: ${request.name}`);
    
    // すぐにレスポンスを返す
    call.write({
      message: `Hello bidirectional, ${request.name}!`,
      timestamp: Math.floor(Date.now() / 1000)
    });
  });
  
  call.on('end', () => {
    call.end();
  });
  
  call.on('error', (error) => {
    console.error('Error in bidirectional stream:', error);
  });
}

// サービスの登録
server.addService(helloProto.Greeter.service, {
  sayHello: sayHello,
  sayHellosStream: sayHellosStream,
  sayHelloClientStream: sayHelloClientStream,
  sayHelloBidirectional: sayHelloBidirectional
});

// サーバーの起動
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 50051;
server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Failed to bind server:', error);
    return;
  }
  
  server.start();
  console.log(`gRPC server running at ${HOST}:${PORT}`);
});

// グレースフルシャットダウンの処理
process.on('SIGINT', () => {
  console.log('Shutting down gRPC server...');
  server.tryShutdown(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
});
