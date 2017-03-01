angular.module('mainController',['authServices'])

.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope){

	var app =this;

	
	$rootScope.$on('$routeChangeStart',function(){
	if(Auth.isLoggedIn()){
		console.log('success: User is logged in');
		app.isLoggedIn = true;
		Auth.getUser().then(function(data){

			console.log(data.data.username);

			//now we can access our username on frontside
			// big hint for friend list
			app.username = data.data.username;
			app.useremail = data.data.email;
		});
	}else{
		console.log('failure: not logged in')
		app.isLoggedIn = false;
		
	}
	});

		 this.doLogin = function(loginData) {
		 	app.loading = true;
		 	app.errorMsg = false;

			
			Auth.login(app.loginData).then(function(data){


					if(data.data.success){
						app.loading =false;

						app.successMsg = data.data.message;

						$timeout(function(){
							$location.path('/');
							app.loginData = '';
							app.successMsg = false;
						},2000);
						


					} else {
						app.loading = false;
						app.errorMsg = data.data.message;

					}
			});

	
		};

		this.logout = function() {

			Auth.logout();
			$location.path('/login');

		};


});


