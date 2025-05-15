package com.bonjour

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BonjourModule.NAME)
class BonjourModule(reactContext: ReactApplicationContext) :
  NativeBonjourSpec(reactContext), LifecycleEventListener {

  private var context: Context = reactContext.getApplicationContext()
  private var isServiceRegistered = false

  private val serviceDiscovery = BonjourServiceDiscovery(
    context,
    onServiceDiscovered = { serviceInfo ->
      val params = Arguments.createMap().apply {
        putString("serviceName", serviceInfo.serviceName)
        putString("serviceType", serviceInfo.serviceType)
        putString("host", serviceInfo.host?.hostAddress)
        putInt("port", serviceInfo.port)
      }

      emitOnDeviceDiscoveryServiceFound(params)
    },
    onServiceLost = { serviceInfo ->
      val params = Arguments.createMap().apply {
        putString("serviceName", serviceInfo.serviceName)
        putString("serviceType", serviceInfo.serviceType)
        putString("host", serviceInfo.host?.hostAddress)
        putInt("port", serviceInfo.port)
      }
      
      emitOnDeviceDiscoveryServiceLost(params)
    },
    onServiceResolved = { serviceInfo ->
      val params = Arguments.createMap().apply {
        putString("serviceName", serviceInfo.serviceName)
        putString("serviceType", serviceInfo.serviceType)
        putString("host", serviceInfo.host?.hostAddress)
        putInt("port", serviceInfo.port)
      }

      emitOnDeviceDiscoveryServiceFound(params)
    }
  )

  private val serviceRegistrar = BonjourServiceRegistrar(context)

  init {
    // 라이프사이클 이벤트 리스너 등록
    reactContext.addLifecycleEventListener(this)
  }

  override fun getName(): String {
    return NAME
  }

  override fun serviceResolve(serviceName: String) {
    serviceDiscovery.resolveServiceByName(serviceName)
  }

  override fun serviceDiscovery(){
    serviceDiscovery.startServiceDiscovery()
  }

  override fun stopBonjourDiscovery() {
    serviceDiscovery.stopServiceDiscovery()
  }

  override fun serviceRegister(serviceName: String){
    Log.i(TAG,"start with service name: $serviceName")
    
    serviceRegistrar.registerService(port = 8080, serviceName = serviceName)

    isServiceRegistered = true
  }

  override fun serviceUnregister() {
    Log.i(TAG, "Unregistering service")
    serviceRegistrar.unregisterService()

    isServiceRegistered = false
  }

  // LifecycleEventListener 구현
  override fun onHostResume() {
    // 앱이 포그라운드로 돌아올 때
    Log.i(TAG, "App resumed")
  }

  override fun onHostPause() {
    // 앱이 백그라운드로 갈 때
    Log.i(TAG, "App paused")
    // 백그라운드로 가도 서비스는 계속 유지하기 위해 주석 처리
    // if (isServiceRegistered) {
    //   serviceUnregister()
    // }
  }

  override fun onHostDestroy() {
    // 앱이 종료될 때
    Log.i(TAG, "App destroyed")
    if (isServiceRegistered) {
      serviceUnregister()
    }
    stopBonjourDiscovery()
  }

  override fun invalidate() {
    // ReactContextBaseJavaModule의 invalidate 오버라이드
    reactApplicationContext.removeLifecycleEventListener(this)
    if (isServiceRegistered) {
      serviceUnregister()
    }
    stopBonjourDiscovery()
    super.invalidate()
  }

  companion object {
    const val NAME = "Bonjour"
    const val TAG = "BonjourModule"
  }
}
