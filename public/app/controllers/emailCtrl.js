angular.module('emailController', ['userServices'])

    // Controller: emailCtrl is used to activate the user's account    
    .controller('emailCtrl', function($routeParams, User, $timeout, $location) {

       var app = this;

        // Check function that grabs token from URL and checks database runs on page load
        User.activateAccount($routeParams.token).then(function(data) {
            app.errorMsg = false; // Clear errorMsg each time user submits

            // Check if activation was successful or not
            if (data.data.success) {
                app.successMsg = data.data.message + '...Redirecting'; // If successful, grab message from JSON object and redirect to login page
                // Redirect after 2000 milliseconds (2 seconds)
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message + '...Redirecting'; // If not successful, grab message from JSON object and redirect to login page
                // Redirect after 2000 milliseconds (2 seconds)
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
            }
        });
    });