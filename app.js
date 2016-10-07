var phantom = require('phantom');
var jsonfile = require('jsonfile')

const extractor = require('./lib/extractor');
const visualizer = require('./lib/visualizer');

var sitepage = null;
var phInstance = null;

const configs = {
    VIEW_WIDTH: 1440,
    VIEW_HEIGHT: 960,
    FILE_FORMAT: 'png',
    OUTPUT_DIR: ''
}

const url = process.argv[2];

phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        page.property('viewportSize', { width: configs.VIEW_WIDTH, height: configs.VIEW_HEIGHT},function(result) {
            console.log("Viewport set to: " + result.width + "x" + result.height)
        });
        sitepage = page;
        return page.open(url);
    })
    .then(status => {

        console.log(url, 'is open', status);

        sitepage
        .invokeMethod('evaluate',extractor)
        .then(function(rawlist){

            var pagetitle = rawlist.title;
            var imgId = '' + new Date().getTime();

            var normal_view_name_postfix = 'normal';
            var visualized_view_name_postfix = "visualized";

            var normal_view_rendername = imgId + "/" + normal_view_name_postfix + '.' + configs.FILE_FORMAT;
            var visualized_view_rendername = imgId + "/" + visualized_view_name_postfix + '.' + configs.FILE_FORMAT;

            // render the normal view
            sitepage
                .render( normal_view_rendername )
                .then(()=>{
                    console.log(normal_view_rendername, 'is saved!');
                })


            // evaluate for the visualizing view
            sitepage
                .invokeMethod('evaluate',visualizer)
                .then(function(msgFromVisulizer) {
                    sitepage.render(visualized_view_rendername)
                        .then(()=>console.log(visualized_view_rendername,'is saved'));
                    phInstance.exit();
                });

            console.log('page is analyzed!');
            jsonfile.writeFile(imgId+'/'+'data.json', rawlist, function (err) {
                console.error(err)
            })

        });
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });

