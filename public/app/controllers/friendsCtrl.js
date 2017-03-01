angular.module('friendsController', [])

	.controller('friendsCtrl', function(User){

		var app= this;

		app.errorMsg =false;

	function getUsers(){

	User.getUsers().then(function(data){
			if(data.data.success){

				
				app.users = data.data.users;


			} else {
				app.errorMsg =data.data.message;
			}

		});


	}

	getUsers();
		

		app.deleteUser = function(username){

				User.deleteUser(username).then(function(data){

					if(data.data.success){
						
						getUsers();
					} else {
						console.log('error');
					}

				});
		}

	});