$(document).ready(function() {

    // Gather textareas
    var html_editor = $("#htmlBody"),
        css_editor = $("#cssBody"),
        js_editor = $("#jsBody");
    // Store textarea references to array
    var editors = [html_editor, css_editor, js_editor];

    function cacheLog(){
        cache = {};
        jsCache = js_editor.val();
        htmlCache = html_editor.val();
        cssCache = css_editor.val();

        cache.html = htmlCache;
        cache.js = jsCache;
        cache.css = cssCache;

        window.localStorage.setItem("cache", JSON.stringify(cache));
    
    };

    function restoreFromCache(){
        if(window.localStorage.getItem("cache")){
            restoreCache = JSON.parse(window.localStorage.getItem("cache"));
            html_editor.val(restoreCache.html);
            js_editor.val(restoreCache.js);
            css_editor.val(restoreCache.css);
        }
    };

    // Base template
    var base_tpl =
        "<!doctype html>\n" +
        "<html>\n\t" +
        "<head>\n\t\t" +
        "<script type='text/javascript' src='/js/jq.js'></script>\n\t\t" +
        "<meta charset=\"utf-8\">\n\t\t" +
        "<title>Test</title>\n\n\t\t\n\t" +
        "</head>\n\t" +
        "<body>\n\t\n\t" +
        "</body>\n" +
        "</html>";
    // Main render into iFrame
    var render = function() {
        // Get src
        var source = prepareSource();

        // Get reference to output iFrame
        var iframe = document.querySelector('#output iframe'),
        // Setup iFrame structure
            iframe_doc = iframe.contentDocument;
        // Write to iFrame
        iframe_doc.open();
        iframe_doc.write(source);
        iframe_doc.close();

        cacheLog();
    };


    var prepareSource = function() {
        // Gather textarea values
        var html = html_editor.val(),
            css = css_editor.val(),
            js = js_editor.val(),
            src = '';

        // Insert values into src template

        // HTML
        src = base_tpl.replace('</body>', html + '</body>');

        // CSS
        css = '<style>' + css + '</style>';
        src = src.replace('</head>', css + '</head>');

        // Javascript
        js = '<script>' + js + '</script>';
        src = src.replace('</body>', js + '</body>');

        // return prepared src with textarea values inserted
        return src;
    };

    // render iFrame
    $("#go").click(function() {
        render();
    });


    (function init(){
        alert("test");
        restoreFromCache();
    })();
});