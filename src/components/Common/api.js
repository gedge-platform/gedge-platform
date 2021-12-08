import React from "react";
import axios from 'axios';
let baseurl = "http://192.168.150.114:8008";
let url = baseurl + "/gmcapi/v1";
let basicAuth = { username: "admin", password: "qwe1212!Q" }
let bearer_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2QVlHRVhJSmdHMld1LU5mcDlVY3NGRF9NZVowUjdOWERTNG42eGpnNVEifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJnZWRnZS1rdWJlLTItdG9rZW4tcWt6bHgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZ2VkZ2Uta3ViZS0yIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMjgxODM2NmEtOTZmYy00YmI0LWE1OWYtMDgzMjUyMjQ3MGE0Iiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmdlZGdlLWt1YmUtMiJ9.ntIH79P1iBCdh1IR3IavFe9kltedAnlS6EFq0qHVDHuSPcOJf4vn0GvcmH0IzlxOF0YC9w7N0WtqnQcBSSz8TU5GL4okDAmBuMV9VfS7-Tcm1Gw2I7AfkpTj6GqBlR8Vd3mquE_ETSYVouxF-D1X2UouHk6PmJDH60XgBCRQQSL47VTsJv5MxTYv3urIkUCkIgILm-HU3ElCEeszbWtDuhCgBU3b7dXhLG1cQjSNhied7pMrXYpC9CLGIhhtIzlAsUtf24ucFS2zf-atFsxsTHwRppaCrx5oEIa8CGk72UN9SPLMbOBy1Z8XytgTXdcXyoHChp0ayntSfK5bzoGScQ";
let bearer = 'Bearer ' + bearer_token;

let baseurl_v2 = "https://g-api-test.innogrid.tech";
let url_v2 = baseurl_v2 + "/api/v2/cluster1/";
let bearer_token_v2 = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2QVlHRVhJSmdHMld1LU5mcDlVY3NGRF9NZVowUjdOWERTNG42eGpnNVEifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJnZWRnZS1rdWJlLTItdG9rZW4tcWt6bHgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZ2VkZ2Uta3ViZS0yIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMjgxODM2NmEtOTZmYy00YmI0LWE1OWYtMDgzMjUyMjQ3MGE0Iiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmdlZGdlLWt1YmUtMiJ9.ntIH79P1iBCdh1IR3IavFe9kltedAnlS6EFq0qHVDHuSPcOJf4vn0GvcmH0IzlxOF0YC9w7N0WtqnQcBSSz8TU5GL4okDAmBuMV9VfS7-Tcm1Gw2I7AfkpTj6GqBlR8Vd3mquE_ETSYVouxF-D1X2UouHk6PmJDH60XgBCRQQSL47VTsJv5MxTYv3urIkUCkIgILm-HU3ElCEeszbWtDuhCgBU3b7dXhLG1cQjSNhied7pMrXYpC9CLGIhhtIzlAsUtf24ucFS2zf-atFsxsTHwRppaCrx5oEIa8CGk72UN9SPLMbOBy1Z8XytgTXdcXyoHChp0ayntSfK5bzoGScQ";
let bearer_v2 = 'Bearer ' + bearer_token_v2;

let cluster3_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkVnaWxNQVVfZHlWUFJPbUpLTnd6WGpiRUhsQ2o3QU44czZ4dHAtTlZCZEkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRlZmF1bHQtdG9rZW4tbHpwNTQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGVmYXVsdCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjNhMjI1MzVjLWFjYmQtNDkzMC1iNjEzLTE2M2VjMTkxZGFiMyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OmRlZmF1bHQifQ.jY-O4QkbXySylm0fOco0CHLPB73lYvapaQc4hirYe7LmJLNdyfGzDJLrgns_1co_8KjfvwcNWK148Yj6KKKoQHE65_lsPyQSJJ_Nko67mF8yFAXpLUYCv5-CM4kBe_mgg3Q-oo3K_rF2pUR2z023K4A83g5Nxz-zeNddxGPaRvu1NfqAIYliUuN8YwEOwRE3CyLDjYKPnb0paZbnB2z2MWWED8hikpfLIXqnKGPnm5nRGMdqY19f0fY-F63ahf2szLKWL6f5l9v7Z4OKMpbXNan7itvvkTX-S0SaR9SFRB5oYXEx1sFeJe4fRD3s9HL-0RH5RESYd3nwm99BydH0kw"

const getAPI = async (param, method) => {
  let api_url = url + param;
  let list = [];
  return axios({
    method: method,
    mode: 'cors',
    auth: basicAuth,
    url: api_url
    // body: 'A=1&B=2'
  })
    .then((response) => (response && response.data) || null);
}

// const clusters = await Promise.all(group.map(clusterName => {
//   // console.log(clusterName)
//   clusterList = this.dbApi.callAPI("clusters/" + clusterName)
//   // console.log(clusterList)
//   // let cluster = this.dbApi.callAPI("clusters/" + clusterName);
//   return clusterList
// }))


async function getDetailAPI(param, method) {
  let api_url = url + param;
  return fetch(api_url, {
    method: method,
    mode: 'cors',
    headers: {
      'Authorization': bearer,
      // 'Access-Control-Request-Headers': '*'
      //   'Content-Type': 'application/json'
    }
    // body: 'A=1&B=2'
  })
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
        // console.log(json.items)
      })
    );
}
async function getnamespaceAPI(param, method) {
  let api_url = url + param;
  return fetch(api_url, {
    method: method,
    mode: 'cors',
    headers: {
      'Authorization': bearer,
      // 'Access-Control-Request-Headers': '*'
      //   'Content-Type': 'application/json'
    }
    // body: 'A=1&B=2'
  })
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json.items;
        // console.log(json.items)
      })
    );
}

async function getDetailAPIv2(param, method) {
  let api_url = url_v2 + param;
  return fetch(api_url, {
    method: method,
    mode: 'cors',
    headers: {
      'Authorization': bearer_v2,
      // 'Access-Control-Request-Headers': '*'
      //   'Content-Type': 'application/json'
    }
    // body: 'A=1&B=2'
  })
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
        // console.log(json);
      })
    );
}

// async function Axioscall(param, method) {
//   let api_url = url + param;
//   console.log(api_url, "api_url")
//   try {
//     const response = axios({
//       method: method,
//       url: api_url,
//       mode: 'cors',
//       auth: basicAuth,
//       responseType: "type"

//     }).then(response => console.log(response.data));
//     // return response.data
//   } catch (e) {
//     console.log(e);
//   }
// }
async function Axioscall(param, method) {
  let api_url = url + param;

  return await axios({
    method: method,
    url: api_url,
    auth: basicAuth,
  }).then((response) => (response && response.data) || null);
}

// async testFunction() {
//   const response = await axios.get('api/test')
// // }
// try {
//   const response = axios({
//     method: method,
//     url: api_url,
//     mode: 'cors',
//     // headers: {
//     //   'Authorization': bearer,
//     //   // 'Access-Control-Request-Headers': '*',
//     //   // 'Content-Type': 'application/json'
//     // }
//     auth: {
//       username: "admin",
//       password: "qwe1212!Q"
//     },
//   }).then((response) => (response && response.data) || null);
// } catch (e) {
//   console.log(e);
// }
// }

// const getDetailAPI = async (param, method) => {
//     let api_url = url + param;
//     return fetch(api_url, {
//         method: method,
//         mode: 'cors',
//         headers: {
//             'Authorization': bearer,
//             // 'Access-Control-Request-Headers': '*'
//             //   'Content-Type': 'application/json'
//         }
//         // body: 'A=1&B=2'
//     })
//         .then(response => {
//             response.json();
//             .then(function(json) => {
//                 return json
//             })
// })}
// if (!json.ok) {
//     return Promise.reject(json);
// } return json
// let response = await fetch(api_url, {
//     method: method,
//     mode: 'cors',
//     headers: {
//         'Authorization': bearer,
//     }
// })

// try {
//     let json = await Promise.resolve(JSON.parse(response.json()))
//     return json
// } catch (error) {
//     await Promise.reject(error)
// }
// let response = await fetch(api_url, {
//     method: method,
//     mode: 'cors',
//     headers: {
//         'Authorization': bearer,
//     }
// })
// return Promise.all(response)
//     .then((res) => res.map((el => el.json())))
//     .then((data) => Promise.all(data))
//     .then((data) => {
//         return data
//     })
// export { getAPI, Axioscall }

export { getAPI, getDetailAPI, getDetailAPIv2, Axioscall, getnamespaceAPI }
