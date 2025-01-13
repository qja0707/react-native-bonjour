package com.bonjour

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.util.Log

class BonjourServiceRegistrar(private val context: Context) {

  private val nsdManager = context.getSystemService(Context.NSD_SERVICE) as NsdManager
  private var registrationListener: NsdManager.RegistrationListener? = null
  private var serviceName: String? = null

  fun registerService(port: Int, serviceName: String, serviceType: String = "_http._tcp.") {
    this.serviceName = serviceName
    Log.i(TAG,"asdf")
    val serviceInfo = NsdServiceInfo().apply {
      this.serviceName = serviceName
      this.serviceType = serviceType
      this.port = port
    }

    registrationListener = object : NsdManager.RegistrationListener {
      override fun onServiceRegistered(serviceInfo: NsdServiceInfo?) {
        Log.i("Bonjour", "Service registered: ${serviceInfo?.serviceName}")
      }

      override fun onRegistrationFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
        Log.e("Bonjour", "Service registration failed: $errorCode")
      }

      override fun onServiceUnregistered(serviceInfo: NsdServiceInfo?) {
        Log.i("Bonjour", "Service unregistered: ${serviceInfo?.serviceName}")
      }

      override fun onUnregistrationFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
        Log.e("Bonjour", "Service unregistration failed: $errorCode")
      }
    }

    nsdManager.registerService(serviceInfo, NsdManager.PROTOCOL_DNS_SD, registrationListener!!)
  }

  fun unregisterService() {
    registrationListener?.let {
      nsdManager.unregisterService(it)
    }
  }
}
