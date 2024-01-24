# NVIDIA device plugin for Host Kubernetes

## 수정된 부분
파드가 일부 gpu를 요청해도 우선 모든 gpu를 다 할당해줍니다. 이렇게 해야 가상 쿠버네티스에서 실행되는 장치 플러그인이 정상적으로 실행됩니다.  
따라서 `NVIDIA_VISIBLE_DEVICES` 환경변수에는 호스트의 모든 gpu uuid가 저장되고, 실제로 할당되었어야 할 gpu uuid는 `NVIDIA_ALLOCATED_DEVICES` 환경변수에 저장됩니다.  
파드는 `NVIDIA_ALLOCATED_DEVICES` 환경변수에 저장된 gpu uuid들을 */gpu.env* 파일에 미리 저장해둡니다. 이 파일은 나중에 가상 쿠버네티스의 장치 플러그인이 사용합니다.
```go
// cmd/nvidia-device-plugin/server.go
func (m *NvidiaDevicePlugin) Allocate(ctx context.Context, reqs *pluginapi.AllocateRequest) (*pluginapi.AllocateResponse, error) {
	responses := pluginapi.AllocateResponse{}
	for _, req := range reqs.ContainerRequests {
		for _, id := range req.DevicesIDs {
			if !m.deviceExists(id) {
				return nil, fmt.Errorf("invalid allocation request for '%s': unknown device: %s", m.resourceName, id)
			}
		}

		response := pluginapi.ContainerAllocateResponse{}

		uuids := req.DevicesIDs
		allocatedDeviceIDs := m.deviceIDsFromUUIDs(uuids)
		allDeviceIDs := m.getAllDeviceIDs()

		if deviceListStrategyFlag == DeviceListStrategyEnvvar {
			response.Envs = m.apiEnvs(m.deviceListEnvvar, allDeviceIDs)
			response.Envs["NVIDIA_ALLOCATED_DEVICES"] = strings.Join(allocatedDeviceIDs, ",")
		}
		if deviceListStrategyFlag == DeviceListStrategyVolumeMounts {
			response.Envs = m.apiEnvs(m.deviceListEnvvar, []string{deviceListAsVolumeMountsContainerPathRoot})
			response.Mounts = m.apiMounts(allocatedDeviceIDs)
		}
		if passDeviceSpecsFlag {
			response.Devices = m.apiDeviceSpecs(nvidiaDriverRootFlag, uuids)
		}

		responses.ContainerResponses = append(responses.ContainerResponses, &response)
	}
	return &responses, nil
}

func (m *NvidiaDevicePlugin) getAllDeviceIDs() []string {
	var ids []string
	for _, d := range m.cachedDevices {
		ids = append(ids, d.ID)
	}
	return ids
}

---

# 아래 명령어로 수정된 코드를 확인할 수 있습니다.
git diff 5cd05feb4e018c9190bee3a439640e043f38445b 3458f1c8c452503469cf32112a886fa57cb0b6cb
```

## 빌드
```bash
# ./build.sh <image-registry> <tag>
./build.sh 223.62.245.138:15001 0.1
```

## 설치
```bash
# ./install.sh <image-registry>
./install.sh 223.62.245.138:15001
```