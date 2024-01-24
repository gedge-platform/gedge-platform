package typing

type Role string

const (
	master = Role("master")
	worker = Role("worker")
)

func (r Role) IsValid() bool {
	if r == master || r == worker {
		return true
	}
	return false
}

func (r Role) IsMaster() bool {
	if r == master {
		return true
	}
	return false
}

func (r Role) IsWorker() bool {
	if r == worker {
		return true
	}
	return false
}

func (r Role) ToString() string {
	return string(r)
}
