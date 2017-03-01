angular.module('userControllers', ['userServices'])

	.controller('regCtrl', function($http,$location,$timeout,User){

		var app = this;

		 this.regUser = function(regData) {
		 	app.loading = true;
		 	app.errorMsg = false;

			
			User.create(app.regData).then(function(data){

					console.log(data);

					if(data.data.success){
						app.loading =false;

						app.successMsg = data.data.message;

						$timeout(function(){
							$location.path('/');
						},2000);
						


					} else {
						app.loading = false;
						app.errorMsg = data.data.message;

					}
			});

		};
	})

	.directive('match', function() {
		return {
			restrict: 'A', // Restrict to HTML Attribute
			controller: function($scope) {
				$scope.confirmed = false; // Set matching password to false by default

				// Custom function that checks both inputs against each other				
				$scope.doConfirm = function(values) {
					// Run as a loop to continue check for each value each time key is pressed
					values.forEach(function(ele) {
						// Check if inputs match and set variable in $scope
						if ($scope.confirm == ele) {
							$scope.confirmed = true; // If inputs match
						} else {
							$scope.confirmed = false; // If inputs do not match
						}
					});
				}
			},

			link: function(scope, element, attrs) {

				// Grab the attribute and observe it			
				attrs.$observe('match', function() {
					scope.matches = JSON.parse(attrs.match); // Parse to JSON
					scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other	
				});

				// Grab confirm ng-model and watch it			
				scope.$watch('confirm', function() {
					scope.matches = JSON.parse(attrs.match); // Parse to JSON
					scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other	
				});
			}
		};
	});


