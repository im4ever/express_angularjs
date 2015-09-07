app.factory('UserInterceptor', ["$q","$rootScope",function ($q,$rootScope) {
    return {
        request:function(config){
            config.headers["TOKEN"] = $rootScope.user.token;
            return config;
        },
        responseError: function (response) {
            var data = response.data;
            // 判断错误码，如果是未登录
            if(data["errorCode"] == "500999"){
                // 清空用户本地token存储的信息，如果
                $rootScope.user = {token:""};
                // 全局事件，方便其他view获取该事件，并给以相应的提示或处理
                $rootScope.$emit("userIntercepted","notLogin",response);
            }
            // 如果是登录超时
            if(data["errorCode"] == "500998"){
                $rootScope.$emit("userIntercepted","sessionOut",response);
            }
            return $q.reject(response);
        }
    };
}])
    .factory('authService', function ($http,$rootScope) {
        //

        return {

            userHasRole: function (role) {
                /*for (var j = 0; j < userGroup.length; j++) {
                    if (role == userGroup[j]) {
                        return true;
                    }
                }*/
                return false;
            },

            isUrlAccessibleForUser: function (route) {
                var validUrlsForRole = $rootScope.user.userRoleRouteMap;
                console.log($rootScope.user.userRoleRouteMap);
                   if (validUrlsForRole) {
                        for (var j = 0; j < validUrlsForRole.length; j++) {
                            if (validUrlsForRole[j].name == route)
                                return true;
                        }
                    }
                return false;
            }
        };
    });

