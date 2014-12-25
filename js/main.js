$(document).ready(function() {

        $("#consoleLog").searcher({
        inputSelector: "#searchTerm"
        // itemSelector (tbody > tr) and textSelector (td) already have proper default values
    });

    $(".lined").linedtextarea();
    // Gather textareas
    var html_editor = $("#htmlBody"),
        css_editor = $("#cssBody"),
        js_editor = $("#jsBody");
    // Store textarea references to array
    var editors = [html_editor, css_editor, js_editor];

    // pointer to current note

    var currentNote = "";

    var gh = new Octokit({
        username: "seeward",
        password: "Artworker#1"
    });

    var tempFile = "";


    var newHold = "";

    var createGist = function(fileName, dataToWrite) {
        var file = {};
        var key = fileName;

        file[key] = {
            content: dataToWrite
        };

        console.log("Writing file to GitHub...");

        files = {
            "exportFromAppBuilder.txt": {
                content: dataToWrite
            }
        };

        gh.getGist().create(file)
            .done(function(gist) {
                //console.log(JSON.stringify(gist));
                $("#msgBox").html("GIST saved successfully");
                $("#msgBox").show();
                setTimeout(function() {
                    $("#msgBox").hide();
                }, 2000);
            });




    };

    var exportToGitHub = function() {
        var holder = [];
        keys = Object.keys(localStorage);
        //console.log(keys);
        $.each(keys, function(i, obj) {
            //console.log(JSON.stringify(obj));
            if (obj != "cache") {
                //console.log(obj);
                eachProject = JSON.parse(window.localStorage.getItem(obj));
                if (eachProject.html) {
                    holder.push(eachProject);
                }
            }
        });


        
        tempFile = JSON.stringify(holder);
        

        createGist("fullProjectsBackup.json", tempFile);

    };

    $("#exportToGitHub").click(function() {
        exportToGitHub();
    });



    // func to store cache of unsaved projects
    var cacheLog = function() {
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

    $("#export").click(function() {
        toFile = prepareSource();
        window.location = "data:application/octet-stream," + escape(toFile);
        createGist(currentNote, toFile);
        //console.log(currentNote);
    });


    function restoreFromCache() {
        if (window.localStorage.getItem("cache")) {
            restoreCache = JSON.parse(window.localStorage.getItem("cache"));
            html_editor.val(restoreCache.html);
            js_editor.val(restoreCache.js);
            css_editor.val(restoreCache.css);
            $("#libjs").val(restoreCache.extJS);
            $("#libcss").val(restoreCache.extCSS);
        }
    };

    $("#desktop").click(function() {
        $("#output").css("width", "100%");
        render();
    });

    $("#tablet").click(function() {
        $("#output").css("width", "720px");
        render();
    });

    $("#mobile").click(function() {
        $("#output").css("width", "400px");
        render();
    });

    // Base template
    var base_tpl =
        "<!doctype html>\n" +
        "<html>\n\t" +
        "<head>\n\t\t" +
        "<meta charset=\"utf-8\">\n\t\t" +
        "<script type='text/javascript' src='../../js/jq.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/bs.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/ch.js'></script>\n\t\t" +

        "<link href='http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css' rel='stylesheet' />" +
        "<link href='../../js/bs.css' rel='stylesheet' />\n\t\t" +
        "<title>" + currentNote + "</title>\n\n\t\t\n\t" +
        "</head>\n\t" +
        "<body>\n\t\n\t" +
        "</body>\n" +
        "</html>";
    //log consle to div

    // clear all 

    $("#clear").click(function() {
        $("#jsBody").val("");
        $("#cssBody").val("");
        $("#htmlBody").val("");
        currentNote = "...";
        $("#current").html(currentNote);
        render();
    });

    //save cache to project
    var saveProject = function() {
        render();
        if (!window.localStorage.getItem(currentNote)) {
            saver = JSON.parse(window.localStorage.getItem("cache"));
            saver.title = prompt("Name project:");
            currentNote = saver.title;
            $("#current").html(currentNote);
            if (saver.title != null) {
                window.localStorage.setItem(saver.title, JSON.stringify(saver));
            }
        } else {
            saver = JSON.parse(window.localStorage.getItem("cache"));
            window.localStorage.setItem(currentNote, JSON.stringify(saver));
        }


        getSaved();
    };

    var getSaved = function() {

        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        //console.log(keys);
        $.each(keys, function(i, obj) {
            //console.log(JSON.stringify(obj));
            if (obj != "cache") {
                $("#consoleLog").append("<tr><td><a style='margin-top:7px;width:150px' class='noteRow btn btn-block btn-default righter' id='" + obj + "'>" + obj + "</a></td></tr>");

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
        console.log("<---------- Rendering Output Successful ----------->");
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
            //lib = $("#libcss").val();
       // libjs = $("#libjs").val();
        src = '';

        // Insert values into src template

        // HTML
        src = base_tpl.replace('</body>', html + '</body>');

        // CSS
        css = '<style>' + css + '</style>';
        src = src.replace('</head>', css + '</head>');
        // Libs css
        //libs = '<link href="' + lib + '" rel="stylesheet"></link>';
        //src = src.replace('</head>', libs + '</head>');

        // libs js
        //libsJS = '<script src="' + libjs + '" type="text/javascript"></script>';
        //src = src.replace('</head>', libsJS + '</head>');
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

    $("#saver").click(function() {
        saveProject();
    });

    $("#consoleLog").on("click", "a", function(e) {
        note = $(this).text();

        newNote = JSON.parse(window.localStorage.getItem(note));

        js = newNote.js;
        css = newNote.css;
        html = newNote.html;

        currentNote = note;
        $("#current").html(currentNote);
        $("#jsBody").val(js);
        $("#cssBody").val(css);
        $("#htmlBody").val(html);
        render();

    });

    $("#deleter").click(function() {
        $("#jsBody").val("");
        $("#cssBody").val("");
        $("#htmlBody").val("");

        if (currentNote != "cache") {
            window.localStorage.removeItem(currentNote);
        }
        currentNote = "...";
        $("#current").html(currentNote);
        getSaved();
    });


    $(document).delegate('.code_box', 'keydown', function(e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();
            var start = $(this).get(0).selectionStart;
            var end = $(this).get(0).selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            $(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));

            // put caret at right position again
            $(this).get(0).selectionStart =
                $(this).get(0).selectionEnd = start + 1;
        }
    });


    (function init() {
        //window.localStorage.clear();
        //window.localStorage.removeItem("test");
        $("#msgBox").hide();
        initLog = "\n<------------- init successful ------------->";
        console.log(initLog);
        restoreFromCache();
        getSaved();

    })();
});