import axios from "axios";

class PodMonitApi {
  URL = "api/activity/"; //http://localhost:9001/
  URL2 = "https://g-api.innogrid.cf/gmcapi/v1/services";
  token =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImVQSjAxVTY0TzlLOVlzQWx0WTNjVTNtYldOOGo4M0hWa3BBSHZYYU5kVGcifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJnZWRnZS1rdWJlLTEtdG9rZW4tcXRycm0iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZ2VkZ2Uta3ViZS0xIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMGY2YmZiOGEtODg0MC00YTdmLWFiZGQtYTQ4ZjllNjRlZjEyIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmdlZGdlLWt1YmUtMSJ9.N3xZQraQJP5uYtGbqxhxq48bAPTRUEOXobKHvfe3HpLD8dhshwZNLNTu-vcZ7D8Llt94flqjQyk2kfK5-uys8h9guXoBz2QEHOSsMTi6JxyupYNj0f0_oz13x2bp689oBJL9nEKpDcx5PKuhUUjXARUxqz4P3_kkODoI8na8PAx3s52CPQIBTh9Qj_jExoKbH2ko1AtPkHtAv1h15uaBvAL_Ycxexep0sHdT2JykQJURl9OFynr17RwKLy9tB3zP1o0jnntY3FPuVMLrGQPNH4ssPozUUkeE9osU4c6dZ0qT9ffzOnlAooJGw1KK8enJAHto1a5rl-u0iKiZ283T2Q";

  callAPI() {
    console.log(1);
    return axios({
      method: "get",
      url: this.URL2,
      headers: { Authorization: this.token },
    }).then((response) => (response && response.data) || null);
  }
}

export default PodMonitApi;
