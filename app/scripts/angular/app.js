var app=angular.module('robot', ['ngRoute','ui.bootstrap']);
    app.run(function($rootScope,$window){
        //$window.localStorage.clear();
        console.log($window.localStorage.getItem('userRoleRouteMap'));
        if(!$window.localStorage.getItem('token')){
            $rootScope.user={token:'',userRoleRouteMap:''};
            $window.localStorage.clear();
        }else{
            $rootScope.user=JSON.parse($window.localStorage.getItem('user'));
            $rootScope.user.token=$window.localStorage.getItem('token');
            $rootScope.user.userRoleRouteMap=JSON.parse($window.localStorage.getItem('userRoleRouteMap'));
        }
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('UserInterceptor');
    })
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {templateUrl: '/views/tpl/login.html', controller: 'LoginCtrl'})
        .when('/login', {templateUrl: '/views/tpl/login.html', controller: 'LoginCtrl'})
        .when('/index', {templateUrl: '/views/tpl/index.html', controller: 'IndexCtrl'})
        .when('/users', {templateUrl: '/views/tpl/users.html', controller: 'UsersCtrl'})
        .when('/upload',{templateUrl: '/views/tpl/upload.html', controller: 'UploadCtrl'})
        .when('/geturl',{templateUrl: '/views/tpl/geturl.html', controller: 'GeturlCtrl'})
        .when('/userinfo',{templateUrl: '/views/tpl/userinfo.html', controller: 'UserinfoCtrl'})
        .when('/models',{templateUrl: '/views/tpl/models.html', controller: 'ModelsCtrl'})
        .when('/modelinfo',{templateUrl: '/views/tpl/modelinfo.html', controller: 'ModelInfoCtrl'})
        .when('/modelverify',{templateUrl: '/views/tpl/modelverify.html', controller: 'ModelVerifyCtrl'})
        .when('/modelcheck',{templateUrl: '/views/tpl/modelcheck.html', controller: 'ModelCheckCtrl'})
        .when('/rank',{templateUrl: '/views/tpl/rank.html', controller: 'RankCtrl'})
        .when('/rankOfficial',{templateUrl: '/views/tpl/rankofficial.html', controller: 'RankOfficialCtrl'})
        .when('/partsedit',{templateUrl: '/views/tpl/partsedit.html', controller: 'PartsEditCtrl'})
        .when('/addpart',{templateUrl: '/views/tpl/addpart.html', controller: 'AddPartCtrl'})
        .when('/push',{templateUrl: '/views/tpl/push.html', controller: 'PushCtrl'})
        .when('/modelupload',{templateUrl: '/views/tpl/modelupload.html', controller: 'ModelUploadCtrl'})
        .when('/topedit',{templateUrl: '/views/tpl/topedit.html', controller: 'TopEditCtrl'})
        .when('/top',{templateUrl: '/views/tpl/top.html', controller: 'TopCtrl'})
        .otherwise({redirectTo: '/'});
    //$locationProvider.html5Mode(true);
}]);






