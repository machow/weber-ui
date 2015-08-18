require( ['angular', 'jsoneditor', 'app'], function(angular, JSONEditor, app) 
{
    window.JSONEditor = JSONEditor; // need to attach
    console.log('bootstrapping');
    angular.bootstrap( document, [ 'weber' ]);
});


