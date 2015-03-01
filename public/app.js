(function() {
	'use strict';

var app = angular.module('app', [], function config($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainCtrl', 
	['$scope', 'RandomUserFactory', 'UserFactory', 
	function MainCtrl ($scope, RandomUserFactory, UserFactory){
	
	$scope.greet = "Using JWT with AngularJS and NodeJS";

	$scope.getRandomUser = getRandomUser;
	$scope.login = login;
	$scope.logout = logout;

	//Initialization;
	UserFactory.getUser().then(function success (response) {
		$scope.user = response.data;
	});
	//

	function getRandomUser () {
		RandomUserFactory.getUser().then(function success (response) {
			$scope.randomUser = response.data;
		}, handleError);
	}

	function login (username, password) {
		UserFactory.login(username, password).then(function success (response) {
			$scope.user = response.data.user;			

			// alert(response.data.token);

		}, handleError);
	}
	function logout () {
		UserFactory.logout();
		$scope.user = null;
	}

	function handleError (response) {
		alert('Error: ' + response.data);
	}
}]);

app.factory('RandomUserFactory', ['$http', 'API_URL', 
	function RandomUserFactory ($http, API_URL){
	return {
		getUser: getUser
	};

	function getUser () {
		return $http.get(API_URL + '/random-user');
	}
}]);

app.factory('UserFactory', 
	['$http', 'API_URL', 'AuthTokenFactory', '$q', 
	function UserFactory ($http, API_URL, AuthTokenFactory, $q){
	'use strict';
	return {
		login: login,
		logout: logout,
		getUser: getUser
	};

	function login (username, password) {
		return $http.post(API_URL + '/login', {
			username: username,
			password: password
		}).then(function success (response) {
			AuthTokenFactory.setToken(response.data.token);
			return response;
		});
	}

	function getUser () {
		if (AuthTokenFactory.getToken()) {
			return $http.get(API_URL + '/me');
		} else {
			$q.reject({data: "Client has no auth token."});
		}
	}

	function logout () {
		AuthTokenFactory.setToken();
	}
}]);

app.factory('AuthTokenFactory', ['$window', function AuthTokenFactory($window){
	var store = $window.localStorage;
	var key = 'auth-token';

	return {
		getToken: getToken,
		setToken: setToken
	};

	function getToken () {
		return store.getItem(key);
	}
	function setToken (token) {
		if (token) {
			store.setItem(key, token);
		} else {
			store.removeItem(key);
		}
	}
}]);

app.factory('AuthInterceptor', 
	['AuthTokenFactory', 
	function AuthInterceptor (AuthTokenFactory){
	return {
		request: addToken
	}

	function addToken (config) {
		var token = AuthTokenFactory.getToken();
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = "Bearer " + token;
		}
		return config;
	}
}]);

})();










