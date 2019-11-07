const config = {
  apiKey: "AIzaSyDh6ljsAvArKRH_BUWy220GLlVu0qx9l2Y",
  authDomain: "project-4nala.firebaseapp.com",
  databaseURL: "https://project-4nala.firebaseio.com",
  projectId: "project-4nala",
  storageBucket: "project-4nala.appspot.com",
  messagingSenderId: "505152891528",
  appId: "1:505152891528:web:82a92afe1d86f35b644d3d"
};

firebase.initializeApp(config);

var database = firebase.database();

//   console.log(database);

$("#submit").on("click", function () {
  var trainName = $("#search-term").val().trim();
  var destination = $("#train-destination").val().trim();
  var trainTime = $("#train-time").val().trim();
  var trainFreq = $("#train-freq").val().trim();

  console.log(trainName, destination, trainTime, trainFreq);

  database.ref("trains").push({
    trainName: trainName,
    destination: destination,
    trainTime: trainTime,
    trainFreq: trainFreq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

database.ref("trains").on("child_added", function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var newTrain = snapshot.val();
  var trainBody = $("#train-data");

  var newRow = $("<tr>");
  var trainName = $("<td>").text(newTrain.trainName);
  var trainDest = $("<td>").text(newTrain.destination);
  var trainFreq = $("<td>").text(newTrain.trainFreq);
  var trainTime = $("<td>").text(newTrain.trainTime);
  // var trainMins = $("<td>").text(trainMins);

newRow.append(trainName);
newRow.append(trainDest);
newRow.append(trainFreq);
newRow.append(trainTime);


trainBody.append(newRow)


  console.log(newTrain.trainName);


  // Change the HTML to reflect
  // $("#name-display").text(newTrain.trainName);
  // $("#email-display").text(sv.email);
  // $("#age-display").text(sv.age);
  // $("#comment-display").text(sv.comment);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});