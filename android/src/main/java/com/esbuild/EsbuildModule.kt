package com.esbuild

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class EsbuildModule internal constructor(context: ReactApplicationContext) :
  EsbuildSpec(context) {

  private val scriptLoader = NativeScriptLoader(context)

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  override fun evaluateJavascript(code: String?, promise: Promise?) {
    if (code != null && promise != null) {
      scriptLoader.evaluate(code.toByteArray(), "chunk", promise)
    }
  }

  companion object {
    init {
      System.loadLibrary("react-native-esbuild")
    }

    const val NAME = "Esbuild"
  }
}
