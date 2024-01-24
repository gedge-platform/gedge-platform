package typing

import "errors"

var ErrRoleNotFound = errors.New("could not match valid role")
var ErrPortNumConflict = errors.New("port numbers are conflicted")
var ErrResourceConvert = errors.New("could not convert given resource")
var ErrKubeletStatus = errors.New("kubelet is unhealthy")
var ErrKubeflowVersion = errors.New("mismatch format of kubeflow version")
var ErrStatusCode = errors.New("get error code server")
var ErrEmptyResponse = errors.New("get empty response body")
var ErrEmptyService = errors.New("get empty service ports")
var ErrKubeflowPort = errors.New("could not get kubeflow named port")
var ErrCancelled = errors.New("goroutine is canceled by context")
var ErrChannelReceived = errors.New("no data received from channel")
var ErrIpNotFound = errors.New("no free ip address")
var ErrK8sSetup = errors.New("failed to setup kubernetes")
