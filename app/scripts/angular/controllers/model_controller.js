app.controller('ModelsCtrl',function($scope,$http){
    $scope.order='ctime';
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.pageSize = 20;
    $scope.pages = [];
    $scope.endPage = 1;
    $scope.load = function () {
        var data={where:'{status:2,author:{$gt:0}}',page:$scope.currentPage,order:$scope.order};
        $http.post('../admin/getAllModels',data).success(function (data) {
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
    .controller('ModelInfoCtrl',function($scope,$http,$location){
        $scope.mid=$location.search().mid;
        $http.get('../admin/getModelInfo/'+$scope.mid).success(function(data){
            $scope.modelInfo=data.data;
            if($scope.modelInfo.author==0){
                $scope.modelInfo.user={nickname:'官方'};
            }
            var actions=eval('('+$scope.modelInfo.actions+')');
            console.log(actions.actions);
            $scope.modelInfo.directives=actions.actions;
            $scope.modelInfo.date=new Date($scope.modelInfo.ctime*1000);
            console.log($scope.modelInfo);
        });
        $('#video').hide();
        $scope.change=function(){
            $('#video').show();
            $('#video').attr('src',$('#videoUrl').val());

        };
    })
    .controller('ModelVerifyCtrl',function($scope,$http){
        $scope.order='ctime';
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 20;
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.load = function () {
            var data={where:'{status:1,author:{$gt:0}}',page:$scope.currentPage,order:$scope.order};
            $http.post('../admin/getAllModels',data).success(function (data) {
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
    .controller('ModelCheckCtrl',function($scope,$http,$location){

        $scope.mid=$location.search().mid;
        $http.get('../admin/getModelInfo/'+$scope.mid).success(function(data){
            $scope.modelInfo=data.data;
            if($scope.modelInfo.author==0){
                $scope.modelInfo.user={nickname:'官方'};
            }
            if($scope.modelInfo.actions){
                var actions=eval($scope.modelInfo.actions);
                console.log(actions);
                $scope.modelInfo.directives=actions;
            }else{
                $scope.modelInfo.directives='';
            }

            $scope.modelInfo.date=new Date($scope.modelInfo.ctime*1000);
            console.log($scope.modelInfo);
        });
        $http.get('../admin/getTypeInfo').success(function(data){
            $scope.typeInfo=data.data;
        });
        $scope.errMsg='';
        $('#video').hide();
        $scope.change=function(){
            $('#video').show();
            $('#video').attr('src',$('#videoUrl').val());

        };
        $scope.typeChange=function(x){
            $scope.modelType=x;
        };
        $scope.check=function(status){

            if(status==2){
                if($scope.modelInfo.author>0){
                    var record={mid:$scope.mid,status:status,tid:$scope.modelType,uid:$scope.modelInfo.author,pushID:$scope.modelInfo.user.pushID};
                }else{
                    var record={mid:$scope.mid,status:status,tid:$scope.modelType,uid:$scope.modelInfo.author};
                }

                $http.post('../admin/checkModel',record).success(function(data){
                    $.jGrowl("操作成功！");
                    $('.btn').attr('disabled',"disabled");
                });
            }else{
                if($scope.errMsg==''||$scope.errMsg==null){
                    $.jGrowl("请填写拒绝原因！");
                }else{
                    var record={mid:$scope.mid,status:status,errMsg:$scope.errMsg};
                    $http.post('../admin/checkModel',record).success(function(data){
                        $.jGrowl("操作成功！");
                        $('.btn').attr('disabled',"disabled");
                    });
                }
            }

        }
    })
    .controller('RankCtrl',function($scope,$http,$location){
        $scope.order='ctime';
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.pages = [];
        $scope.endPage = 1;
        //切换排序方式
        $scope.orderChange=function(x){
            $scope.order=x;
            $scope.load();
        };

        $scope.praise=function(mid,praise){
            var record={mid:mid,praise:praise};
            $http.post('../admin/setPraise',record).success(function(data){
                if(!data.data){
                    $.jGrowl("操作失败！");
                }else{
                    $.jGrowl("操作成功！");
                    $scope.load();
                }
            });
        };

        //获取列表
        $scope.load = function () {
            var data={where:'{status:2,author:{$gt:0}}',page:$scope.currentPage,order:$scope.order};
            $http.post('../admin/getAllModels',data).success(function (data) {
                if(!data.data){
                    $scope.error("网络超时");
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

    .controller('RankOfficialCtrl',function($scope,$http,$location){
        $scope.order='ctime';
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 20;
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.praise=function(mid,praise){
            var record={mid:mid,praise:praise};
            $http.post('../admin/setPraise',record).success(function(data){
                if(!data.data){
                    $.jGrowl("操作失败！");
                }else{
                    $.jGrowl("操作成功！");
                    $scope.load();
                }
            });
        };
        $scope.load = function () {
            var data={where:'{author:0}',page:$scope.currentPage,order:$scope.order};
            $http.post('../admin/getAllModels',data).success(function (data) {
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
    .controller('TopEditCtrl',function($scope,$http){
        
    })
    .controller('TopCtrl',function($scope,$http){
        $scope.load=function(){
            $http.get('../admin/top').success(function(data){
                $scope.media=data.data;
            });
        };
        $scope.load();
        $scope.deleteTop=function(id){
            $http.post('../admin/deleteTop',{id:id}).success(function(data){
                if(data.status==0){
                    $.jGrowl("操作成功！");
                    $scope.load();
                }else{
                    $.jGrowl("网络超时！");
                }
            });
        }
    });

