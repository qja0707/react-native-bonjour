#import "generated/RNBonjourSpec/RNBonjourSpec.h"
#import <Foundation/Foundation.h>

@interface Bonjour : NSObject <NativeBonjourSpec, NSNetServiceBrowserDelegate, NSNetServiceDelegate>

// NetService 관련 프로퍼티
@property (nonatomic, strong) NSNetServiceBrowser *serviceBrowser;
@property (nonatomic, strong) NSMutableArray *services;
@property (nonatomic, strong) NSNetService *netService;

@end
