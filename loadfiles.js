"use strict";
var fs = require('fs');

module.exports = {
  loadGoods: function (usrname, title, bestA, bestB) {
      var loc = usrname + "/TourFile";
      var filename = "tour" + title + ".txt";
      var results =
      {
          "bestA": bestA,
          "bestB": bestB
      }
      console.log("----")

      results.bestA = poachFileData('A', loc, filename);
      results.bestB = poachFileData('B', loc, filename);

      console.log("----");
      return results
  }
};

var poachFileData = function (letter,loc,filename) {
    var value = 0;
    var path = loc + letter + "/" + filename;

    var callback = function (err, data) {
        //error case
        if (err) return console.error(err);
        //normal case

        //sanitise data
        data = data.replace(/(\r\n|\n|\r)/gm,"").split(",");
        value = data[2].split("=")[1].replace(/\s/g, '');
        console.log("File Found; best length:", value);
        return value;
    };
    console.log("initialising " + letter);
    fs.readFile(path, "utf-8", callback);
    return value;
}
