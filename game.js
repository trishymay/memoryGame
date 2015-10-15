var current = [];
var allCards = [];

$("button").click(function() {
  $(".hashtag").hide();
  var hashtag = $("input").val() || "cats";
  var init = $.ajax({
    dataType: "jsonp",
    cache: false,
    url: "https://api.instagram.com/v1/tags/" + hashtag + "/media/recent?client_id=4a059e7a3f9d4870ac229cb32f390a91",
    success: function(data) {
      var cards = "";
      var indexNums = [];
      for(var i = 0; i < data.data.length; i++) {
        allCards.push(data.data[i].images.thumbnail);
        indexNums.push(i, i);
      }
      indexNums = shuffle(indexNums);
      while(indexNums.length) {
        cards += "<div class='back'><img class='hidden' src='" + allCards[indexNums.pop()].url + "'></div>";
      }
      $("div.game-board").html(cards);
    }
  });

  init.then(function() {
    listen();
  });
});


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

function listen() {
  $(".back").on("click", function() {
    $(".back").css("pointer-events", "none");
    $(this).children().removeClass("hidden");
    current.push($(this).children().attr('src'));
    $(this).removeClass("back").addClass("clicked");
      console.log("wtf");
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
  $(".clicked").children().remove();
  $(".clicked").addClass("complete");
  $(".clicked").removeClass("clicked");
  current = [];
  console.log("match");
}

function noMatch() {
  $(".clicked").children().addClass("hidden");
  $(".clicked").addClass("back").removeClass("clicked");
  current = [];
  console.log("not a match");
}

function enable() {
  setTimeout(function(){
    $(".back").css("pointer-events", "auto");
  }, 100);
}

function compare() {
  if (current[0] == current[1]) {
    match();
  } else {
    noMatch();
  }
  enable();
}


