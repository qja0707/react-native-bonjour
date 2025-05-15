package com.bonjour

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Build
import android.util.Log

class BonjourServiceDiscovery(
  private val context: Context,
  private val onServiceDiscovered: ((NsdServiceInfo)->Unit)? = null,
  private val onServiceResolved: ((NsdServiceInfo)->Unit)? = null
) {

  private val nsdManager = context.getSystemService(Context.NSD_SERVICE) as NsdManager
  private var discoveryListener: NsdManager.DiscoveryListener? = null
  private var serviceInfoCallback: NsdManager.ServiceInfoCallback? = null

  fun startServiceDiscovery(serviceType: String = "_http._tcp.") {
    discoveryListener = object : NsdManager.DiscoveryListener {

      override fun onStartDiscoveryFailed(serviceType: String?, errorCode: Int) {
        Log.e("Bonjour", "Discovery failed to start: Error code: $errorCode")
      }

      override fun onStopDiscoveryFailed(serviceType: String?, errorCode: Int) {
        Log.e("Bonjour", "Discovery failed to stop: Error code: $errorCode")
      }

      override fun onDiscoveryStarted(serviceType: String?) {
        Log.i("Bonjour", "Service discovery started for type: $serviceType")
      }

      override fun onDiscoveryStopped(serviceType: String?) {
        Log.i("Bonjour", "Service discovery stopped for type: $serviceType")
      }

      override fun onServiceFound(serviceInfo: NsdServiceInfo?) {
        Log.i("Bonjour", "Service found: ${serviceInfo}")

        onServiceDiscovered?.let {
          if (serviceInfo != null) {
            it(serviceInfo)
          }
        }
      }

      override fun onServiceLost(serviceInfo: NsdServiceInfo?) {
        Log.w("Bonjour", "Service lost: ${serviceInfo?.serviceName}")
      }
    }

    nsdManager.discoverServices(serviceType, NsdManager.PROTOCOL_DNS_SD, discoveryListener!!)
  }

  fun stopServiceDiscovery() {
    discoveryListener?.let {
      nsdManager.stopServiceDiscovery(it)
    }
  }

  fun resolveServiceByName(serviceName: String, serviceType: String = "_http._tcp.") {
    val nsdServiceInfo = NsdServiceInfo()
    nsdServiceInfo.serviceName = serviceName
    nsdServiceInfo.serviceType = serviceType

    nsdManager.resolveService(nsdServiceInfo, object : NsdManager.ResolveListener {
      override fun onResolveFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
        Log.e("Bonjour", "Failed to resolve service: $errorCode")
      }

      override fun onServiceResolved(resolvedServiceInfo: NsdServiceInfo?) {
        Log.i("Bonjour", "Service resolved: ${resolvedServiceInfo?.serviceName}, " +
          "Host: ${resolvedServiceInfo?.host}, Port: ${resolvedServiceInfo?.port}")

        onServiceResolved?.let {
          if (resolvedServiceInfo != null) {
            it(resolvedServiceInfo)
          }
        }
      }
    })
  }
}
