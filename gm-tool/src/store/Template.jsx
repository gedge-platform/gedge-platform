import { makeAutoObservable, runInAction, toJS } from "mobx";
import axios from "axios";
import { SERVER_URL } from "../config";

class Template {
  containerImageList = [
    {
      name: "web",
      versions: ["adamkdean/redirect"],
      port: 80,
      env: [
        { name: "REDIRECT_STATUS_CODE", value: "307" },
        {
          name: "REDIRECT_LOCATION",
          value: "https://templates.iqonic.design/metordash-node/",
        },
        { name: "PRESERVE_URL", value: "true" },
      ],
      type: "NodePort",
    },
    {
      name: "nginx",
      versions: ["latest", "1.24.0", "1.23.0", "1.20.0"],
      port: 80,
      type: "NodePort",
    },
    {
      name: "mysql",
      versions: ["latest", "8.0", "5.7.43"],
      port: 3306,
      env: [
        { name: "MYSQL_ROOT_PASSWORD", value: "hello123!@#" },
        { name: "MYSQL_DATABASE", value: "database_name" },
      ],
      type: "ClusterIP",
    },
  ];

  // deploymentYamlTemplate = {
  //   apiVersion: "apps/v1",
  //   kind: "Deployment",
  //   metadata: {
  //     name: "",
  //     namespace: "",
  //   },
  //   spec: {
  //     replicas: 1,
  //     selector: {
  //       matchLabels: {
  //         app: "",
  //       },
  //     },
  //     template: {
  //       metadata: {
  //         labels: {
  //           app: "",
  //         },
  //       },
  //       spec: {
  //         containers: [
  //           {
  //             name: "",
  //             image: "",
  //             // env: [],
  //             ports: [
  //               {
  //                 containerPort: 80,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //   },
  // };

  deploymentYamlTemplate = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: "",
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: "",
        },
      },
      template: {
        metadata: {
          labels: {
            app: "",
          },
        },
        spec: {
          containers: [
            {
              name: "",
              image: "",
              ports: [
                {
                  containerPort: 80,
                },
              ],
              // env 배열이 비어 있지 않은 경우에만 추가
              // ...(env.length > 0 && { env: env }),
            },
          ],
        },
      },
    },
  };

  webYamlTemplate = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: "",
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: "",
        },
      },
      template: {
        metadata: {
          labels: {
            app: "",
          },
        },
        spec: {
          containers: [
            {
              name: "",
              image: "adamkdean/redirect",
              ports: [
                {
                  containerPort: 80,
                },
              ],
              env: [
                {
                  name: "REDIRECT_STATUS_CODE",
                  value: "https://templates.iqonic.design/metordash-node/",
                },
                {
                  name: "PRESERVE_URL",
                  value: "true",
                },
              ],
            },
          ],
        },
      },
    },
  };

  serviceYamlTemplate = {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: "",
    },
    spec: {
      selector: {
        app: "",
      },
      ports: [
        {
          protocol: "TCP",
          port: 80,
          targetPort: 80,
        },
      ],
      type: "",
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  setDeploymentYamlTemplateFromAppInfo = (appInfo) => {
    this.deploymentYamlTemplate.metadata.name = appInfo.appName + "-deployment";
    this.deploymentYamlTemplate.spec.replicas = appInfo.appReplicas;
    this.deploymentYamlTemplate.spec.selector.matchLabels.app =
      appInfo.app + "-" + appInfo.appName;
    this.deploymentYamlTemplate.spec.template.metadata.labels.app =
      appInfo.app + "-" + appInfo.appName;
    this.deploymentYamlTemplate.spec.template.spec.containers[0].name =
      appInfo.appName;
    this.deploymentYamlTemplate.spec.template.spec.containers[0].image =
      appInfo.appVersion;
    if (appInfo.app === "web") {
      this.deploymentYamlTemplate.spec.template.spec.containers[0].image =
        appInfo.appVersion;
    } else {
      this.deploymentYamlTemplate.spec.template.spec.containers[0].image =
        appInfo.app + ":" + appInfo.appVersion;
    }
    this.deploymentYamlTemplate.spec.template.spec.containers[0].env =
      appInfo.appEnv;
    this.deploymentYamlTemplate.spec.template.spec.containers[0].ports[0].containerPort =
      appInfo.appPort;

    this.serviceYamlTemplate.metadata.name = appInfo.appName + "-service";
    this.serviceYamlTemplate.spec.selector.app =
      appInfo.app + "-" + appInfo.appName;
    this.serviceYamlTemplate.spec.ports[0].port = appInfo.appPort;
    this.serviceYamlTemplate.spec.ports[0].targetPort = appInfo.appPort;
    if (appInfo.app === "mysql") {
      this.serviceYamlTemplate.spec.type = "ClusterIP";
    } else {
      this.serviceYamlTemplate.spec.type = "NodePort";
    }
  };
}

const templateStore = new Template();
export default templateStore;
