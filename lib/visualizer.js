module.exports = function visualiseClassnames() {

    var atpStack = {};
    var walk;
    var atpcount = 0;
    var node, tree;
    var temp =[];

    document.styleSheets[0].addRule(
        '.myuniqueclasstobehide',
        'background-color: red; !important'
    )


    var needTobeProcessTag = function (node) {

        if( !node.parentNode.tagName.match(/^(STYLE|SCRIPT|IFRAME|BODY)$/gi) ){
            //textLength += node.nodeValue.length;
            return true;
        }

        return false;
    };
    var extractATP = function(node){

        var css = document.defaultView.getComputedStyle(node, null)
        var tagname =  node.tagName.toLowerCase();

        var font =          css.getPropertyValue('font-family').toLocaleLowerCase()
        var size =          css.getPropertyValue('font-size')
        var lineHeight =    css.getPropertyValue('line-height')
        var style =         css.getPropertyValue('font-style')
        var weight =        css.getPropertyValue('font-weight')
        font = font.split(',')[0].replace(/\W+/g, "")

        return tagname+"_"+font+"_"+size + "_"+style+"_"+weight;

    }

    tree = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {acceptNode: needTobeProcessTag},
        false
    );

    while (node = tree.nextNode()) {
        if (node.nodeValue.trim().length > 0) {
            var atp = extractATP( node.parentNode );
            var wrapper = document.createElement('span');

            wrapper.className =  atp;
            wrapper.appendChild(node.parentNode.replaceChild(wrapper, node));

            node.parentNode.className += " myuniqueclasstobehide";

            if (atpStack[atp]) {
                atpStack[atp] += 1
                atpcount++;
            } else {
                atpStack[atp] = 1
            }

        }
    }

    for(atp in atpStack){
        var rgb = ~~( atpStack[atp] * 255 / atpcount);

        var selector = '.' + atp;
        var cssRule = 'background-color: rgb('+rgb+','+rgb+',' +rgb+ ') !important; color: rgb('+rgb+','+rgb+',' +rgb+ ') !important;';

        temp.push( {selector: selector, css: cssRule} );


        document.styleSheets[0].addRule(selector, cssRule);

    }

    return temp;

}
