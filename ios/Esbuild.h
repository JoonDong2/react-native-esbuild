
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNEsbuildSpec.h"

@interface Esbuild : NSObject <NativeEsbuildSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Esbuild : NSObject <RCTBridgeModule>
#endif

@end
