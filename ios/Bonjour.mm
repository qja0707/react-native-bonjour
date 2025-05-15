#import "Bonjour.h"
#include <arpa/inet.h>  // inet_ntop 함수 사용을 위해

@implementation Bonjour

RCT_EXPORT_MODULE()

// 초기화 메서드
- (instancetype)init {
  self = [super init];
  if (self) {
    _serviceBrowser = [[NSNetServiceBrowser alloc] init];
    _serviceBrowser.delegate = self;
    _services = [NSMutableArray array];
  }
  return self;
}

- (void)serviceResolve:(NSString *)serviceName {
  NSLog(@"[Bonjour] serviceResolve called with name: %@", serviceName);
  
  // 검색된 서비스에서 resolve 시작
  NSNetService *targetService = nil;
  
  // 발견된 서비스 목록에서 이름이 일치하는 서비스 찾기
  for (NSNetService *service in self.services) {
    if ([service.name isEqualToString:serviceName]) {
      targetService = service;
      break;
    }
  }
  
  if (targetService) {
    NSLog(@"Resolving service with name: %@", serviceName);
    targetService.delegate = self;
    [targetService resolveWithTimeout:5.0];
  } else {
    NSLog(@"No service found with name: %@", serviceName);
    // 오류 처리 또는 이벤트 발생
  }
}

// Bonjour 검색 시작
RCT_EXPORT_METHOD(serviceDiscovery) {
  NSLog(@"[Bonjour] serviceDiscovery called");
  
  // 백그라운드 큐에서 실행
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
    [self.serviceBrowser searchForServicesOfType:@"_http._tcp." inDomain:@"local."];
    // RunLoop 실행
    [[NSRunLoop currentRunLoop] run];
  });
}

// Bonjour 검색 정지
RCT_EXPORT_METHOD(stopBonjourDiscovery) {
  NSLog(@"[Bonjour] stopBonjourDiscovery called");
  
  [self.serviceBrowser stop];

  [self.services removeAllObjects];
}

// 서비스 등록 메서드
RCT_EXPORT_METHOD(serviceRegister:(NSString *)serviceName) {
  NSLog(@"[Bonjour] serviceRegister called with name: %@", serviceName);
  
  NSString *serviceType = @"_http._tcp."; // 서비스 타입
  int port = 8080; // 사용할 포트 번호
  
  // NetService 인스턴스 생성 및 등록
  self.netService = [[NSNetService alloc] initWithDomain:@"local."
                                                    type:serviceType
                                                    name:serviceName
                                                    port:port];
  self.netService.delegate = self;
  [self.netService publish];
  
  NSLog(@"서비스 등록됨: %@ (%@) on port %d", serviceName, serviceType, port);
}

// MARK: - NSNetServiceBrowserDelegate

- (void)netServiceBrowser:(NSNetServiceBrowser *)browser didFindService:(NSNetService *)service moreComing:(BOOL)moreComing {
  NSLog(@"Service found: %@", service.name);
  [self.services addObject:service];
  service.delegate = self;
  
  // NSNetService 객체에서 NSDictionary로 변환
  NSDictionary *serviceDict = @{
    @"serviceName": service.name ?: @"",
    @"serviceType": service.type ?: @"",
    @"serviceDomain": service.domain ?: @"",
    // 호스트 및 포트는 아직 resolving이 필요함
    @"servicePort": @(0)  // 기본값, resolving 후 업데이트 필요
  };
  
  // 이벤트 발생
  [self emitOnDeviceDiscoveryServiceFound:serviceDict];
}

- (void)netServiceBrowser:(NSNetServiceBrowser *)browser didRemoveService:(NSNetService *)service moreComing:(BOOL)moreComing {
  NSLog(@"Service removed: %@", service.name);
  [self.services removeObject:service];
}

- (void)netServiceBrowserDidStopSearch:(NSNetServiceBrowser *)browser {
  NSLog(@"Service browsing stopped");
}

- (void)netServiceBrowser:(NSNetServiceBrowser *)browser didNotSearch:(NSDictionary<NSString *,NSNumber *> *)errorDict {
  NSLog(@"Failed to search for services: %@", errorDict);
}

// MARK: - NSNetServiceDelegate

- (void)netServiceDidPublish:(NSNetService *)sender {
  NSLog(@"서비스가 성공적으로 등록되었습니다: %@", sender.name);
}

- (void)netService:(NSNetService *)sender didNotPublish:(NSDictionary<NSString *, NSNumber *> *)errorDict {
  NSLog(@"서비스 등록 실패: %@", errorDict);
}

- (void)netServiceDidResolveAddress:(NSNetService *)service {
  NSLog(@"Service resolved: %@, Host: %@, Port: %d", service.name, service.hostName, service.port);
  
  // IP 주소 추출하기
  NSString *ipAddress = nil;
  
  // addresses 배열에서 IPv4 주소 찾기
  for (NSData *addressData in service.addresses) {
    struct sockaddr *socketAddress = (struct sockaddr *)[addressData bytes];
    
    // IPv4 주소만 처리
    if (socketAddress->sa_family == AF_INET) {  // IPv4
      char ipString[INET_ADDRSTRLEN];
      struct sockaddr_in *ipv4 = (struct sockaddr_in *)socketAddress;
      inet_ntop(AF_INET, &(ipv4->sin_addr), ipString, INET_ADDRSTRLEN);
      ipAddress = [NSString stringWithUTF8String:ipString];
      break;  // 첫 번째 IPv4 주소를 찾으면 종료
    }
  }
  
  NSLog(@"실제 IP 주소: %@", ipAddress ? ipAddress : @"찾을 수 없음");
  
  // 이벤트로 전송할 데이터 준비
  NSDictionary *resolvedDict = @{
    @"serviceName": service.name ?: @"",
    @"serviceType": service.type ?: @"",
    @"serviceDomain": service.domain ?: @"",
    @"host": ipAddress ?: service.hostName ?: @"",  // IP 주소 우선, 없으면 호스트명
    @"port": @(service.port)
  };
  
  // 이벤트 발생
  [self emitOnDeviceDiscoveryServiceFound:resolvedDict];
}

// 해석 실패 처리
- (void)netService:(NSNetService *)service didNotResolve:(NSDictionary<NSString *, NSNumber *> *)errorDict {
  NSLog(@"Failed to resolve service: %@, Error: %@", service.name, errorDict);
  
  // 실패 이벤트 처리 (필요시)
}

// TurboModule 관련 (자동 생성된 부분)
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeBonjourSpecJSI>(params);
}

@end
