app.controller('mainAppCtrl', function($scope, $location, $rootScope,authService) {
        $rootScope.$on('$routeChangeStart',function(event, toState,fromState){
            if(toState.originalPath=='/login')return;// 如果是进入登录界面则允许
            // 如果用户不存在
            if(!$rootScope.user || !$rootScope.user.token){
                event.preventDefault();// 取消默认跳转行为
                $location.path('/login');//跳转到登录界面
                return;
            }
            if(!authService.isUrlAccessibleForUser(toState.originalPath)){
                $.jGrowl("没有权限！");
               $location.path(fromState.originalPath);//跳转到登录界面
            }

        });
        $rootScope.$on('userIntercepted',function(errorType){
            // 跳转到登录界面，这里我记录了一个from，这样可以在登录后自动跳转到未登录之前的那个界面
            $location.path("/login");
        });
    })

.controller('UploadCtrl',function($scope,$http){

    })
.controller('GeturlCtrl',function($scope,$http){
        $http.get('../home/getUrl').success(function (data) {
            if(!data.data){
                $.jGrowl("网络超时！");
            }else{
                $scope.url=data.data.url;
            }
        });
        $scope.editUrl=function(){
            $http.post('../home/editUrl',{url:$scope.url}).success(function(data){
                $.jGrowl("修改成功！");
            },function(err){
                $.jGrowl("网络超时！");
            });
        };
    })
.controller('PartsEditCtrl',function($scope,$http){
        $http.get('../home/getParts').success(function(data){
            $scope.parts=data.data;
        });
    })
.controller('AddPartCtrl',function($scope,$http){
        $scope.save=function(){
            if($scope.pname==''||$scope.description==''){
                $.jGrowl('请完善内容！');
            }else{
                $http.post('../home/addPart',{pname:$scope.pname,description:$scope.description}).success(function(data){
                    $.jGrowl('添加成功！');
                });
            }
        };
    })
    .controller('PushCtrl',function($scope,$http){
        $scope.y=1;
        $scope.pushTypes=1;
        $scope.url='ToAll';
        $scope.pushType=function(y){
            $scope.pushTypes=y;
        };
        $scope.pushChange=function(x){
            $scope.pushChanges=x;
        };

        $scope.push=function(){
            if($scope.pushTypes==2){
                if($scope.uid>0){
                    $http.get('../admin/getUserInfo/'+$scope.uid).success(function(data){
                        if(data.status==0){
                            $scope.pushID=data.data.pushID;
                            $scope.url='ToSingle';
                        }else{
                            $.jGrowl('请输入正确的uid！');
                        }
                    },function(err){
                        $.jGrowl('请输入正确的uid！');
                    });
                }else{
                    $.jGrowl('输入正确的uid！');
                }
            }else{
                $scope.url='ToAll';
            }

            if($scope.pushChanges==1){
                var record={content:$scope.content,url:$scope.url,type:3};
                if($scope.pushTypes==2){
                    record.pushID=$scope.pushID;
                }
                $http.post('../push/urlPush'+$scope.url,record).success(function(data){
                    if(data.status==0){
                        $.jGrowl('推送成功！');
                    }else{
                        $.jGrowl('推送失败！');
                    }
                },function(err){
                    $.jGrowl('推送失败！');
                });
            }else if($scope.pushChanges==2){
                console.log($scope.modelid);
                var record={content:$scope.content,mid:$scope.modelid,type:3};
                if($scope.pushTypes==2){
                    record.pushID=$scope.pushID;
                }
                $http.post('../push/modelInfoPush'+$scope.url,record).success(function(data){
                    if(data.status==0){
                        $.jGrowl('推送成功！');
                    }else{
                        $.jGrowl('推送失败！');
                    }
                },function(err){
                    $.jGrowl('推送失败！');
                });
            }else if($scope.pushChanges==''||$scope.pushChanges==null){
                $.jGrowl('请选择推送类型！');
            }else if($scope.content==''||$scope.content==null){
                $.jGrowl('请填写推送内容！');
            }
        };
    });

