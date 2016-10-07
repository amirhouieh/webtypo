module.exports = function extractFontlist() {

    var needTobeProcessTag = function (node) {

        if( !node.parentNode.tagName.match(/^(STYLE|SCRIPT|IFRAME|BODY)$/gi) ){
            //textLength += node.nodeValue.length;
            return true;
        }

        return false;
    };

    var isTypographicalTag = function (tagname) {
        return tagname.match(/^(a|em|small|p|article|h1|h2|h3|h4|h5|h6|span|label|mark|abbr|blockquote)$/gi)
    }

    var extractFont;
    var isImage;
    var walk;
    var temp = [];
    var className_temp = {};
    var className_stack = [];
    var classnamesCount = 0;
    var node, tree;


    document.styleSheets[0].addRule(
        '*',
        'opacity: 1 !important;'+
        'border: none !important;'+
        'outline: none !important'+
        'background: rgba(0,0,0,0); !important;' +
        'background-image: none !important;' +
        'background-color: rgba(0,0,0,0) !important;' +
        'box-shadow: 0px 0px 0px 0px rgba(0,0,0,0) !important;'
    )

    document.styleSheets[0].addRule(
        'img',
        'opacity: 0 !important;'
    )


    extractDescription = function(){

        var metas = document.getElementsByTagName('meta');

        for (i=0; i<metas.length; i++) {
            if ( metas[i].getAttribute("name") == "Description" || metas[i].getAttribute("name") == "description" ) {
                return metas[i].getAttribute("content");
            }
        }

        return "";

    }

    isImage = function (node) {
        return node.tagName == "IMG" || node.style.background.length > 1;
    };

    extractFont = function (node) {
        var css = document.defaultView.getComputedStyle(node, null)
        var tagname =  node.tagName.toLowerCase();

        var font =          css.getPropertyValue('font-family').toLocaleLowerCase()
        var size =          css.getPropertyValue('font-size')
        var lineHeight =    css.getPropertyValue('line-height')
        var style =         css.getPropertyValue('font-style')
        var weight =        css.getPropertyValue('font-weight')
        var size_lineheight = parseInt(size) + "/" + lineHeight;
        font = font.split(',')[0].replace(/\W+/g, "")

        var all_typography_parameters = tagname+"_"+font+"_"+size + "_"+style+"_"+weight;

        return {
            fontfamily: font,
            size: size_lineheight,
            style: style,
            weight: weight,
            tagname: tagname,
            atp: all_typography_parameters
        }


    };


    {
        tree = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {acceptNode: needTobeProcessTag},
            false
        );

        while (node = tree.nextNode())
            if ( node.nodeValue.trim().length > 0) {
                var nodeData = extractFont(node.parentNode);
                temp.push( nodeData );
            }
    }

    return {data: temp, title: document.title, description: extractDescription()};
};
