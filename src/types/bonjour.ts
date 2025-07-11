export interface DeviceDiscoveryService {
  serviceName: string;
  serviceType: string;
  serviceDomain: string | null;
  servicePort: number | null;
}
