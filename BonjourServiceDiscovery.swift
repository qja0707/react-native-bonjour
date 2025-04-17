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
  
  private var netService: NetService?
  
  @objc func startServiceDiscovery(serviceType: String, domain: String = "local.") {
    print("Starting Bonjour service discovery for \(serviceType) in domain \(domain)")
    
    DispatchQueue.global(qos: .background).async {
      self.serviceBrowser.searchForServices(ofType: serviceType, inDomain: domain)
      RunLoop.current.run()
    }
    
  }
  
  @objc func stopServiceDiscovery() {
    print("Stopping Bonjour service discovery")
    serviceBrowser.stop()
  }
  
  @objc func registerService(serviceName: String) {
    let serviceType = "_http._tcp." // 서비스 타입 (예: "_http._tcp." 등)
    let port: Int32 = 8080 // 사용할 포트 번호
    
    // NetService 인스턴스 생성 및 등록
    netService = NetService(domain: "local.", type: serviceType, name: serviceName, port: port)
    netService?.delegate = self
    netService?.publish()
    
    print("서비스 등록됨: \(serviceName) (\(serviceType)) on port \(port)")
  }
  
  @objc func unregisterService() {
    netService?.stop()
    print("서비스가 중지되었습니다.")
  }
  
  // MARK: - NetServiceBrowserDelegate
  
  func netServiceBrowser(_ browser: NetServiceBrowser, didFind service: NetService, moreComing: Bool) {
    print("Service found: \(service.name)")
    services.append(service)
    service.delegate = self
    //    service.resolve(withTimeout: 5.0)
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
  
  func netServiceDidPublish(_ sender: NetService) {
    print("서비스가 성공적으로 등록되었습니다: \(sender.name)")
  }
  
  func netService(_ sender: NetService, didNotPublish errorDict: [String : NSNumber]) {
    print("서비스 등록 실패: \(errorDict)")
  }
  
  deinit {
    print("BonjourServiceDiscovery deinit called!")
  }
}
