#import "Esbuild.h"
#import <React/RCTBridge.h>
#import <ReactCommon/CallInvoker.h>
#import <jsi/jsi.h>

@interface RCTBridge (JSIRuntime)
- (void *)runtime;
@end

@interface RCTBridge (RCTTurboModule)
- (std::shared_ptr<facebook::react::CallInvoker>)jsCallInvoker;
@end

@implementation Esbuild
RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

- (facebook::jsi::Runtime *)getJavaScriptRuntimePointer
{
  if (!self.bridge.runtime) {
    return nil;
  }

  facebook::jsi::Runtime *jsRuntime = (facebook::jsi::Runtime *)self.bridge.runtime;
  return jsRuntime;
}

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(evaluateJavascript:(NSString *)code
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    std::shared_ptr<facebook::react::CallInvoker> callInvoker = self.bridge.jsCallInvoker;
    if (!callInvoker) {
        reject(@"Error", @"Missing CallInvoker - bridgeless on RN 0.73 is not supported", nil);
        return;
    }
    
    // There is no backwards compatible way to get runtime in an asynchronous manner
    // we obtain the ptr here, and use it inside of invokeAsync callback
    // TODO: Consider doing this during initialization step once to fail fast
    facebook::jsi::Runtime *runtime = [self getJavaScriptRuntimePointer];
    if (!runtime) {
        reject(@"Error", @"Can't access React Native runtime", nil);
        return;
    }

    NSData * data = [code dataUsingEncoding:NSUTF8StringEncoding];
    std::string source{static_cast<const char *>([data bytes]), [code length]};
    std::string sourceUrl{[@"chunk" UTF8String]};

    callInvoker->invokeAsync([source = std::move(source), sourceUrl = std::move(sourceUrl), runtime, resolve, reject]() {
        // use c++ error handling here
        try {
            runtime->evaluateJavaScript(std::make_unique<facebook::jsi::StringBuffer>(std::move(source)), sourceUrl);
            resolve(nil);
        } catch (const std::exception &e) {
            NSString *errorString = [NSString stringWithUTF8String:e.what()];
            reject(@"Error", errorString, nil);
        }
    });
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeEsbuildSpecJSI>(params);
}
#endif

@end
