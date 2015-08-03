// TODO: add weber:weber and weber:runner dependency
define(['angular',
        'ace',
        'ui_grid',
        'ng_jsoneditor',
        'templates',
        ],
function(angular, ace)
{

var app = angular.module('weber', 
        ['ng.jsoneditor', 
         'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.autoResize',
         'templates', 'weber.timeline']
);

app.constant('gridOptions', {
        //data: 'params',
        //columnDefs: 'colDef',    // couldn't pass string as arg.. ><
        enableColumnMenus: false,
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        enableGridMenu: true,
        editableCellTemplate: "editableCell.html",
});

//app.controller('wbMiniController', function($scope){
//    $scope.onLoad = function(){
//        console.log('loadeddddd');
//    };
//});
app.directive('wbMini', ['$http', 'gridOptions', function($http, gridOptions){
    function prelink(scope, elem, attrs, Cntrl){
        /* Grid Functions
         *
         */ 
        scope.getTableHeight = function() {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: (scope.gridOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };

        scope.addField = function(name, obj){
            if (obj == null) obj = scope.gridOptions.columnDefs;
            obj.push({field: name})
        };

        scope.getGridData = function(){
            var pars = scope.gridOptions.data;
            var newPars = []
            for (var i = 0; i < pars.length; i++){
                var newEntry = {};
                for (k in pars[i]) newEntry[k] = format(pars[i][k]);
                newPars.push(newEntry)
            }
            console.log(newPars);
            return newPars
        };

        function format(val){
            console.log('formatting');
            // number input
            if (typeof val == 'number') return val
            // quoted number (e.g. '"2"')
            else if (Number(val)) return Number(val);
            else if (typeof val === "string") {
                var unquoted = val.replace(/^"(.*)"$/, "$1");
                return !isNaN(Number(unquoted)) ? unquoted : val
            }
        }

        // Grid pulls params from stream
        // if I end up remove ng-jsoneditor, then should manually pull jsoneditor.get()
        scope.updateStreamParams = function(){
            console.log('updating params');
            var pars = runner.Templates.getParams(scope.jedit.json);
            scope.gridOptions.columnDefs.splice(0); // remove all fields
            for (k in pars) scope.addField(k);
        };

        /* Weber Functions
         *
         */ 
        scope.runWeber = function(){
            web.TR.reset();
            console.log('running');
            console.log(scope.jedit.json);
            //
            var f = runner.Templates.functize(scope.jedit.json);
            var dat = scope.getGridData();
            if (dat.length){
                for (var i = 0; i < dat.length; i++) {
                    var tmp = angular.copy(dat[i]);
                    web.TR.add(i, f(tmp));
                }
                console.log(runner.Templates.getParams(scope.jedit.json));
                console.log(dat);
                web.run();
            }
            else web.addThread(scope.jedit.json)
        };

        // JSON Editor --------------------------------------------------------
        scope.onLoadEditor = function(instance){
            scope.jedit.editor = instance;
            console.log('editor loaded');
        };

        scope.jeditChangeMode = function() {
            var opts = scope.jedit.options; 
            opts.mode = opts.mode === 'tree' ? 'code' : 'tree';
        };


        // Initialize Weber ---------------------------------------------------
        var web = new Stitch(elem.find('canvas')[0]);

        // Initialize Stream --------------------------------------------------
        scope.jedit = {};
        scope.jedit.json = [];
        scope.jedit.options = {
            change: function(){
                console.log('change');
                scope.updateStreamParams();
                
                var ace = (scope.jedit.editor || {}).editor;
                if (ace && !ace.getOption('maxLines')) ace.setOption('maxLines', 25);
            },
            ace: ace,
            // since only code mode exposes the ace editor, we'll start in 
            // code mode, set ace options, then switch to tree
            mode: 'tree',
            modes: ['code', 'tree']
        };

        // get request for jsoneditor
        if (attrs.streamVal) {
            console.log(attrs.streamVal);
            $http.get(attrs.streamVal).success(function(data){
                scope.jedit.json = data;
                scope.updateStreamParams();
            });
        }
        
        // INITIALIZE GRID ----------------------------------------------------
        //params = [{A: 1, B: 2, C:3, D:"4"}, {A:5, B:6}];
        //
        scop = scope;
        scope.params = [];
        scope.colDef = [];

        // create fields
        if (attrs.paramsVal){
            $http.get(attrs.paramsVal).success(function(data){
                console.log(data)
                Array.prototype.push.apply(scope.gridOptions.data, data);
                //for (k in data[0]) scope.addField(k);
            });
        }

        // set grid options
        scope.gridOptions = angular.copy(gridOptions);
        scope.gridOptions.columnDefs = scope.colDef;
        scope.gridOptions.data = scope.params;
        scope.gridOptions.gridMenuCustomItems =  [
            {
                title: 'Add Row',
                action: function(){scope.gridOptions.data.push({});},
                order: 10
            }
        ];

    }

    return {
        restrict: 'EA',
        scope: {},
        templateUrl: function(tElem, tAttrs){
            return tAttrs.type + '.html'
        },
        priority: 100,
        link: {
            pre: prelink
        }
    }
}]);

}); // end require
