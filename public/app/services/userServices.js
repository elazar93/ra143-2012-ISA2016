angular.module('userServices',[])

.factory('User',function($http){

	userFactory = {}

	userFactory.create = function(regData) {

		return $http.post('/api/users',regData);
	};


	userFactory.activateAccount = function(token) {
		return $http.put('api/activate/' + token);
	};

	userFactory.getUsers = function() {

		return $http.get('/api/friends/');

	};

	userFactory.deleteUser = function(username){


		return $http.delete('/api/friends/'+ username);
	};

	return userFactory;

	




});

//User is UserService