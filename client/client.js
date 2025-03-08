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

// サーバーのアドレス
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 50051;
const SERVER_ADDRESS = `${SERVER_HOST}:${SERVER_PORT}`;

// クライアントの作成
const client = new helloProto.Greeter(
  SERVER_ADDRESS,
  grpc.credentials.createInsecure()
);

// テスト用関数: 単純なRPC
function testSayHello() {
  console.log('\n--- Testing SayHello (Unary RPC) ---');
  client.sayHello({ name: 'gRPC User' }, (error, response) => {
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    console.log('Response:', response);
  });
}

// テスト用関数: サーバーストリーミングRPC
function testSayHellosStream() {
  console.log('\n--- Testing SayHellosStream (Server Streaming RPC) ---');
  const call = client.sayHellosStream({ name: 'Stream User' });
  
  call.on('data', (data) => {
    console.log('Received stream data:', data);
  });
  
  call.on('end', () => {
    console.log('Server stream ended');
  });
  
  call.on('error', (error) => {
    console.error('Stream error:', error.message);
  });
}

// テスト用関数: クライアントストリーミングRPC
function testSayHelloClientStream() {
  console.log('\n--- Testing SayHelloClientStream (Client Streaming RPC) ---');
  const call = client.sayHelloClientStream((error, response) => {
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    console.log('Final response:', response);
  });
  
  // 複数のリクエストを送信
  const names = ['たろう', 'はなこ', 'あきら', 'けんじ', 'トーマス'];
  
  names.forEach((name, index) => {
    setTimeout(() => {
      console.log(`Sending name: ${name}`);
      call.write({ name });
      
      // 最後のリクエスト後にストリームを終了
      if (index === names.length - 1) {
        call.end();
      }
    }, index * 500);
  });
}

// テスト用関数: 双方向ストリーミングRPC
function testSayHelloBidirectional() {
  console.log('\n--- Testing SayHelloBidirectional (Bidirectional Streaming RPC) ---');
  const call = client.sayHelloBidirectional();
  
  call.on('data', (data) => {
    console.log('Received bidirectional data:', data);
  });
  
  call.on('end', () => {
    console.log('Bidirectional stream ended');
  });
  
  call.on('error', (error) => {
    console.error('Bidirectional error:', error.message);
  });
  
  // 複数のリクエストを送信
  const names = ['ユリアン', 'エレン', 'モニカ', 'ミカエル', 'ハリード'];
  
  names.forEach((name, index) => {
    setTimeout(() => {
      console.log(`Sending bidirectional name: ${name}`);
      call.write({ name });
      
      // 最後のリクエスト後にストリームを終了
      if (index === names.length - 1) {
        call.end();
      }
    }, index * 1000);
  });
}

// メイン関数
function main() {
  console.log(`Connecting to gRPC server at ${SERVER_ADDRESS}`);
  
  // シーケンシャルにテストを実行
  setTimeout(testSayHello, 1000);
  setTimeout(testSayHellosStream, 3000);
  setTimeout(testSayHelloClientStream, 8000);
  setTimeout(testSayHelloBidirectional, 15000);
  
  // 全てのテストが終了した後にプロセスを終了
  setTimeout(() => {
    console.log('\nAll tests completed.');
    process.exit(0);
  }, 25000);
}

// メイン関数の実行
main();
