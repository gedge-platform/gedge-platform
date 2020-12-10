var express = require('express');
var router = express.Router();
var request = require('request');
var mysql = require("mysql");

var pool = require('../db_pool').pool;

/* GET home page. */
router.get('/edges', function(req, res, next) {

  var sql = mysql.format(
      'select name, ip from fems_edges where status = "1"'
  );

  pool.getConnection(function(err, conn){
    conn.query(sql, function(err, rows) {
      if(err) { throw err; }
      if (rows.length === 0) {
        res.json('검색 결과가 없습니다.');
      } else {
        res.json(rows);
      }
    });
    conn.release();
  });
});

router.get('/edges/:name', function(req, res, next) {

  var sql = mysql.format(
      'SELECT ip, port FROM fems_edges WHERE STATUS = "1" AND NAME = ?',
      [req.params.name]
  );
  console.log(sql);

  console.log(req.query);

  pool.getConnection(function(err, conn){
    conn.query(sql, function(err, rows) {

      if(err) { throw err;}

      if (rows.length === 0) {
        res.json(false);
      } else {
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': 'http://'+ rows[0].ip +':'+ rows[0].port +'/api/v1/nodes',
        };
        console.log(options);
        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          var temp = JSON.parse(body);

          temp["name"] = req.params.name;
          temp["ip"] = rows[0].ip;

          delete temp["apiVersion"];
          delete temp["kind"];
          // delete temp["metadata"];
          delete temp["spec"];

          for (var i =0; i < temp["items"].length; i++) {
            // delete temp["items"][i]["status"]["addresses"];
            delete temp["items"][i]["status"]["daemonEndpoints"];
            delete temp["items"][i]["status"]["conditions"];
            delete temp["items"][i]["status"]["images"];
            temp["items"][i]["status"]["capacity"]["ephemeral_storage"] = temp["items"][i]["status"]["capacity"]["ephemeral-storage"];
            temp["items"][i]["status"]["allocatable"]["ephemeral_storage"] = temp["items"][i]["status"]["allocatable"]["ephemeral-storage"];
            delete temp["items"][i]["status"]["capacity"]["ephemeral-storage"];
            delete temp["items"][i]["status"]["allocatable"]["ephemeral-storage"];
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(temp))

        });
      }

    });
    conn.release();
  });
});

router.get('/repos/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': 'http://nexus.fems.cf/service/rest/v1/' + req.url.substring(7,req.url.length),
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/images/*', function(req, res, next) {

  var request = require('request');
  var options = {
    'method': 'GET',
    'url': 'http://registry.fems.cf/v2/' + req.url.substring(8,req.url.length),
  };
  console.log(options);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  }).pipe(res);
});

router.get('/kube/nodes/:name/*', function(req, res, next) {

  var sql = mysql.format(
      'SELECT ip, port FROM fems_edges WHERE STATUS = "1" AND NAME = ?',
      [req.params.name]
  );
  console.log(sql);

  console.log(req.query);

  pool.getConnection(function(err, conn){
    conn.query(sql, function(err, rows) {

      if(err) { throw err;}

      if (rows.length === 0) {
        res.json(false);
      } else {
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': 'http://'+ rows[0].ip +':'+ rows[0].port + "/kube/" + req.url.substring((12 + req.params.name.length) ,req.url.length),
        };
        console.log(options);
        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          var temp = JSON.parse(body);

          temp["name"] = req.params.name;
          temp["ip"] = rows[0].ip;

          delete temp["apiVersion"];
          delete temp["kind"];
          // delete temp["metadata"];

          for (var i =0; i < temp["items"].length; i++) {
            // delete temp["items"][i]["metadata"];
            delete temp["items"][i]["spec"];
            // delete temp["items"][i]["status"]["addresses"];
            delete temp["items"][i]["status"]["daemonEndpoints"];
            delete temp["items"][i]["status"]["conditions"];
            delete temp["items"][i]["status"]["images"];
            temp["items"][i]["status"]["capacity"]["ephemeral_storage"] = temp["items"][i]["status"]["capacity"]["ephemeral-storage"];
            temp["items"][i]["status"]["allocatable"]["ephemeral_storage"] = temp["items"][i]["status"]["allocatable"]["ephemeral-storage"];
            delete temp["items"][i]["status"]["capacity"]["ephemeral-storage"];
            delete temp["items"][i]["status"]["allocatable"]["ephemeral-storage"];
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(temp))

        });
      }

    });
    conn.release();
  });
});

router.get('/default/:name/*', function(req, res, next) {

  var sql = mysql.format(
      'SELECT ip, port FROM fems_edges WHERE STATUS = "1" AND NAME = ?',
      [req.params.name]
  );
  console.log(sql);

  console.log(req.query);

  pool.getConnection(function(err, conn){
    conn.query(sql, function(err, rows) {

      if(err) { throw err;}

      if (rows.length === 0) {
        res.json(false);
        } else {
          var request = require('request');
          var options = {
            'method': 'GET',
            'url': 'http://'+ rows[0].ip +':'+ rows[0].port + "/kube/" + req.url.substring((9 + req.params.name.length) ,req.url.length),
          };
          console.log(options);
          request(options, function (error, response, body) {
            if (error) throw new Error(error);

          var temp = JSON.parse(body);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(temp))

        });
      }

    });
    conn.release();
  });
});

module.exports = router;
