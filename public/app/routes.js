angular.module('appRoutes',['ngRoute'])


	.config(function($routeProvider,$locationProvider){


		$routeProvider


		.when('/',{

			templateUrl: 'app/views/pages/account.html'
		})

		

		.when('/friends',{

			templateUrl: 'app/views/pages/friends.html',
			controller: "friendsCtrl", 
			controllerAs: "friend"
		})

		.when('/register',{

			templateUrl: 'app/views/pages/users/register.html',
			controller:  'regCtrl',
			controllerAs: 'register'
		})
		
		.when('/activate/:token',{

			templateUrl: 'app/views/pages/users/activation/activate.html',
			controller:  'emailCtrl',
			controllerAs: 'email'
		})


		.when('/login',{
			templateUrl: 'app/views/pages/users/login.html'
		})

		



		.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode({
 		 enabled: true,
 		 requireBase: false
		});

  
});