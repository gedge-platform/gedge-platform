var express = require('express');
var router = express.Router();
var request = require('request');
var config = require("../config");

router.get('/kube/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.kube.api + req.url.substring(6,req.url.length),
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/met/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.monitoring.metric + req.url.substring(5,req.url.length),
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/pro/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.monitoring.promethuse + req.url.substring(5,req.url.length),
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/static/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.monitoring.promethuse + req.url,
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/gra/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.monitoring.grafana + req.url.substring(5,req.url.length),
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/api/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.monitoring.promethuse + req.url,
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/public/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': config.monitoring.grafana + req.url,
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

module.exports = router;