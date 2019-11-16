$(document).ready(function () {

  const config = {
    apiKey: "AIzaSyDh6ljsAvArKRH_BUWy220GLlVu0qx9l2Y",
    authDomain: "project-4nala.firebaseapp.com",
    databaseURL: "https://project-4nala.firebaseio.com",
    projectId: "project-4nala",
    storageBucket: "project-4nala.appspot.com",
    messagingSenderId: "505152891528",
    appId: "1:505152891528:web:82a92afe1d86f35b644d3d"
  };

  //Initialize Firebase and create references for firebase data
  firebase.initializeApp(config);

  var database = firebase.database();

  function convertToMilitary(str){

  }

  function calculateNextArrivalTime(firstTrainTime, frequency) {
    // //Using moment to determine when the next train will arrive
    var currentTime = moment();

    // Use today for the current train day
    var trainDay = moment();
    var trainTimeObj = firstTrainTime.split(':');

    var trainDayHour = parseInt(trainTimeObj[0]);
    var trainDayMinutes = parseInt(trainTimeObj[1]);

    trainDay.hour(trainDayHour);
    trainDay.minute(trainDayMinutes);

    // Loop from start time, in increments of frequency, until loop time = (current time - frequency)
    var nextArrivalTime = null;
    var timeFound = false;
    var i = 0;
    do {
      trainDay.add(parseInt(frequency), 'm');
      //console.log('Time being checked is ' + trainDay.format("HH:mm") + ' and now is ' + currentTime.format("HH:mm"));
      if( !timeFound && currentTime.isBefore(trainDay, 'minute') ){
        timeFound = true;
        nextArrivalTime = trainDay.clone();
      }
    }
    while(!timeFound);

    console.log('The next arrival is at ' + nextArrivalTime.format("HH:mm"));

    var minutesAway = nextArrivalTime.diff(currentTime,'minutes');
    console.log(minutesAway + ' minutes away');

    return [nextArrivalTime.format("HH:mm"), minutesAway];
    // var timeDiff = currentTime - firstTrainTime;

    // var remainder = timeDiff % frequency;
    // if (remainder == 0) {
    //   return remainder;
    // }
    // var minsAway = frequency - remainder;
    //return minutesAway;
  }

  //   console.log(database);
  //Capture and log the values input by user
  $("#submit").on("click", function () {
    var trainName = $("#search-term").val().trim();
    var destination = $("#train-destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var trainFreq = $("#train-freq").val().trim();

    console.log(trainName, destination, firstTrainTime, trainFreq);

    //Function that reads when a value has changed within the database
    database.ref("trains").push({
      trainName: trainName,
      destination: destination,
      trainTime: firstTrainTime,
      trainFreq: trainFreq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });


  // Loop through all records in the db (or any new ones added)
  database.ref("trains").on("child_added", function(snapshot) {
    //console.log(snapshot.val());

    // storing the snapshot.val() in a variable for convenience
    var currTrain = snapshot.val();
    var trainBody = $("#train-data");

    // Call the function that calculates arrival time
    var nextArrivalTime = calculateNextArrivalTime(currTrain.trainTime, currTrain.trainFreq);
    //console.log(arrivalTime);


    // Adds data from firebase to the new columns
    var newRow = $("<tr>");
    var trainName = $("<td>").text(currTrain.trainName);
    var trainDest = $("<td>").text(currTrain.destination);
    var trainFreq = $("<td>").text(currTrain.trainFreq);
    var trainTime = $("<td>").text(nextArrivalTime[0]);
    var trainMins = $("<td>").text(nextArrivalTime[1]);

    // Appends the new columns to the new row
    newRow.append(trainName);
    newRow.append(trainDest);
    newRow.append(trainFreq);
    newRow.append(trainTime);
    newRow.append(trainMins);


    trainBody.append(newRow);

    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

  });

});