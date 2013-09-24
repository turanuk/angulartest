angular.module('project', ['firebase']).
  value('fbURL', 'https://angularjs-projects.firebaseio.com/').
  factory('Projects', function (angularFireCollection, fbURL) {
      return angularFireCollection(fbURL);
  }).
  config(function ($routeProvider) {
      $routeProvider.
        when('/', { controller: ListCtrl, templateUrl: 'App/Pages/List.html' }).
        when('/edit/:projectId', { controller: EditCtrl, templateUrl: 'App/Pages/Detail.html' }).
        when('/new', { controller: CreateCtrl, templateUrl: 'App/Pages/Detail.html' }).
        otherwise({ redirectTo: '/' });
  });

function ListCtrl($scope, Projects) {
    $scope.projects = Projects;
}

function CreateCtrl($scope, $location, $timeout, Projects) {
    $scope.save = function () {
        Projects.add($scope.project, function () {
            $timeout(function () { $location.path('/'); });
        });
    }
}

function EditCtrl($scope, $location, $routeParams, angularFire, fbURL) {
    angularFire(fbURL + $routeParams.projectId, $scope, 'remote', {}).
    then(function () {
        $scope.project = angular.copy($scope.remote);
        $scope.project.$id = $routeParams.projectId;
        $scope.isClean = function () {
            return angular.equals($scope.remote, $scope.project);
        }
        $scope.destroy = function () {
            $scope.remote = null;
            $location.path('/');
        };
        $scope.save = function () {
            $scope.remote = angular.copy($scope.project);
            $location.path('/');
        };
    });
}