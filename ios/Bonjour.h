
#import "generated/RNBonjourSpec/RNBonjourSpec.h"

// Swift 클래스를 forward declare (전방 선언) 해줍니다.
// (본격적인 import는 .m 파일에서 하거나, bridging header에서 할 수 있음)
@class BonjourServiceDiscovery;

@interface Bonjour : NSObject <NativeBonjourSpec>

// 여기서 'strong' 프로퍼티로 BonjourServiceDiscovery를 선언
@property (nonatomic, strong) BonjourServiceDiscovery *netServiceObj;

@end
