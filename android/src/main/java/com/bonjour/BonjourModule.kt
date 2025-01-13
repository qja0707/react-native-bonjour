package com.bonjour

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BonjourModule.NAME)
class BonjourModule(reactContext: ReactApplicationContext) :
  NativeBonjourSpec(reactContext) {

  private var context: Context = reactContext.getApplicationContext()

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun multiply(a: Double, b: Double): Double {
    Log.i(TAG,"multiply")
    return a * b
  }

  override fun serviceDiscovery(){
    val serviceDiscovery = BonjourServiceDiscovery(context)

    serviceDiscovery.startServiceDiscovery()
  }

  override fun serviceRegistrar(){
    Log.i(TAG,"start")
    val serviceRegistrar = BonjourServiceRegistrar(context)

    serviceRegistrar.registerService(port = 8080, serviceName = "MyBonjourService")
  }

  companion object {
    const val NAME = "Bonjour"
  }
}
