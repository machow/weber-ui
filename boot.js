require.config ({
    appDir  : '',
    baseUrl : 'dist/js/',
    paths: {
        app: '../../src/mini-workbench',
        angular: 'angular.min',
        ui_grid: 'ui-grid',
        ng_jsoneditor: 'ng-jsoneditor.min',
        jsoneditor: 'jsoneditor.min',
        templates: '../templates'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        jsoneditor: {
            exports: 'JSONEditor'
        },
        ui_grid: {deps: ['angular']},
        ui_layout:{deps: ['angular']},
        ng_jsoneditor: {deps: ['angular', 'jsoneditor']},
        templates: {deps: ['angular']}

    }
});

require( ['angular', 'jsoneditor', 'app'], function(angular, JSONEditor, app) 
{
    window.JSONEditor = JSONEditor; // need to attach
    console.log('bootstrapping');
    angular.bootstrap( document, [ 'weber' ]);
});

