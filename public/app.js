(function() {
	'use strict';

var app = angular.module('app', [])

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainCtrl', 
	['$scope', 'RandomUserFactory', 'UserFactory', 
	function($scope, RandomUserFactory, UserFactory){
	
	$scope.greet = "Using JWT with AngularJS and NodeJS";

	$scope.getRandomUser = getRandomUser;
	$scope.login = login;


	function getRandomUser () {
		RandomUserFactory.getUser().then(function success (response) {
			$scope.randomUser = response.data;
		}, handleError);
	}

	function login (username, password) {
		UserFactory.login(username, password).then(function success (response) {
			$scope.user = response.data.user;
			
			alert(response.data.token);

		}, handleError);
	}

	function handleError (response) {
		alert('Error: ' + response.data);
	}
}]);

app.factory('RandomUserFactory', ['$http', 'API_URL', function($http, API_URL){
	return {
		getUser: getUser
	};

	function getUser () {
		return $http.get(API_URL + '/random-user');
	}
}]);

app.factory('UserFactory', ['$http', 'API_URL', function($http, API_URL){
	'use strict';
	return {
		login: login
	};

	function login (username, password) {
		return $http.post(API_URL + '/login', {
			username: username,
			password: password
		});
	}

}]);

})();