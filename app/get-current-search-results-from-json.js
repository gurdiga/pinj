'use strict';

module.exports = getCurrentSearchResultsFromJSON;

function getCurrentSearchResultsFromJSON(users) {
  return function() {
    var levels = [
      DistrictCourts,
      SupremeCourt
    ];

    levels.forEach(function(sections) {
      sections.forEach(function(section) {
        section.subsectionNames.forEach(function(subsectionName) {
          var filePath = getFilePath(sections, section, subsectionName);
          var data = getData(filePath);

          users.forEach(function(user) {
            user.clientList.forEach(function(clientName) {
              user.results = getResults(data, section, clientName);
            });
          });
        });

        /*global gc*/
        gc();
      });
    });
  };
}

function getData(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}

function getResults(data, section, clientName) {
  // TODO
  return clientName;
}

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
var getFilePath = require('app/download-data').getFilePath;

var fs = require('fs');
