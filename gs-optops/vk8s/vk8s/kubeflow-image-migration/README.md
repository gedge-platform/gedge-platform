# Kubeflow Image Migration
kubeflow v1.3.0 ~ v1.6.0까지의 사용되는 모든 이미지들을 원하는 private registry로 옮기는 스크립트
## Migrate All Kubeflow Versions
```bash
# migrate.sh <image-registry>
./migrate.sh 10.40.103.111:15001
```

# Migration Specific Kubeflow Version
```bash
# ./{kubeflow_version}.sh <image-registry>
./v1.3.0.sh 10.40.103.111:15001
```