({
    mainConfigFile: 'boot.js',
    baseUrl: 'src',
    out: 'dist/weber-ui.js',
    name: "../bower_components/almond/almond",
    include: ['../main'],
    insertRequire: ['../main']
    //removeCombined: false,
    //findNestedDependencies: false,
    //optimize: 'none'
})
