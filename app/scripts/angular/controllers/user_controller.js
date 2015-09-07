app.controller('LoginCtrl',function($scope,$location,$rootScope,$http,$window){
    // 如果用户已经登录了，则立即跳转到一个默认主页上去，无需再登录
    $scope.errMsg='';
    $scope.err=false;
    if($rootScope.user.token){
        $location.path('/rank');
        return;
    }
    $scope.signIn=function(){
        $scope.user.password= $.md5($scope.user.password);
        $http.post('../admin/adminUser',$scope.user).success(function(data){
            if(data.status==0){
                $scope.errMsg='';
                $scope.err=false;
                $rootScope.user=data.data;
                $rootScope.user.token=true;
                $window.localStorage.setItem('user',JSON.stringify(data.data));
                $window.localStorage.setItem('token',true);
                var userGroup = []; // obtained from backend
                $http.get('../admin/getGroup/'+$rootScope.user.uid).success(function(data){
                    userGroup=data.data;
                    var rules=[];
                    for(var i=0;i<userGroup.length;i++){
                        var tempRules=(userGroup[i].auth_group.rules).split(',');
                        rules=rules.concat(tempRules);
                    }

                    var record={rules:rules.join(',')};
                    $http.post('../admin/getRules',record).success(function(data){
                        $window.localStorage.setItem('userRoleRouteMap', JSON.stringify(data.data));
                        $rootScope.user.userRoleRouteMap=data.data;

                        $location.path('/rank');
                    });
                });





            }else{
                $scope.err=true;
                $scope.errMsg='没有该用户';
            }
        });

    };
    $scope.user=$rootScope.user;
})
    .controller('IndexCtrl',function($scope){

    })
    .controller('UsersCtrl',function($scope,$http){
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.load = function () {
            $http.get('../admin/getAllUsers/{status:0}/'+$scope.currentPage).success(function (data) {
                if(!data.data){
                    $.jGrowl("网络超时！");
                }else{
                    $scope.total = data.data.count;
                    $scope.items = data.data.rows;
                    //获取总页数
                    $scope.totalPage = Math.ceil(data.data.count / $scope.pageSize);
                    $scope.endPage = $scope.totalPage;
                    //生成数字链接
                    if ($scope.currentPage > 1 && $scope.currentPage < $scope.totalPage) {
                        $scope.pages = [
                            $scope.currentPage - 1,
                            $scope.currentPage,
                            $scope.currentPage + 1
                        ];
                    } else if ($scope.currentPage == 1 && $scope.totalPage > 1) {
                        $scope.pages = [
                            $scope.currentPage,
                            $scope.currentPage + 1
                        ];
                    } else if ($scope.currentPage == $scope.totalPage && $scope.totalPage > 1) {
                        $scope.pages = [
                            $scope.currentPage - 1,
                            $scope.currentPage
                        ];
                    }
                }

            });

        };
        $scope.next = function () {
            if ($scope.currentPage < $scope.totalPage) {
                $scope.currentPage++;
                $scope.load();
            }
        };
        $scope.prev = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
                $scope.load();
            }
        };

        $scope.loadPage = function (page) {
            $scope.currentPage = page;
            $scope.load();
        };
        $scope.loadPage($scope.currentPage);
    })
    .controller('UserinfoCtrl',function($scope,$location,$http){
        $scope.uid=$location.search().uid;
        $http.get('../admin/getUserInfo/'+$scope.uid).success(function(data){
            $scope.userInfo=data.data;
            if($scope.userInfo.gender==1){
                $scope.userInfo.sex='女性';
            }else{
                $scope.userInfo.sex='男性';
            }
            console.log($scope.userInfo);
        });
    });