/**
 * Created by gdonovan on 7/15/2015.
 */
// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute', 'schemaForm']);

// configure our routes
scotchApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl: 'app/views/about.html',
            controller: 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl: 'app/views/contact.html',
            controller: 'contactController'
        })

        .when('/dynamicForm', {
            templateUrl: 'app/views/dynamicForm.html',
            controller: 'dynamicFormController'
        })

        .when('/quickSearch', {
            templateUrl: 'app/views/quickSearch.html',
            controller: 'quickSearchController'
        });
});

scotchApp.factory('sampleService', function ($timeout, $q) {
    var deferred = $q.defer();

    var service = {
        sayHello: sayHello,
        getFormConfig: getFormConfig,
        search: search
    }
    return service;

    function sayHello(name) {
        return 'Hi ' + name + '!';
    };

    function getFormConfig() {
        var deferred = $q.defer();
        var data = {
            schema: {
                type: "object",
                properties: {
                    occupancy: {
                        type: "string",
                        default: "Owner Occupied"
                    },
                    propertyType: {
                        type: "string",
                        default: "Single Family"
                    },
                    loanPurpose: {
                        type: "string"
                    },
                    purchasePrice: {
                        type: "number"
                    },
                    downPayment: {
                        type: "number"
                    },
                    zip: {
                        type: "string"
                    },
                    creditScore: {
                        type: "string",
                        default: "740-779"
                    }
                },
                required: ["occupancy", "purchasePrice", "loanPurpose"]
            },
            form: [
                {
                    key: "occupancy",
                    type: "select",
                    title: "Occupancy",
                    titleMap: [
                        {value: "Owner Occupied", name: "Owner Occupied"},
                        {value: "Other", name: "Other"},
                        {value: "Biff", name: "Biff"}
                    ]
                },
                {
                    key: "propertyType",
                    type: "select",
                    title: "Property Type",
                    titleMap: [
                        {value: "Single Family", name: "Single Family"},
                        {value: "PUD", name: "PUD"},
                        {value: "Multi-Family", name: "Multi-Family"},
                        {value: "Manufactured / Single Wide", name: "Manufactured / Single Wide"},
                        {value: "Manufactured / Double Wide", name: "Manufactured / Double Wide"},
                        {value: "Timeshare", name: "Timeshare"},
                        {value: "Condotel", name: "Condotel"},
                        {value: "Non-warrantable Condo", name: "Non-warrantable Condo"},
                        {value: "Modular", name: "Modular"},
                    ]
                },
                {
                    key: "loanPurpose",
                    title: "Loan Purpose",
                    disableSuccessState: true,
                    feedback: false
                },
                {
                    key: "purchasePrice",
                    title: "Purchase Price",
                    placeholder: "0.00",
                    validationMessages: {
                        'minCheck': 'Bob is not OK! You here me?'
                    },
                    $validators: {
                        minCheck: function (value) {
                            var bool = true;
                            if (value < 0) {
                                bool = false;
                            }
                            return bool;
                        }
                    }
                }

            ]
        };
        deferred.resolve(data);
        return deferred.promise;
    };

    function search(bool) {
        var deferred = $q.defer();
        var validSearch = bool;
        deferred.resolve(validSearch);
        return deferred.promise;
    }
});

// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

scotchApp.controller('aboutController', function ($scope) {
    $scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

scotchApp.controller('dynamicFormController', function ($scope, sampleService, $timeout) {
    // create a message to display in our view
    $scope.message = 'Dynamic Form!';

    var vm = {
        submit: submit,
        isLoading: false,
        showJson: false,
        json: ""
    };
    $scope.vm = vm;

    init();

    function init() {
        sampleService.getFormConfig().then(function (data) {
            $scope.data = data;
            $scope.criteria = {};

            $scope.schema = $scope.data.schema;
            // {
            //    "type": "object",
            //    "properties": {
            //        "name": {
            //            "title": "Name",
            //            "type": "string"
            //        },
            //        "email": {
            //            "title": "Email",
            //            "type": "string",
            //            "pattern": "^\\S+@\\S+$",
            //            "description": "Email will be used for evil."
            //        },
            //        "comment": {
            //            "title": "Comment",
            //            "type": "string",
            //            "maxLength": 20,
            //            "validationMessage": "Don't be greedy!"
            //        }
            //    },
            //    "required": ["name", "email", "comment"]
            //};

            //How form is presented
            $scope.form = $scope.data.form;
            //    [
            //    "name",
            //    "email",
            //    {
            //        "key": "comment",
            //        "type": "textarea",
            //        "placeholder": "Make a comment"
            //    }
            //];
        });
    };

    function submit(isValid) {
        vm.isLoading = true;
        return sampleService.search(isValid).then(function (data) {
            console.warn(data);
            vm.json = JSON.stringify($scope.criteria, null, 4);
            vm.showJson = true;
            $timeout(function () {
                vm.isLoading = false;
            }, 500);
        });
    }

});

scotchApp.controller('quickSearchController', function ($scope, $timeout) {
    // create a message to display in our view
    var vm = {
        isLoading: false,
        occupancies: ['Owner Occupied', 'Other', 'Biff'],
        propertyTypes: ['Single Family', 'PUD', 'Multi-Family', 'Manufactured / Single Wide', 'Manufactured / Double Wide', 'Timeshare', 'Condotel', 'Non-warrantable condo', 'Modular'],
        creditRanges: ['619 or lower', '620-659', '660-739', '740-779', '780+'],
        search: {
            occupancy: null,
            propertyType: null,
            loanPurpose: null,
            purchasePrice: null,
            downPayment: null,
            zip: null,
            creditScore: null
        },
        submit: submit
    };

    $scope.vm = vm;

    initialize();

    function initialize() {
        vm.search.occupancy = vm.occupancies[0];
        vm.search.propertyType = vm.propertyTypes[0];
        vm.search.creditScore = vm.creditRanges[3];
    };

    function submit() {
        console.log("Submit Clicked" + vm.search);
        vm.isLoading = true;
        $timeout(function () {
            vm.isLoading = false;
        }, 1000);
        //quickSearchDataService.submitSearch(vm.search).then(function (data) {
        //    console.log(data);
        //});
    }


    $scope.message = 'Quick Search!';
});

scotchApp.directive('loadingspinner', [function () {

    var directive = {
        restrict: 'E',
        template: '<div id="loading"><i class="fa fa-cog fa-3x fa-spin vertical-center icon-orange"></i></div>',
        replace: true
    };

    return directive;
}]);