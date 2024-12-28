package com.esbuild

import com.facebook.react.bridge.ReactApplicationContext

abstract class EsbuildSpec internal constructor(context: ReactApplicationContext) :
  NativeEsbuildSpec(context) {
}
