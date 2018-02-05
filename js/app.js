// 앵귤라 모듈 만들기
var app = angular.module("myApp", ["ngRoute","MyRoom","MyFriend","MyShop"]);
		
// 라우터 처리 부분 (싱글 페이지 적용)
app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl : "../html/home.html",
		controller : "myroom"
	}).when("/shop", {
		templateUrl : "../html/shop.html",
		controller:"myshop"
	}).when("/friend", {
		templateUrl : "../html/friend.html",
		controller:"myfriend"
	}).otherwise({redirectTo: "/"});
});

app.run(function($rootScope, $http){
	$rootScope.loginbool = false;
	$rootScope.user = {};
	$rootScope.nav = "../html/nav.html";
	$rootScope.navEvent = function(){
	      $rootScope.navDis = location.hash;
	}
	$rootScope.logout = function(){
			Kakao.cleanup();
			$http.post("logout")
	        .then(function(result){ // 성공하면 오는 곳
	    		console.log("로그아웃세션",result.data);
	      	   if(result.data.status == 0){
	      		  location.href = "/";
	      	   }
	         }, function(result){ // 실패(오류) 하면 오는 곳
		         console.log(result);
		    });
	}
	
	$rootScope.kakao = function(){
	    // 사용할 앱의 JavaScript 키를 설정해 주세요.
        Kakao.init('e92886bf85b0dc084950d47fe7164b91');
        Kakao.Auth.login({
          success: function(authObj) {
              Kakao.API.request({
                  url: '/v1/user/me',
                  success: function(res) {
                 	$rootScope.user.email = res.kaccount_email;
                	$rootScope.user.name = res.properties.nickname;
                	$rootScope.user.kkono = res.id;
                	$http.post("login","",{params: $rootScope.user})
        	        .then(function(result){ // 성공하면 오는 곳
        	        	console.log(result.data.status != 0);
        	    		if(result.data.status != 0){
            	      		location.href = "/";
        	    		}
        	         }, function(result){ // 실패(오류) 하면 오는 곳
        		         console.log(result);
        		    });
  	    		}
              });
          },
	          fail: function(err) {
	             alert("예기치 못한 오류가 발생하였습니다. 다시 시도해주세요.");
	          }
        });
	}
	$rootScope.footer = "../html/footer.html";
});

//서비스
app.factory("LoginService", function($q, $http,$rootScope){
      var deffered = $q.defer();
      var result = [];
      var LoginService = {};
      
      // 실행하는 부분
      LoginService.async = function() {
         $http.post("session", "", {params: $rootScope.user}).then(data => {
             result = data;
             deffered.resolve();
         }, data => {
            result = data;
             deffered.resolve();
         });
         return deffered.promise;
      }
      
      // 데이터 리턴하는 부분
      LoginService.data = function(){ 
         return result; 
      }
      
      return LoginService;
   });