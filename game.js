var current = [];
var allCards = [];
var totalTries = 0;
var totalMatched = 0;
var boardSize;
var errorMsg = "<h1 class='error'>This subject returned no images.  Please try another subject.</h1>";
var testing;

$(".hashtag").click(startGame);

$("input").keydown(function(event){
  if (event.which === 13) startGame();
});

$(".reset").click(reset);

function startGame () {
  boardSize = +$('input[name=GameSize]:checked').val();
  $(".pregame").hide();
  var hashtag = $("input.text").val() || "travel";
  var init = $.ajax({
    dataType: "jsonp",
    cache: false,
    url: "https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?client_id=4a059e7a3f9d4870ac229cb32f390a91",
    success: function(data) {
      if (data.data && data.data.length === 20) {
        var cards = "";
        var indexNums = [];
        for(var i = 0; i < boardSize; i++) {
          allCards.push(data.data[i].images.thumbnail);
          indexNums.push(i, i);
        }
        indexNums = shuffle(indexNums);
        while(indexNums.length) {
          cards += "<div class='card'><img class='hidden' src='" + allCards[indexNums.pop()].url + "'></div>";
        }
        $("div.game-board").html(cards);
        var h = getHeight();
        var w = getWidth();
        console.log(h, w);
        $("div.game-board").height(h);
        $("div.game-board").width(w);
        $("div.sidebar").height(h);
      }
    }
  });

  init.then(function() {
    if (allCards.length) {
      $(".gameInProcess").removeClass("hidden");
      listen();
    } else {
      reset();
      $("div.game-board").html(errorMsg).width("460").removeClass("hidden");
    }
  });
}

//Fisher–Yates Shuffle
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function getHeight() {
  if (boardSize === 4) return 230;
  if (boardSize === 20) return 575;
  return 460;
}

function getWidth() {
  if (boardSize === 4 || boardSize === 8) return 460;
  if (boardSize === 12) return 690;
  return 920;
}

function listen() {
  $(".card").on("click", function() {
    $("body").css("pointer-events", "none");
    $(this).children().removeClass("hidden");
    current.push($(this).children().last().attr("src"));
    $(this).removeClass("card").addClass("clicked");
    if(current.length > 1) {
      setTimeout(function(){
        console.log('compare');
        compare();
      }, 1000);
    } else {
      console.log('enable');
      enable();
    }
  });
  console.log("listen");
}

function match() {
  totalMatched++;
  $(".matches").html(totalMatched);
  $(".clicked").children().remove();
  $(".clicked").addClass("complete");
  $(".clicked").removeClass("clicked");

  current = [];
  console.log("match");
}

function noMatch() {
  $(".clicked").children().addClass("hidden");
  $(".clicked").removeAttr("style");
  $(".clicked").addClass("card").removeClass("clicked");
  current = [];
  console.log("not a match");
}

function enable() {
  setTimeout(function(){
    $("body").css("pointer-events", "auto");
    $(".clicked").css("pointer-events", "none");
  }, 100);
}

function compare() {
  totalTries++;
  $(".attempts").html(totalTries);
  if (current[0] === current[1]) {
    match();
  } else {
    noMatch();
  }
  if (totalMatched === boardSize) {
    win();
  }
  enable();
}

function win() {
  var winner = '<p class="win">Congratulations!<br>You won!!</p>';
  $("div.game-board").html(winner);
}

function reset() {
  current = [];
  allCards = [];
  totalTries = 0;
  totalMatched = 0;
  $("div.game-board").empty();
  $(".pregame").show();
  $(".gameInProcess").addClass("hidden");
  $("input.text").val("");
  $(".attempts").html(totalTries);
  $(".matches").html(totalMatched);
}



