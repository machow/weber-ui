require.config ({
    appDir  : '',
    baseUrl : '/dist/js/',
    paths: {
        app: '../../src/mini-workbench',
        wb_timeline: '../../src/timeline',
        templates: 'templates',
        // Angular modules
        angular: 'angular.min',
        ng_jsoneditor: 'ng-jsoneditor.min',
        jsoneditor: 'jsoneditor.min',
        ng_ace: "ui-ace",
        ace: "ace",
        ng_bootstrap: 'ui-bootstrap-tpls',
        ui_grid: 'ui-grid',
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
        templates: {deps: ['angular']},
        ng_bootstrap: {deps: ['angular']},
        ng_ace: {deps: ['angular', 'ace']}

    }
});

require( ['angular', 'jsoneditor', 'app'], function(angular, JSONEditor, app) 
{
    window.JSONEditor = JSONEditor; // need to attach
    console.log('bootstrapping');
    angular.bootstrap( document, [ 'weber' ]);
});

