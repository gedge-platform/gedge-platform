import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let users = [
  { id: 1, username: 'admin', password: '123456', email: 'admin@innogrid.tech' }
];

const fakeBackend = () => {
  // This sets the mock adapter on the default instance
  var mock = new MockAdapter(axios);

  mock.onPost('/post-register').reply(function (config) {

    const user = JSON.parse(config['data']);
    users.push(user);

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve([200, user]);
      });
    });
  });

  mock.onPost('/post-login').reply(function (config) {
    const user = JSON.parse(config['data']);
    const validUser = users.filter(usr => usr.email === user.username && usr.password === user.password);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (validUser['length'] === 1) {
          resolve([200, validUser[0]]);
        } else {
          reject([400, "Username and password are invalid. Please enter correct username and password"]);
        }
      });
    });
  });

  mock.onPost('/forget-pwd').reply(function (config) {
   // User needs to check that user is eXist or not and send mail for Reset New password

   return new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve([200, "Check you mail and reset your password."]);
    });
  });
 
  });

}

export default fakeBackend;