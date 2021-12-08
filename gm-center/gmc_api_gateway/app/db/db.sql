create table APPSTORE_INFO
(
    appNum         int unsigned auto_increment comment '앱 고유번호'
        primary key,
    appName        varchar(45)                           not null comment '앱 이름',
    appDescription varchar(2048)                         not null comment '앱 설명',
    appCategory    varchar(45)                           not null comment '앱 카테고리',
    appInstalled   tinyint                               not null comment '앱 설치 여부',
    created_at     timestamp default current_timestamp() not null on update current_timestamp() comment '앱 설치 일시'
)
    comment '앱스토어 목록';

create table APP_DETAIL
(
    appNum         int unsigned auto_increment comment '앱 고유번호'
        primary key,
    appName        varchar(45)                           not null comment '앱 이름',
    appDescription varchar(2048)                         not null comment '앱 설명',
    appVersion     varchar(45)                           not null comment '앱 버전',
    appDigest      varchar(45)                           not null comment '앱 Digest',
    created_at     timestamp default current_timestamp() not null on update current_timestamp() comment '앱 생성 일시'
)
    comment '앱 상세정보';

create table CLUSTER_INFO
(
    clusterNum      int unsigned auto_increment comment '클러스터 고유번호'
        primary key,
    ipAddr          varbinary(16)                           not null comment '클러스터 IP 주소',
    clusterName     varchar(45)                             not null comment '클러스터 이름',
    clusterType     varchar(45)                             not null comment '클러스터 타입',
    clusterEndpoint varchar(256)                            not null comment '클러스터 엔드포인트',
    clusterCreator  varchar(45)                             not null comment '클러스터 생성자',
    created_at      timestamp default '0000-00-00 00:00:00' not null on update current_timestamp() comment '클러스터 생성 일시',
    token           varchar(2048)                           null,
    constraint CLUSTER_INFO_clusterName_uindex
        unique (clusterName),
    constraint CLUSTER_INFO_ipAddr_uindex
        unique (ipAddr)
)
    comment '클러스터 정보 목록';

create index CLUSTER_INFO_MEMBER_INFO_memberName_fk
    on CLUSTER_INFO (clusterCreator);

create table MEMBER_INFO
(
    memberNum         int unsigned auto_increment comment '회원 고유번호'
        primary key,
    memberId          varchar(45)                              not null comment '회원 아이디',
    memberName        varchar(45)                              not null comment '회원 닉네임',
    memberEmail       varchar(45)                              not null comment '회원 이메일',
    memberPassword    varchar(256) default ''                  not null comment '회원 비밀번호',
    memberContact     varchar(45)                              not null comment '회원 연락처',
    memberDescription varchar(2048)                            null comment '회원 설명',
    memberEnabled     tinyint(1)   default 0                   not null comment '회원 활성화 여부',
    memberRole        varchar(45)  default 'GUEST'             not null comment '회원 권한',
    logined_at        timestamp    default current_timestamp() not null on update current_timestamp() comment '회원 로그인 일시',
    created_at        timestamp    default current_timestamp() not null on update current_timestamp() comment '회원 생성 일시',
    constraint MEMBER_INFO_memberEmail_uindex
        unique (memberEmail),
    constraint MEMBER_INFO_memberId_uindex
        unique (memberId),
    constraint MEMBER_INFO_memberName_uindex
        unique (memberName)
)
    comment '사용자 정보 목록';

create table WORKSPACE_INFO
(
    workspaceNum         int unsigned auto_increment comment '워크스페이스 고유번호'
        primary key,
    workspaceName        varchar(45)                           not null comment '워크스페이스 이름',
    workspaceDescription varchar(2048)                         null comment '워크스페이스 설명',
    selectCluster        varchar(2048)                         not null comment '프로젝트 개수',
    workspaceOwner       varchar(45)                           not null comment '워크스페이스 소유자',
    workspaceCreator     varchar(45)                           not null comment '워크스페이스 생성자',
    created_at           timestamp default current_timestamp() not null on update current_timestamp() comment '워크스페이스 생성 일시',
    constraint WORKSPACE_INFO_workspaceName_uindex
        unique (workspaceName),
    constraint WORKSPACE_INFO_MEMBER_INFO_memberName_fk
        foreign key (workspaceOwner) references MEMBER_INFO (memberName)
            on update cascade on delete cascade,
    constraint WORKSPACE_INFO_MEMBER_INFO_memberName_fk_2
        foreign key (workspaceCreator) references MEMBER_INFO (memberName)
            on update cascade on delete cascade
)
    comment '워크스페이스 정보 목록';

create table PROJECT_INFO
(
    projectNum         int unsigned auto_increment comment '프로젝트 고유번호'
        primary key,
    projectName        varchar(45)                               not null comment '프로젝트 이름',
    projectDescription varchar(2048)                             null comment '프로젝트 설명',
    projectType        varchar(45)                               not null comment '유저 프로젝트 / 시스템 프로젝트 구분',
    projectOwner       varchar(45)                               not null comment '프로젝트 소유자',
    projectCreator     varchar(45)                               not null comment '프로젝트 생성자',
    created_at         timestamp     default current_timestamp() not null on update current_timestamp() comment '프로젝트 생성 일시',
    workspaceName      varchar(45)                               not null comment '워크스페이스 이름',
    selectCluster      varchar(2048) default ''                  not null comment '선택한 클러스터',
    istioCheck varchar(45)                             null comment 'istio injection check'
',
    constraint PROJECT_INFO_projectName_uindex
        unique (projectName),
    constraint PROJECT_INFO_MEMBER_INFO_memberName_fk
        foreign key (projectOwner) references MEMBER_INFO (memberName)
            on update cascade on delete cascade,
    constraint PROJECT_INFO_MEMBER_INFO_memberName_fk_2
        foreign key (projectCreator) references MEMBER_INFO (memberName)
            on update cascade on delete cascade,
    constraint PROJECT_INFO_WORKSPACE_INFO_workspaceName_fk
        foreign key (workspaceName) references WORKSPACE_INFO (workspaceName)
            on update cascade on delete cascade
)
    comment '프로젝트 정보 목록';
