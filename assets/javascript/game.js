//Initializes Firebase
var config = {
  apiKey: "AIzaSyA_TTk9c-syf13C9pTxp9ByysVy9POPtlc",
  authDomain: "rps-ma.firebaseapp.com",
  databaseURL: "https://rps-ma.firebaseio.com",
  projectId: "rps-ma",
  storageBucket: "rps-ma.appspot.com",
  messagingSenderId: "320820250590"
};
firebase.initializeApp(config);
// Game Variables
var database = firebase.database();
var playerTurn = database.ref();
var players = database.ref("/players");
var player1 = database.ref("/players/player1");
var player2 = database.ref("/players/player2");
var player;
var p1snapshot;
var p2snapshot;
var p1result;
var p2result;
var p1 = null;
var p2 = null;
var wins1 = 0;
var wins2 = 0;
var losses1 = 0;
var losses2 = 0;
var playerNum = 0;
var chatting;

// Creates area for player to enter their name
$("#welcomeMessage").html(
  "<input id=playerName type=text placeholder='Enter Name Here'><input id=newPlayer type=submit class ='btn btn-success' value=Start>"
);

// Player 1 Updates
player1.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    p1 = snapshot.val().player;
    wins1 = snapshot.val().wins;
    losses1 = snapshot.val().losses;
    $("#playerOneName").html("<h2>" + p1 + "</h2>");
    $("#playerOneWinLoss").html(
      "<p>Wins: " + wins1 + "  Losses: " + losses1 + "</p>"
    );
  } else {
    $("#playerOneName").html("Waiting for Player 1..");
    $("#playerOneWinLoss").empty();
    if (p1 !== null) {
      database.ref("/chat/").push({
        player: p1,
        chat: " has disconnected",
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    }
  }
});

// Player 2 Updates
player2.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    p2 = snapshot.val().player;
    wins2 = snapshot.val().wins;
    losses = snapshot.val().losses;
    $("#playerTwoName").html("<h2>" + p2 + "</h2>");
    $("#playerTwoWinLoss").html(
      "<p>Wins: " + wins2 + "  Losses: " + losses2 + "</p>"
    );
  } else {
    $("#playerTwoName").html("Waiting for Player 2..");
    $("#playerTwoWinLoss").empty();
    if (p2 !== null) {
      database.ref("/chat/").push({
        player: p2,
        chat: " has disconnected",
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    }
  }
});

// Assign Players
$("#newPlayer").on("click", function() {
  event.preventDefault();
  player = $("#playerName")
    .val()
    .trim();
  player1.once("value", function(snapshot) {
    p1snapshot = snapshot;
  });
  player2.once("value", function(snapshot) {
    p2snapshot = snapshot;
  });
  if (!p1snapshot.exists()) {
    playerNum = 1;
    player1.onDisconnect().remove();
    player1.set({
      player: player,
      wins: 0,
      losses: 0
    });
    $("#welcomeMessage").html("Player One: " + player);
    if (!p2snapshot.exists()) {
      $("#gameMessage").html("Waiting for Player 2 to join..");
    }
  } else if (!p2snapshot.exists()) {
    playerNum = 2;
    player2.onDisconnect().remove();
    player2.set({
      player: player,
      wins: 0,
      losses: 0
    });
    playerTurn.update({
      turn: 1
    });
    $("#welcomeMessage").html("Player Two: " + player);
    $("#gameMessage").html("Waiting for " + p1 + " to choose..");
  } else {
    $("#welcomeMessage").html("Wait for Player to disconnect..");
  }
});
