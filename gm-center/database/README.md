# GM-Center Database
GM-Center Database with Docker



## Clone & Run
```bash
# Clone this project
git clone https://github.com/gedge-platform/gm-center.git
cd ./gm-center/database/
# set your environment
cp .env.sample .env
vim .env
# run
docker-compose up -d
```

Before running Database, you should set the .env file with yours or set the your .env with my values on [.env](github.com/gedge-platform/gm-center/main/database/blob/main/.env.sample)
```go
# DB
MYSQL_ROOT_PASSWORD=YourP@ss
MYSQL_DATABASE=gedge
MYSQL_USER=gedge
MYSQL_PASSWORD=YourP@ss
MARIADB_HOST=gedge-db
MARIADB_PORT=3306
```



## Structure
```
└── .env.sample
└── docker-compose.yml
└── README.md
```

