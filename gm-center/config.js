var config = {
    mysql: {
        host: "localhost",
        port: 3306,
        db: "database",
        username: "username",
        password: "password",
    },
    kube: {
    	api: "localhost:8001"
    },
    monitorig: {
    	metric: "localhost:9100",
		promethuse: "localhost:9090",
		grafana: "localhost:3000",
    }, 
}

module.exports = config;
