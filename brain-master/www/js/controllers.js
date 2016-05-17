const GRID = 2;
const SCORE = 0;
const ERRORS = 0;
const TIME = 15; // seconds time
const LEVEL = 1;
const SLEVEL1 = 15;
const SLEVEL2 = 30;

var getElements = function() {
  var elems = {};
  var container = $('.eyetest-container')
  elems.$box = $('.eyetest-content', container);
  elems.$timeCount = $('.time-count', container);
  elems.$error = $('.error-count', container);
  elems.$score = $('.score-count div', container);
  elems.$gameover = $('.game-over');
  return elems;
};
var randomColor = function(level) {
  var colordiff=colorTestLevelColorDiff(level);
  var r=Math.floor(Math.random()*(255-colordiff));
  var g=Math.floor(Math.random()*(255-colordiff));
  var b=Math.floor(Math.random()*(255-colordiff));
  var color = {
    general: 'rgb(' + b.toString() + ',' + g.toString() + ',' + b.toString() + ')',
    differrent: 'rgb(' + (b+colordiff).toString() + ',' + (g+colordiff).toString() + ',' + (b+colordiff).toString() + ')',
  }
  return color;
};
function colorTestLevelColorDiff(level) {
  if(level<=58) {
    var col=[105,75,60,45,30,20,18,16,15,15,15,14,14,14,13,13,13,12,12,12,11,11,11,10,10,9,9,8,8,7,7,7,7,6,6,6,6,5,5,5,5,4,4,4,4,3,3,3,3,2,2,2,2,1,1,1,1,1];
    return col[level-1];
  }
  return 1;
};
function colorTestLevelGrid(level) {
  if(level<2) return 2;
  if(level<4) return 3;
  if(level<8) return 4;
  if(level<13) return 5;
  if(level<22) return 6;
  if(level<32) return 7;
  if(level<36) return 8;  
  if(level<40) return 9;  
  if(level<44) return 10; 
  if(level<48) return 11; 
  return 12;
};

var app = angular.module('starter.controllers', [])
app.value('myconfig', {
  grig: GRID,
  score: SCORE,
  errors: ERRORS,
  timeout: TIME,
  level: LEVEL,
  achive: {
    level1: 10,
    level2: 20,
    level3: 30,
    level4: 40,
    level5: 50
  }
});
app.controller('HomeCtrl', function($scope) {})
.controller('GameCtrl', function($scope) {
  console.log(11111);
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('GameCtrl', function ($scope, $interval, myconfig) {
  $scope.elems = getElements();
  $scope.score = myconfig.score;
  $scope.errors = myconfig.errors;
  $scope.gameTime = myconfig.timeout;
  $scope.level = myconfig.level;
  $scope.gameover = false;
  $scope.gameTimeout = null;
  console.log(myconfig);
  $scope.reInit = function() {
    
    this.score = myconfig.score;
    this.errors = myconfig.errors;
    this.gameTime = myconfig.timeout;
    this.level = myconfig.level;
    this.gameover = false;
    this.gameTimeout = null;
  };

  $scope.startGame = function() {
    this.elems.$gameover.hide();
    if (!this.elems.$box.is(':visible')) {
      
      this.elems.$box.fadeIn(400);
    }
    var color = randomColor($scope.level);
    var width = window.innerWidth;
    var height = window.innerHeight;
    var grid = colorTestLevelGrid(this.level);
    var specialCell = Math.floor((Math.random() * grid * grid));

    if (width <= 330) {
      width =  height/2 - 20;
    } else if (width > 330 && width <= 360) {
      width =  width - width/5;
    } else if (width > 360 && width <= 630) {
      width = width - width/5;
    } else {
      width = width/3 - width/10;
    }

    this.gameover = false;
    this.elems.$box.width(width);
    this.elems.$box.height(width);
    this.elems.$box.css('visibility', '');
    this.elems.$box.empty();
    this.elems.$error.text($scope.errors);
    this.elems.$timeCount.text($scope.gameTime);
    for (var j = 0; j < grid*grid; j++) {
      var td = $('<div/>');
      td.addClass('cell');
      td.css({
        
        'width': (100/grid).toString()+'%',
        'height': (100/grid).toString()+'%',
        'backgroundColor': color.general});
      if (j == specialCell) {
        td.css('backgroundColor', color.differrent);
        td.addClass('specialCell');
      } else {
        td.addClass('normalCell');
      }
      this.elems.$box.append(td);
    }
    $('.specialCell').click(function(e) {
      $scope.confirm(true);
    });
    $('.normalCell').click(function(e) {
      $scope.confirm(false);
    });
    $interval.cancel($scope.gameTimeout);
    if ($scope.score != 0) {
      $scope.gameTimeout = $interval($scope.update, 1000);
    }
  };
  $scope.confirm = function(answer) {

    if (answer) {
      // next 
      $scope.score += 1;
      this.gameTime = TIME; // reset game time
      // this.elems.$score.text(this.score);
      this.level++;
      // media.play('ding', '../media/ding.MP3');
      this.startGame();
      $scope.elems.$score.text($scope.score);
    } else {
      // playSound('error', 'media/error.mp3');
      if (this.score != 0) {

        // degree time 3 seconds
        // if time equal 0 then endgame
        this.errors += 1;
        this.elems.$error.text(this.errors);
        if (this.gameTime > 4) {
          this.gameTime -= 3;
          this.elems.$timeCount.text(this.gameTime);
        }
        else {
          // end game
          this.endGame();
        }
      }
    }
  };
  $scope.update = function() {

    if ($scope.gameTime <= 0)
      $scope.endGame();
    else {
      $scope.gameTime -= 1;
      // move($scope.elems.$timeCount[0])
      // .ease('snap')
      // .set('opacity', 1)
      // .scale(1.4)
      // .duration('0s')
      // .end();

      // move($scope.elems.$timeCount[0])
      // .ease('out')
      // .x(150)
      // .rotate(140)
      // .scale(0.1)
      // .set('opacity', 1)
      // .duration('1s')
      // .end();
      $scope.elems.$timeCount.text($scope.gameTime);
    }
  };
  $scope.endGame = function() {
    // var highScore = localStorage.getItem("PK-EyeTest-HighScore") ? localStorage.getItem("PK-EyeTest-HighScore") : 0;
    this.gameover = true;
    $interval.cancel($scope.gameTimeout);

    // if (highScore < this.score) {
    //     highScore = this.score;
    //     submitScore();
    // }
    // if (typeof(Storage) != "undefined") {
    //       // Store
    //       localStorage.setItem("PK-EyeTest-HighScore", highScore);
    //   }
    //   submitAchivement();
    // if (this.score < SLEVEL1)
    //   playSound('gameover', 'media/gameover.mp3');
    // else if (this.score < SLEVEL2) {
    //   playSound('owesome', 'media/awesome.mp3');
    // } else {
    //   playSound('genius', 'media/genius.mp3');
    // }
    this.elems.$timeCount.text(0);
    this.elems.$box.hide();
    this.elems.$gameover.fadeIn(500, 'swing');
    $scope.reInit();
  };
  $scope.startGame();

});
app.directive("gameover", function() {
    return {
        template : '<div class="game-over text-center">\
            <div class="col gameover-title calm">GAME OVER</div>\
            <div class="col">\
                <button class="button balanced ion-share share-game"> Share</button>\
                <button class="button balanced ion-play start-game" ng-click="startGame()"> Play</button>\
            </div>\
            <div class="col">\
                <button class="button icon-top ion-trophy energized"> Achie</button>\
                <button class="button ion-stats-bars leaderboard-game assertive"> Leaderboard</button>\
                <button class="button ion-star rate-game energized"> Rate</button>\
            </div>\
        </div>'
    };
});