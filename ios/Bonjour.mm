#import "Bonjour.h"

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

// 예시 메서드
- (NSNumber *)multiply:(double)a b:(double)b {
  return @(a * b);
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
}

// 서비스 등록 메서드
RCT_EXPORT_METHOD(serviceRegistrar:(NSString *)serviceName) {
  NSLog(@"[Bonjour] serviceRegistrar called with name: %@", serviceName);
  
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

// TurboModule 관련 (자동 생성된 부분)
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeBonjourSpecJSI>(params);
}

@end
