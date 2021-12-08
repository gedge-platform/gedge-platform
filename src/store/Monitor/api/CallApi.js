import axios from "axios";

class CallApi {
    baseurl = "http://192.168.150.197:8100";
    url = this.baseurl + "/gmcapi/v1/";

    basicAuth = { username: "admin", password: "qwe1212!Q" };
    // bearer_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2QVlHRVhJSmdHMld1LU5mcDlVY3NGRF9NZVowUjdOWERTNG42eGpnNVEifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJnZWRnZS1rdWJlLTItdG9rZW4tcWt6bHgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZ2VkZ2Uta3ViZS0yIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMjgxODM2NmEtOTZmYy00YmI0LWE1OWYtMDgzMjUyMjQ3MGE0Iiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmdlZGdlLWt1YmUtMiJ9.ntIH79P1iBCdh1IR3IavFe9kltedAnlS6EFq0qHVDHuSPcOJf4vn0GvcmH0IzlxOF0YC9w7N0WtqnQcBSSz8TU5GL4okDAmBuMV9VfS7-Tcm1Gw2I7AfkpTj6GqBlR8Vd3mquE_ETSYVouxF-D1X2UouHk6PmJDH60XgBCRQQSL47VTsJv5MxTYv3urIkUCkIgILm-HU3ElCEeszbWtDuhCgBU3b7dXhLG1cQjSNhied7pMrXYpC9CLGIhhtIzlAsUtf24ucFS2zf-atFsxsTHwRppaCrx5oEIa8CGk72UN9SPLMbOBy1Z8XytgTXdcXyoHChp0ayntSfK5bzoGScQ";
    // bearer = "Bearer " + this.bearer_token;
    callAPI(param) {
        const apiURL = this.url + param
        console.log("call GM-Center API (GET) : " + param);
        return axios({
            method: "get",
            url: apiURL,
            auth: this.basicAuth,
        }).then((response) => (response && response.data) || null)
            .catch((error) => {
                console.log("error : ", error);
            });

    }
    postAPI(param, body) {
        const apiURL = this.url + param
        console.log("call GM-Center API (POST) : " + param);
        return axios({
            method: "post",
            url: apiURL,
            auth: this.basicAuth,
            data: body
           }).then((response) => (response && response.data))
        // }).then((response) => (response && response.data) || null)
            // }).then((response) => (console.log()))
            .catch((error) => {
                console.log(error.response)
                console.log(error.response.data)
                var message = error.response.data
                return message;
            });
    }
}


export default CallApi;
