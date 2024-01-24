package broker

func Init() {
	go RunGRPCServer()
	go RunCoAPServer()
}
