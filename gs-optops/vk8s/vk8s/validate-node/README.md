# Validate Node
vk8s가 설치되기 전 노드의 inotify 값이 적절하게 설정되어 있어야 합니다.  
`validate-inotify.sh` 스크립트는 현재 노드의 memory와 inotify 값을 보고 적절한 값을 설정합니다.  
만약 적절한 값이 설정되어 있지 않으면, vk8s 사용 중에 `too many open files`에러가 발생합니다.  
이는 vk8s가 실행되는 WAAS 노드에만 적용해주시길 바랍니다.
## Validate Inotify
```bash
./validate-intoify.sh
```