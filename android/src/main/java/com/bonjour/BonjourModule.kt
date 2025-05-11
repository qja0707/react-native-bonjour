package com.bonjour

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BonjourModule.NAME)
class BonjourModule(reactContext: ReactApplicationContext) :
  NativeBonjourSpec(reactContext) {

  private var context: Context = reactContext.getApplicationContext()

  override fun getName(): String {
    return NAME
  }

  override fun serviceResolve(serviceName: String) {
    // TODO: Implement serviceResolve
  }

  override fun serviceDiscovery(){
    val serviceDiscovery = BonjourServiceDiscovery(context, onServiceDiscovered = { serviceInfo ->
      val params = Arguments.createMap().apply {
        putString("serviceName", serviceInfo.serviceName)
        putString("serviceType", serviceInfo.serviceType)
        putString("host", serviceInfo.host?.hostAddress)
        putInt("port", serviceInfo.port)
      }

      emitOnDeviceDiscoveryServiceFound(params)
    })

    serviceDiscovery.startServiceDiscovery()
  }

  override fun stopBonjourDiscovery() {
    TODO("Not yet implemented")
  }

  override fun serviceRegistrar(serviceName: String){
    Log.i(TAG,"start with service name: $serviceName")
    val serviceRegistrar = BonjourServiceRegistrar(context)

    serviceRegistrar.registerService(port = 8080, serviceName = serviceName)
  }

  companion object {
    const val NAME = "Bonjour"
  }
}
