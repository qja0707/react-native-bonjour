#import "Bonjour.h"
#import "react_native_bonjour-Swift.h" // Swift 클래스 실제 구현을 가져옴

@implementation Bonjour

RCT_EXPORT_MODULE()

// 예시 메서드
- (NSNumber *)multiply:(double)a b:(double)b {
  return @(a * b);
}

// Bonjour 검색 시작
RCT_EXPORT_METHOD(serviceDiscovery) {
  NSLog(@"[Bonjour] serviceDiscovery called");
  
  // self.discovery(프로퍼티)에 할당하여 메서드가 끝나도 해제되지 않도록 함
  if(self.netServiceObj == nil){
    self.netServiceObj = [[BonjourServiceDiscovery alloc] init];
  }
  
  [self.netServiceObj startServiceDiscoveryWithServiceType:@"_http._tcp." domain:@"local."];
}

// Bonjour 검색 정지
RCT_EXPORT_METHOD(stopBonjourDiscovery) {
  NSLog(@"[Bonjour] stopBonjourDiscovery called");
  
  [self.netServiceObj stopServiceDiscovery];
  self.netServiceObj = nil; // 필요에 따라 여기서 해제
}

// (필요하다면) serviceRegistrar 메서드
RCT_EXPORT_METHOD(serviceRegistrar:(NSString *)serviceName) {
  NSLog(@"[Bonjour] serviceRegistrar called with service name: %@", serviceName);
  
  if(self.netServiceObj == nil){
    self.netServiceObj = [[BonjourServiceDiscovery alloc] init];
  }
  
  [self.netServiceObj registerService:serviceName];
}

// TurboModule 관련 (자동 생성된 부분)
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeBonjourSpecJSI>(params);
}

@end
