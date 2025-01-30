//
//  BonjourServiceDiscovery.swift
//  react-native-bonjour
//
//  Created by Gyubeom on 1/13/25.
//

import Foundation

@objc class BonjourServiceDiscovery: NSObject, NetServiceBrowserDelegate, NetServiceDelegate {
  private lazy var serviceBrowser: NetServiceBrowser = {
    let browser = NetServiceBrowser()
    browser.delegate = self
    return browser
  }()
  private var services: [NetService] = []
  
  @objc func startServiceDiscovery(serviceType: String, domain: String = "local.") {
    print("Starting Bonjour service discovery for \(serviceType) in domain \(domain)")
    serviceBrowser.searchForServices(ofType: serviceType, inDomain: domain)
  }
  
  @objc func stopServiceDiscovery() {
    print("Stopping Bonjour service discovery")
    serviceBrowser.stop()
  }
  
  // MARK: - NetServiceBrowserDelegate
  
  func netServiceBrowser(_ browser: NetServiceBrowser, didFind service: NetService, moreComing: Bool) {
    print("Service found: \(service.name)")
    services.append(service)
    service.delegate = self
    service.resolve(withTimeout: 5.0)
  }
  
  func netServiceBrowser(_ browser: NetServiceBrowser, didFindDomain domainString: String, moreComing: Bool) {
    print("Service finded???:")
  }
  
  func netServiceBrowser(_ browser: NetServiceBrowser, didRemove service: NetService, moreComing: Bool) {
    print("Service removed: \(service.name)")
    if let index = services.firstIndex(of: service) {
      services.remove(at: index)
      service.delegate = nil
    }
  }
  
  func netServiceDidResolveAddress(_ sender: NetService) {
    if let addresses = sender.addresses {
      for address in addresses {
        var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
        address.withUnsafeBytes { ptr in
          let sockaddr = ptr.bindMemory(to: sockaddr.self).baseAddress!
          getnameinfo(sockaddr, socklen_t(MemoryLayout<sockaddr>.size), &hostname, socklen_t(hostname.count), nil, 0, NI_NUMERICHOST)
        }
        print("Resolved service: \(sender.name) at \(String(cString: hostname))")
      }
    }
  }
  
  func netServiceBrowserDidStopSearch(_ browser: NetServiceBrowser) {
    print("Service browsing stopped")
  }
  
  func netServiceBrowser(_ browser: NetServiceBrowser, didNotSearch errorDict: [String: NSNumber]) {
    print("Failed to search for services: \(errorDict)")
  }
  
  deinit {
    print("BonjourServiceDiscovery deinit called!")
  }
}
