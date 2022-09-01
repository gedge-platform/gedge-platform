const TargetTypes = {
    CLUSTER: "cluster",
    APPLICATION: "app",
    NAMESPACE: "namespace",
    POD: "pod",
    NODE: "node",
};

const ClusterMetricTypes = {
    CPU_USAGE: "cpu_usage",
    CPU_UTIL: "cpu_util",
    CPU_TOTAL: "cpu_total",
    MEMORY_USAGE: "memory_usage",
    MEMORY_UTIL: "memory_util",
    MEMORY_TOTAL: "memory_total",
    DISK_USAGE: "disk_usage",
    DISK_UTIL: "disk_util",
    DISK_TOTAL: "disk_total",
    POD_QUOTA: "pod_quota",
    POD_RUNNING: "pod_running",
    POD_UTIL: "pod_util",
    APISERVER_REQUEST_RATE: "apiserver_request_rate",
    APISERVER_LATENCY: "apiserver_latency",
    // Error : Not found metric
    SCHEDULER_ATTEMPTS_TOTAL: "scheduler_attempts_total",
    SCHEDULER_FAIL_TOTAL: "scheduler_fail_total",
    SCHEDULER_LATENCY: "scheduler_latency",
    CPU_ALL: "cpu_usage|cpu_util|cpu_total",
    MEMORY_ALL: "memory_usage|memory_util|memory_total",
    DISK_ALL: "disk_usage|disk_util|disk_total",
    POD_ALL: "pod_quota|pod_running|pod_util",
    APISERVER_ALL: "apiserver_request_rate|apiserver_latency",
    SCHEDULER_ALL:
        "scheduler_fail_total|scheduler_latency|scheduler_attempts_total",
    PHYSICAL_ALL:
        "cpu_usage|cpu_util|cpu_total|memory_usage|memory_util|memory_total|disk_usage|disk_util|disk_total|pod_quota|pod_running|pod_util",
    ALL: "cpu_usage|cpu_util|cpu_total|memory_usage|memory_util|memory_total|disk_usage|disk_util|disk_total|pod_quota|pod_running|pod_util|apiserver_request_rate|apiserver_latency|scheduler_fail_total|scheduler_latency",
};

const AppMetricValues = {
    POD_COUNT: "pod_count",
    SERVICE_COUNT: "service_count",
    DEVPLOYMENT_COUNT: "deployment_count",
    CRONJOB_COUNT: "cronjob_count",
    JOB_COUNT: "job_count",
    PV_COUNT: "pv_count",
    PVC_COUNT: "pvc_count",
    NAMESPACE_COUNT: "namespace_count",
    ALL: "pod_count|service_count|deployment_count|cronjob_count|job_count|pv_count|pvc_count|namespace_count",
};

// Error : Not found metric
// const NamespaceMetricValues = {
//     NAMESPACE_CPU: "namespace_cpu",
//     NAMESPACE_MEMORY: "namespace_memory",
//     NAMESPACE_POD_COUNT: "namespace_pod_count",
// };

const PodMetricValues = {
    POD_CPU: "pod_cpu",
    POD_MEMORY: "pod_memory",
    POD_NET_BYTES_TRANSMITTED: "pod_net_bytes_transmitted",
    POD_NET_BYTES_RECEIVED: "pod_net_bytes_received",
    POD_ALL:
        "pod_cpu|pod_memory|pod_net_bytes_transmitted|pod_net_bytes_received",
};

const NodeMetricValues = {
    NODE_CPU_USAGE: "node_cpu_usage",
    NODE_CPU_UTIL: "node_cpu_util",
    NODE_CPU_TOTAL: "node_cpu_total",
    NODE_MEMORY_USAGE: "node_memory_usage",
    NODE_MEMORY_UTIL: "node_memory_util",
    NODE_MEMORY_TOTAL: "node_memory_total",
    NODE_DISK_USAGE: "node_disk_usage",
    NODE_DISK_UTIL: "node_disk_util",
    NODE_DISK_TOTAL: "node_disk_total",
    NODE_POD_RUNNING: "node_pod_running",
    NODE_POD_QUOTA: "node_pod_quota",
    NODE_DISK_INODE_UTIL: "node_disk_inode_util",
    NODE_DISK_INODE_TOTAL: "node_disk_inode_total",
    NODE_DISK_INODE_USAGE: "node_disk_inode_usage",
    NODE_DISK_READ_IOPS: "node_disk_read_iops",
    NODE_DISK_WRITE_IOPS: "node_disk_write_iops",
    NODE_DISK_READ_THROUGHPUT: "node_disk_read_throughput",
    NODE_DISK_WRITE_THROUGHPUT: "node_disk_write_throughput",
    NODE_NET_BYTES_TRANSMITTED: "node_net_bytes_transmitted",
    NODE_NET_BYTES_RECEIVED: "node_net_bytes_received",
    NODE_INFO: "node_info",
};

export {
    ClusterMetricTypes,
    TargetTypes,
    AppMetricValues,
    // NamespaceMetricValues,
    NodeMetricValues,
    PodMetricValues,
};
