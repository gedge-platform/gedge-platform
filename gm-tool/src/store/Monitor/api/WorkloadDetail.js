import axios from "axios";

class WorkloadDetail {
    URL = "https://g-api.innogrid.tech/gmcapi/v1/";
    URL2 = "http://g-api-test.innogrid.tech/kube/v1/"
    bearer_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2QVlHRVhJSmdHMld1LU5mcDlVY3NGRF9NZVowUjdOWERTNG42eGpnNVEifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJnZWRnZS1rdWJlLTItdG9rZW4tcWt6bHgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZ2VkZ2Uta3ViZS0yIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMjgxODM2NmEtOTZmYy00YmI0LWE1OWYtMDgzMjUyMjQ3MGE0Iiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmdlZGdlLWt1YmUtMiJ9.ntIH79P1iBCdh1IR3IavFe9kltedAnlS6EFq0qHVDHuSPcOJf4vn0GvcmH0IzlxOF0YC9w7N0WtqnQcBSSz8TU5GL4okDAmBuMV9VfS7-Tcm1Gw2I7AfkpTj6GqBlR8Vd3mquE_ETSYVouxF-D1X2UouHk6PmJDH60XgBCRQQSL47VTsJv5MxTYv3urIkUCkIgILm-HU3ElCEeszbWtDuhCgBU3b7dXhLG1cQjSNhied7pMrXYpC9CLGIhhtIzlAsUtf24ucFS2zf-atFsxsTHwRppaCrx5oEIa8CGk72UN9SPLMbOBy1Z8XytgTXdcXyoHChp0ayntSfK5bzoGScQ";
    bearer = "Bearer " + this.bearer_token;
    callPodAPI(param) {
        const apiURL = this.URL + param
        console.log("Pod");
        return axios({
            method: "get",
            url: apiURL,
            headers: { Authorization: this.bearer },
        }).then((response) => (response && response.data) || null);
    }

    callServiceAPI(param) {
        const apiURL = this.URL + param
        console.log("Service");
        return axios({
            method: "get",
            url: apiURL,
            headers: { Authorization: this.bearer },
        }).then((response) => (response && response.data) || null);
    }

    callEndpointAPI(param) {
        const apiURL = this.URL + param
        console.log("Endpoint");
        return axios({
            method: "get",
            url: apiURL,
            headers: { Authorization: this.bearer },
        }).then((response) => (response && response.data) || null);
    }
    callDeploymentAPI(param) {
        const apiURL = this.URL + param
        console.log("Deployment");
        return axios({
            method: "get",
            url: apiURL,
            headers: { Authorization: this.bearer },
        }).then((response) => (response && response.data) || null);
    }
    callNamespaceAPI(param) {
        const apiURL = this.URL + param
        console.log("Namespace");
        return axios({
            method: "get",
            url: apiURL,
            headers: { Authorization: this.bearer },
        }).then((response) => (response && response.data) || null);
    }
    callAPIv2(param, token) {
        const apiURL = this.URL2 + param
        const bearertoken = "Bearer " + token
        console.log("callAPIv2");
        return axios({
            method: "get",
            url: apiURL,
            headers: { Authorization: bearertoken },
        }).then((response) => (response && response.data) || null)
            .catch((error) => {
                console.log("error : ", error);
            });
    }
}
export default WorkloadDetail;
