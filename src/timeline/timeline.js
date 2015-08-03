define(['angular',
        'templates',
        'ng_bootstrap',
        'ng_ace'
        ],
function(angular)
{

TrialRunner = function(){
    var me = this;
    me.timeline = [];
    me.crnt_ii = 0;

    me.next = function() {
        me.crnt_ii++;
    };

    me.add = function(entry) {
        me.timeline.push(entry);
    };
    me.getCrnt = function(){
        me.timeline[me.crnt_ii];
    };

    me.run = function(){
    };
}

var app = angular.module('weber.timeline', ['ui.bootstrap', 'ui.ace']);

app.directive('wbTimeline', ['$http', function($http){
    function link(scope, elem, attrs) {
        scope.dataType = function(ii){
            return scope.timeline[ii].type || 'object'
        };

        scope.addTrial = function(){
            TR.add({name: 'test', data:[]});
        };

        scope.run = function(){
            return null

        };

        scope.getCode = function(ii){
            console.log();
        };

        var t1 = {name: 'A', data: []},
            t2 = {name: 'B', type: 'function', data: function(a){
                return 1
            }},
            t3 = {name: 'C', data: []};

        var TR = new TrialRunner();
        [t1, t2, t3].forEach(function(entry){
            if (entry.type == 'function') entry.data = entry.data.toString();
            TR.add (entry);
        });


        scope.timeline = TR.timeline;

    }

    return {
        restrict: 'EA',
        scope: {},
        templateUrl: '/src/timeline/timeline.html',
        link: link
    }
}]);



});  // end define
