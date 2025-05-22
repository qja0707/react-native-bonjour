import TcpSocket from 'react-native-tcp-socket';

type HttpServerConfig = {
  port: number;
  host?: string;
};

class HttpServer {
  private server: TcpSocket.Server | null = null;
  private isRunning = false;
  private port: number;
  private host: string;

  constructor(config: HttpServerConfig) {
    this.port = config.port;
    this.host = config.host || '0.0.0.0';
  }

  public start(): Promise<void> {
    if (this.isRunning) {
      console.log('HTTP 서버가 이미 실행 중입니다.');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('HTTP 서버 생성 시도:', {
          port: this.port,
          host: this.host,
        });
        this.server = TcpSocket.createServer((socket: TcpSocket.Socket) => {
          console.log('클라이언트가 연결됨:', socket.address());

          socket.on('data', (data: string | Buffer) => {
            const receivedData = data.toString();
            console.log('수신된 데이터 크기:', receivedData.length);
            console.log('수신된 데이터:', receivedData);

            // HTTP 요청 파싱 시도
            try {
              const requestLines = receivedData.split('\r\n');
              console.log('요청 첫 줄:', requestLines[0]);

              // 간단한 HTTP 응답
              const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                'Connection: close\r\n' +
                '\r\n' +
                'Hello from React Native HTTP Server';

              console.log('응답 전송 중...');
              socket.write(response);
              socket.end();
            } catch (error) {
              console.error('요청 처리 중 오류:', error);
              socket.end();
            }
          });

          socket.on('error', (error: Error) => {
            console.error('소켓 에러:', error);
          });

          socket.on('close', () => {
            console.log('소켓이 닫혔습니다.');
          });
        });

        this.server.listen({ port: this.port, host: this.host }, () => {
          this.isRunning = true;
          const address = this.server?.address();
          console.log(`HTTP 서버가 시작되었습니다: ${this.host}:${this.port}`);
          console.log(`서버 정보:`, address);
          if (address && typeof address === 'object') {
            console.log(
              `실제 바인딩된 주소: ${address.address}:${address.port}`
            );
          } else {
            console.log('바인딩된 주소 정보를 가져올 수 없습니다');
          }

          // 서버 시작 후 자체 연결 테스트 실행
          setTimeout(() => {
            this.testConnection();
          }, 1000);

          resolve();
        });

        this.server.on('error', (error: Error) => {
          console.error('서버 에러:', error);
          this.isRunning = false;
          reject(error);
        });
      } catch (error) {
        console.error('서버 시작 실패:', error);
        reject(error);
      }
    });
  }

  public stop(): Promise<void> {
    if (!this.isRunning || !this.server) {
      console.log('HTTP 서버가 실행 중이 아닙니다.');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.server!.close(() => {
        this.isRunning = false;
        this.server = null;
        console.log('HTTP 서버가 중지되었습니다.');
        resolve();
      });
    });
  }

  public isServerRunning(): boolean {
    return this.isRunning;
  }

  // 네트워크 접근성 테스트 메서드 추가
  public testConnection(): void {
    if (!this.isRunning) {
      console.log('서버가 실행 중이 아니므로 연결 테스트를 할 수 없습니다.');
      return;
    }

    try {
      console.log('서버 연결 자체 테스트 시작...');

      // 서버에 자체 연결 시도
      const address = this.server?.address();
      if (!address || typeof address !== 'object') {
        console.log('유효한 서버 주소 정보가 없습니다.');
        return;
      }

      const testSocket = TcpSocket.createConnection(
        {
          host: '127.0.0.1', // 로컬호스트로 테스트
          port: address.port,
        },
        () => {
          console.log('자체 연결 성공! 서버가 접근 가능합니다.');

          // 간단한 HTTP 요청 전송
          const testRequest =
            'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n';
          console.log('테스트 요청 전송:', testRequest);
          testSocket.write(testRequest);
        }
      );

      testSocket.on('data', (data) => {
        console.log('테스트 응답 수신:', data.toString());
        testSocket.end();
      });

      testSocket.on('error', (error) => {
        console.error('테스트 연결 에러:', error);
      });

      testSocket.on('close', () => {
        console.log('테스트 연결 종료');
      });
    } catch (error) {
      console.error('연결 테스트 시도 중 에러:', error);
    }
  }
}

// 싱글톤 인스턴스 생성
const httpServer = new HttpServer({ port: 8080 });

export default httpServer;
