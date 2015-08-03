require.config ({
    baseUrl : '/src',
    paths: {
        app: 'app',
        templates: '../dist/js/templates',
        // Angular modules
        angular:        '../dist/js/angular.min',
        ng_jsoneditor:  '../dist/js/ng-jsoneditor.min',
        jsoneditor:     '../dist/js/jsoneditor.min',
        ng_ace:         '../dist/js/ui-ace',
        ace:            '../dist/js/jsoneditor-ace',
        ng_bootstrap:   '../dist/js/ui-bootstrap-tpls',
        ui_grid:        '../dist/js/ui-grid.min'
    },
    shim: {
        ace: {
            exports: 'ace'
        },
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

