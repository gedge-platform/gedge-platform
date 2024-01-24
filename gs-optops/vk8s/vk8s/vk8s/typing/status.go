package typing

type Status string

const (
	Allocated    = Status("allocated")
	Free         = Status("free")
	Deallocating = Status("deallocating")
)

func (s Status) IsValid() bool {
	if s == Allocated || s == Free || s == Deallocating {
		return true
	}
	return false
}

func (s Status) ToString() string {
	return string(s)
}
