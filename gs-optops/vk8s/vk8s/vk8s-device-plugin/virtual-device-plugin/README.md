# NVIDIA device plugin for Virtual Kubernetes

## 수정된 부분

- *cmd/nvidia-device-plugin/nvidia.go* .  
    장치 플러그인이 가상 쿠버네티스에게 사용가능한 gpu를 알려주는 로직을 수정했습니다. 현재 파드에 할당 예정인 gpu uuid가 */gpu.env* 파일에 저장되어 있으므로, 해당 파일을 읽고 장치 플러그인에서 gpu 조회할 때 파일에 적혀있는 uuid만 조회하고 반환하도록 했습니다. 이렇게 하면 파드에서는 여전히 전체 gpu를 바라보고 있지만 가상 쿠버네티스에서 조회할 땐 할당된 gpu만 조회되어 다른 파드와 충돌할 일이 없어집니다.  
    ```go
    // cmd/nvidia-device-plugin/nvidia.go
    func (g *GpuDeviceManager) Devices() []*Device {
        n, err := nvml.GetDeviceCount()
        check(err)
        allocatedDevices := getAllocatedDeviceIDs()
        var devs []*Device
        for i := uint(0); i < n; i++ {
            d, err := nvml.NewDeviceLite(i)
            check(err)

            migEnabled, err := d.IsMigEnabled()
            check(err)

            if migEnabled && g.skipMigEnabledGPUs {
                continue
            }

            if !funk.ContainsString(allocatedDevices, d.UUID) {
                continue
            }

            devs = append(devs, buildDevice(d, []string{d.Path}, fmt.Sprintf("%v", i)))
        }
        return devs
    }

    func getAllocatedDeviceIDs() []string {
        devs, err := ioutil.ReadFile("/gpu.env")
        check(err)
        return strings.Split(strings.TrimRight(string(devs), "\n"), ",")
    }

    ---

    # 아래 명령어로 자세하게 확인 가능
    git diff 5cd05feb4e018c9190bee3a439640e043f38445b 6a85beebb5e70ae27cb1f4f4f4d691745eb59e9b
    ```

## 빌드 
```bash
# ./build.sh <image-registry> <tag>
./build.sh 223.62.245.138:15001 0.1
```    
> **주의**  
>  
> virtual-device-plugin 이미지명이 바뀌면 vk8s 프로젝트에 있는 nvidia-device-plugin.yml의 이미지명도 변경 후, kink 이미지들을 다시 빌드해줘야 합니다.
