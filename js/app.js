var app = angular.module('greynexus', ['ngRoute', 'angularMoment', 'ngFileUpload']);



app.config(function($routeProvider, $locationProvider) {

		//$locationProvider.html5Mode(true);

		$routeProvider 
 
		//route for create event page
		.when('/create', {
	                templateUrl : 'pages/createvent/create_event.html',
	                controller  : 'createController'
	    })

	    .when('/newevent', {
	    		templateUrl : 'pages/newevent/newevent.html',
                controller  : 'newEventController'
	    })

	    .when('/previousevents', {
	    		templateUrl : 'pages/previousevents/previousevent.html',
                controller  : 'previousEventController'
	    })

	    .when('/createassignment', {
	    		templateUrl : 'pages/assignment/create_assignment.html',
                controller  : 'assignmentController'
	    })

	    .when('/assignment-responses', {
	    		templateUrl : 'pages/assignment/responses.html',
                controller  : 'assignmentResponseController'
	    })

	    .when('/requested-assignment', {
	    		templateUrl : 'pages/assignment/requested-assignment.html',
                controller  : 'requestedAssignmentController'
	    })
});

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

app.service('formservice', ['Upload', function(Upload) {

    this.saveform = function(dataObj) {
        console.log(dataObj)
        return Upload.upload({
            url: 'http://35.154.43.191:8000/events/create/',
            data: dataObj
        });
        
    };
}]);

app.controller('mainController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
     
	

}]);

app.controller('profileController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
     
	

}]);

app.controller('createController', [ '$location','$scope','$http', '$window', 'Upload', 'formservice', function($location, $scope, $http, $window, Upload, formservice ) {
     

    
	$scope.events = [];
	var data = {
				 "email":"shivam@greynexus.com"
				};
	$http.post('http://35.154.43.191:8000/invite/getevents/', angular.toJson(data)).success(function(data, status) {        
	 		
	 	
	 	$scope.events = data;


     });

	$scope.saveForm = function(data){
      
        data.online = "1";
	    data.organiser = "1";
	    data.organiser_external = "1";
	    data.relevance = "some relevance";
	    data.start = $scope.startYear+"-"+$scope.startMonth+"-"+$scope.startDate;
	    data.end = $scope.endYear+"-"+$scope.endMonth+"-"+$scope.endDate;
        console.log(data);
        
        formservice.saveform(data).then(function (resp) {
             console.log(resp);
             if(resp.status ==  200){
             	swal({   title: "Thanks!",   text: "Your form has been submitted successfully!",   type: "success",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Ok",   closeOnConfirm: true }, function(){  location.reload(); });
             }
        }, function (resp) {
             console.log('Error status: ' + resp.status);
         }, function (evt) {
        });
    }
	

	/*$scope.saveForm = function(){
		
		
		$scope.form.start = $scope.startYear+"-"+$scope.startMonth+"-"+$scope.startDate;
		$scope.form.end = $scope.endYear+"-"+$scope.endMonth+"-"+$scope.endDate;
		console.log($scope.form);
		$http.post('http://35.154.43.191:8000/events/create/', $scope.form,
			{
            transformRequest: angular.identity,
            headers: {'Content-Type': 'multipart/form-data'}
        }).success(function(data, status){
		    	console.log(data);	
		});
		
	}
*/
}]);

app.controller('newEventController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
    
    $scope.events = [];
	var data = {};
	$http.post('http://35.154.43.191:8000/events/fetch/', angular.toJson(data)).success(function(data, status) {        
	 		
	 	
	 	for(var i=0;i<data.length;i++){
	 		if(data[i].status != "FINISHED"){
	 			$scope.events.push(data[i]);
	 		}
	 	}
	 	console.log($scope.events);

     });


}]);

app.controller('previousEventController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
  
	$scope.events = [];
	var data = {
				 "email":"shivam@greynexus.com"
				};
	$http.post('http://35.154.43.191:8000/invite/getevents/', angular.toJson(data)).success(function(data, status) {        
	 		
	 	
	 	$scope.events = data;
	 	console.log($scope.events);

     });
}]);

app.controller('assignmentController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
     
    var count = 0;
    $scope.totaltopic = [];
    $scope.questions = [];
    $scope.form = {};
	$scope.topics = [{id:"topic_"+count, topicName:"", totalQuestions:""}];
	$('#datepicker').datepicker({
		format: "yyyy-mm-dd",
        autoclose: true
	});

	$scope.addTopic = function(){
		count++;
		$scope.topics.push({id:"topic_"+count, topicName:"", totalQuestions:""});
	}

	$scope.saveAssignment = function(data){

		for(var i=0;i<$scope.topics.length;i++){
			$scope.totaltopic.push($scope.topics[i].topicName);
			$scope.questions.push($scope.topics[i].totalQuestions);
		}

		data.requester_id = 1;
		data.type = "";
		data.individual_assignment = "False";
		data.topics = $scope.totaltopic;
		data.questions = $scope.questions;

		$http.post('http://35.154.43.191:8000/assignments/create/', angular.toJson(data)).success(function(data, status) {        
	 		
			swal({   title: "Thanks!",   text: "Your form has been submitted successfully!",   type: "success",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Ok",   closeOnConfirm: true }, function(){  location.reload(); });

     	});
	}

}]);

app.controller('assignmentResponseController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
  
}]);

app.controller('requestedAssignmentController', [ '$location','$scope','$http', '$window', function($location, $scope, $http, $window ) {
  
	$scope.reqAssignment = [];

	var data = {"requester_id":1};
	$http.post('http://35.154.43.191:8000/assignments/fetch/', angular.toJson(data)).success(function(data, status) {        
	 		
		console.log(data);
		$scope.reqAssignment = data;

    });

}]);