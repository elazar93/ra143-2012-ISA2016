angular.module('userApp',['appRoutes','userControllers','mainController','emailController','friendsController','authServices'])

.config(function($httpProvider){

	$httpProvider.interceptors.push('AuthInterceptors');


});

