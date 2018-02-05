// 앵귤라 모듈 만들기
var app = angular.module("MyFriend", []);
app.controller("myfriend", function($rootScope,$scope, $http, LoginService){
	LoginService.async().then(function(){
		var result = LoginService.data();
		console.log("세션",result.data);
  	   if(result.data.status == 0){
  		  $rootScope.loginbool = false;
  		  $scope.selectBest();
  	   }else if(result.data.status == 1){
  		  $rootScope.user = result.data.user;
  		  $rootScope.loginbool = true;
  		  $scope.selectBest();
  	   }
	});
	$scope.friend={};
	$scope.data={};
	$scope.inven={};
	$scope.roomon=false;
	$scope.selectBest = function(){
	      $http.post("selectbest", "")
	           .then(function(result){ // 성공하면 오는 곳
	        	   $scope.friend = result.data.result;
	        	   console.log($scope.friend);
	          }, function(result){ // 실패(오류) 하면 오는 곳
	            console.log(result);
	       });
	}
	$scope.selectfriend = function(){
	      $http.post("selectfriend", "", {params: $scope.friend})
	           .then(function(result){ // 성공하면 오는 곳
	        	   $scope.friend = result.data.result;
	        	   console.log($scope.friend);
	          }, function(result){ // 실패(오류) 하면 오는 곳
	            console.log(result);
	   });
	}
	$scope.findroom = function(index){
	      $http.post("findroom", "", {params: $scope.friend[index]})
          .then(function(result){ // 성공하면 오는 곳
        	  $scope.roomon = true;
        	  $scope.data = result.data.data;
        	  $scope.inven.data = result.data.inven;
        	  $scope.myroom();
         }, function(result){ // 실패(오류) 하면 오는 곳
           console.log(result);
         });
	}
	$scope.myroom = function(){
		var myroom = document.getElementById("myCanvas");
        //배경 
        var background = myroom.getContext("2d");

        //캔버스 가로
        var wd;
        //캔버스 새로
        var hd;
        //움직이기모드(평상시)
        var move = false;
        //전체보기보기모드
        var zoomout = false;
        //편집모드
        var set = false;
        var src;
        var tilewd;
        var tilehd;
        var type;
        //아이템번호
        var itemno = 0;
        //스크롤
        var scrollx;
        var scrolly;
        //타일(배경)
        var tile = $scope.data.tile.split(" ");
        var furniture = $scope.data.object.split(" ");
        
        wd = $("#myCanvas").width();
        hd = $("#myCanvas").height();
        
        
        //마우스가 클릭할 때
        $(".inBox canvas").on("mousedown", function () {
            mousedown();
        });
        $(".inBox canvas").on("mousemove", function () {
            mousemove();
        });
        $(".inBox canvas").on("mouseup", function (event) {
            mouseup(event);
        });


        function mousedown() {
            if (!zoomout) {
                move = true;
                scrollx = event.offsetX;
                scrolly = event.offsetY;
            }
        }
        //마우스가 왼쪽 버튼을 땔 때 
        function mouseup(event) {
            if (set) {
                var mouse = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                tiledraw(mouse.x, mouse.y);
            }
            move = false;
        }

        function mousemove() {
            if (move && !zoomout) {
                var nowscrollx = $(".inBox").scrollLeft();
                var nowscrolly = $(".inBox").scrollTop();
                var movex = scrollx - event.offsetX;
                $(".inBox").scrollLeft(nowscrollx + movex);

                var movey = scrolly - event.offsetY;
                $(".inBox").scrollTop(nowscrolly + movey);

            }
        }
        function setting(data){
       	 $.each(data, function (index, value) {
                var y = (index - (index % 64)) / 64;
                var x = (index - (y * 64));
                
                if (value != 0) {
                	$.each($scope.inven.data, function (i, result) {
        	     		if(result.itemno == value){
        	     			var image = new Image();
                            image.src = "../item/" +  value + ".png";
                            console.log(value);
                            if(data == tile){
                           	 background.drawImage(image, x * 100, y * 100, result.wd, result.hd);
                            }else if(data == furniture){
                             background.drawImage(image, x * 100, y * 100, result.wd, result.hd);
                            }
                            console.log(x*100,y*100,result.wd,result.hd);
        	     		}  
                	});
                }
            });
       }
        //기본 룸 설정
        $scope.room = function() {
            setting(tile);
            setting(furniture);
        }
        setTimeout(function(){
        	$scope.room();
        },10);
	}
});