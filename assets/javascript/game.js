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
var database = firebase.database();

// Game Variables
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
var loss1 = 0;
var loss2 = 0;
var playerNumber = 0;

// Creates area for player to enter their name
$("#welcomeMessage").html(
  "<input id='playerName' type='text' placeholder='Enter Name Here'><input id='newPlayer' type='submit' class='btn btn-success' value='Start'>"
);

// Player 1 Updates
player1.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    p1 = snapshot.val().player;
    wins1 = snapshot.val().wins;
    loss1 = snapshot.val().losses;
    $("#playerOneName").html("<h3>" + p1 + "</h3>");
    $("#playerOneWinLoss").html(
      "<br><p>[ Wins: " + wins1 + " ][ Losses: " + loss1 + " ]</p>"
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
    $("#playerTwoName").html("<h3>" + p2 + "</h3>");
    $("#playerTwoWinLoss").html(
      "<br><p>[ Wins: " + wins2 + " ][ Losses: " + loss2 + " ]</p>"
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
    playerNumber = 1;
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
    playerNumber = 2;
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

// Reset Game when players disconnect
players.on("value", function(snapshot) {
  if (snapshot.val() == null) {
    playerTurn.set({});
  }
});

// Get Players Choice
var findResults = function() {
  player1.once("value", function(snapshot) {
    p1result = snapshot;
  });
  player2.once("value", function(snapshot) {
    p2result = snapshot;
  });

  // Game Section
  if (p1result.val() !== null && p2result.val() !== null) {
    if (p1result.val().choice == p2result.val().choice) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>Tie Game!</h2>");
    } else if (
      p1result.val().choice == "ROCK" &&
      p2result.val().choice == "SCISSORS"
    ) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>" + p1 + " wins!</h2>");
      wins1++;
      loss2++;
    } else if (
      p1result.val().choice == "PAPER" &&
      p2result.val().choice == "ROCK"
    ) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>" + p1 + " wins!</h2>");
      wins1++;
      loss2++;
    } else if (
      p1result.val().choice == "SCISSORS" &&
      p2result.val().choice == "PAPER"
    ) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>" + p1 + " wins!</h2>");
      wins1++;
      loss2++;
    } else if (
      p1result.val().choice == "ROCK" &&
      p2result.val().choice == "PAPER"
    ) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>" + p2 + " wins!</h2>");
      wins2++;
      loss1++;
    } else if (
      p1result.val().choice == "PAPER" &&
      p2result.val().choice == "SCISSORS"
    ) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>" + p2 + " wins!</h2>");
      wins2++;
      loss1++;
    } else if (
      p1result.val().choice == "SCISSORS" &&
      p2result.val().choice == "ROCK"
    ) {
      $("#playerOneChoices").html(
        "<img src='assets/images/" + p1result.val().choice + ".png'>"
      );
      $("#playerTwoChoices").html(
        "<img src='assets/images/" + p2result.val().choice + "2.png'>"
      );
      $("#gameMessage").html("<h2>" + p2 + " wins!</h2>");
      wins2++;
      loss1++;
    }

    // Replay Game
    setTimeout(function() {
      playerTurn.update({
        turn: 1
      });
      player1.once("value", function(snapshot) {
        p1result = snapshot;
      });
      if (p1result.val() !== null) {
        player1.update({
          wins: wins1,
          losses: loss1
        });
      }
      player2.once("value", function(snapshot) {
        p2result = snapshot;
      });
      if (p2result.val() !== null) {
        player2.update({
          wins: wins2,
          losses: loss2
        });
      }
      $("#gameMessage").html("");
      $("#playerTwoChoices").html("");
    }, 3000);
  }
};

// Database Update
playerTurn.on("value", function(snapshot) {
  if (snapshot.val() !== null) {
    if (snapshot.val().turn == 2 && playerNumber == 1) {
      $("#gameMessage").html("Waiting for " + p2 + " to choose..");
    } else if (snapshot.val().turn == 1 && playerNumber == 2) {
      $("#playerOneChoices").html("");
      $("#gameMessage").html("Waiting for " + p1 + " to choose..");
    }
    if (snapshot.val().turn == 1 && playerNumber == 1) {
      $("#playerOneChoices").empty();
      $("#playerOneChoices").append(
        "<div class='btn-block btn-secondary choice'>ROCK</div>"
      );
      $("#playerOneChoices").append(
        "<div class='btn-block btn-secondary choice'>PAPER</div>"
      );
      $("#playerOneChoices").append(
        "<div class='btn-block btn-secondary choice'>SCISSORS</div>"
      );
      $("#gameMessage").html("<h2>- Your Turn -</h2>");
    } else if (snapshot.val().turn == 2 && playerNumber == 2) {
      $("#playerTwoChoices").empty();
      $("#playerTwoChoices").append(
        "<div class='btn-block btn-secondary choice'>ROCK</div>"
      );
      $("#playerTwoChoices").append(
        "<div class='btn-block btn-secondary choice'>PAPER</div>"
      );
      $("#playerTwoChoices").append(
        "<div class='btn-block btn-secondary choice'>SCISSORS</div>"
      );
      $("#gameMessage").html("<h2>- Your Turn -</h2>");
    } else if (snapshot.val().turn == 3) {
      $("#gameMessage").html("");
      findResults();
    }
  }
});

// Displays Players Choice
$("#playerOneChoices").on("click", "div", function() {
  var choice = $(this).text();
  $("#playerOneChoices").html("<img src='assets/images/" + choice + ".png'>");
  setTimeout(function() {
    playerTurn.update({
      turn: 2
    });
    player1.update({
      choice: choice
    });
  }, 300);
});
$("#playerTwoChoices").on("click", "div", function() {
  var choice = $(this).text();
  $("#playerTwoChoices").html("<img src='assets/images/" + choice + "2.png'>");
  setTimeout(function() {
    player2.update({
      choice: choice
    });
    playerTurn.update({
      turn: 3
    });
  }, 300);
});

// Chat Functions
$("#chatButton").on("click", function(event) {
  event.preventDefault();
  var text = $("#userChat")
    .val()
    .trim();
  if (text !== "") {
    $("#userChat").val("");
    database.ref("/chat/").push({
      player: player + ": ",
      chat: text,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }
});

database
  .ref("/chat")
  .orderByChild("dateAdded")
  .on("child_added", function(snapshot) {
    $("#chatBox").append(snapshot.val().player + snapshot.val().chat + "<br>");
  });
