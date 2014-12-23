$(document).ready(function() {

    
    // Gather textareas
    var html_editor = $("#htmlBody"),
        css_editor = $("#cssBody"),
        js_editor = $("#jsBody");
    // Store textarea references to array
    var editors = [html_editor, css_editor, js_editor];

    // pointer to current note

    var currentNote = "";

    // func to store cache of unsaved projects
    var cacheLog = function(){
        cache = {};
        jsCache = js_editor.val();
        htmlCache = html_editor.val();
        cssCache = css_editor.val();
        extJS = $("#libjs").val();
        extCSS = $("#libcss").val();
        cache.html = htmlCache;
        cache.js = jsCache;
        cache.css = cssCache;
        cache.extJS = extJS;
        cache.extCSS = extCSS;

        window.localStorage.setItem("cache", JSON.stringify(cache));
    
    };

    function restoreFromCache(){
        if(window.localStorage.getItem("cache")){
            restoreCache = JSON.parse(window.localStorage.getItem("cache"));
            html_editor.val(restoreCache.html);
            js_editor.val(restoreCache.js);
            css_editor.val(restoreCache.css);
            $("#libjs").val(restoreCache.extJS);
            $("#libcss").val(restoreCache.extCSS);
        }
    };

    // Base template
    var base_tpl =
        "<!doctype html>\n" +
        "<html>\n\t" +
        "<head>\n\t\t" +
        "<meta charset=\"utf-8\">\n\t\t" +
        "<script type='text/javascript' src='../../js/jq.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/bs.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/main.js'></script>\n\t\t" +
        
        "<link href='../../js/bs.css' rel='stylesheet' />\n\t\t" +
        "<title>Test</title>\n\n\t\t\n\t" +
        "</head>\n\t" +
        "<body>\n\t\n\t" +
        "</body>\n" +
        "</html>";
        //log consle to div

        // console function

        //save cache to project
        var saveProject = function(){
            saver = JSON.parse(window.localStorage.getItem("cache"));
            saver.title = prompt("Name project:");
            if(saver.title != null){
                window.localStorage.setItem(saver.title,JSON.stringify(saver));
            }
            getSaved();
        };

   var getSaved = function() {

        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        //console.log(keys);
        $.each(keys, function(i, obj) {
            //console.log(JSON.stringify(obj));
            if (obj != "cache" || obj != "") {
                $("#consoleLog").append("<a class='noteRow btn btn-block btn-default' id='" + obj + "'>" + obj + "</a>");

            }


        });
        
    };

    // Main render into iFrame
    var render = function() {
        // Get src
        var source = prepareSource();
        //console.log(source);
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
            lib = $("#libcss").val();
            libjs = $("#libjs").val();
            src = '';

        // Insert values into src template

        // HTML
        src = base_tpl.replace('</body>', html + '</body>');

        // CSS
        css = '<style>' + css + '</style>';
        src = src.replace('</head>', css + '</head>');
        // Libs css
        libs = '<link href="'+lib+'" rel="stylesheet"></link>';
        src = src.replace('</head>', libs + '</head>');

        // libs js
        libsJS = '<script src="'+libjs+'" type="text/javascript"></script>';
        src = src.replace('</head>', libsJS + '</head>');
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

    $("#saver").click(function(){
        saveProject();
    });

$("#consoleLog").on("click", "a", function(e) {
        note = $(this).text();
        newNote = JSON.parse(window.localStorage.getItem(note));

        js = newNote.js;
        css = newNote.css;
        html = newNote.html;

        currentNote = note;

        $("#jsBody").val(js);
        $("#cssBody").val(css);
        $("#htmlBody").val(html);

    });

$("#deleter").click(function() {
        $("#jsBody").val("");
        $("#cssBody").val("");
        $("#htmlBody").val("");

        if (currentNote != "cache") {
            window.localStorage.removeItem(currentNote);
        }
    getSaved();
    });


    (function init(){
        //window.localStorage.clear();
        restoreFromCache();
        getSaved();
    })();
});