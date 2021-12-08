module plugin

go 1.16

replace etri.com/plugin v0.0.0 => ./etri.com/plugin

require (
	etri.com/plugin v0.0.0 // indirect
	github.com/spf13/cobra v1.1.3
	k8s.io/api v0.20.5
	k8s.io/client-go v0.20.5
)
