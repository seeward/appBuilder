$(document).ready(function() {

    var gh = {};
    var currentUser = {};
    var jsTest = "";
    jsTest += "var rootURL = \"\";";
    jsTest += "var root = this; \/\/ used by pdfbrowser and childbrowser";
    jsTest += "var deviceSDID;";
    jsTest += "var cordovaIsLoaded = false;";
    jsTest += "var deviceSDID = \"???\";";
    jsTest += "var SDID_DOMAIN = 'com.phonegap.securedeviceidentifier';";
    jsTest += "var SDID_KEY = '1234567890';";
    jsTest += "";
    jsTest += "\/* ----------------------------------------------------------- \/";
    jsTest += "    initApp";
    jsTest += "\/ ----------------------------------------------------------- *\/";
    jsTest += "function initApp(){";
    jsTest += "    report('TEST','--> initApp()..');";
    jsTest += "    try{";
    jsTest += "        $(document).ready(function(){";
    jsTest += "";
    jsTest += "            initTests();";
    jsTest += "        });";
    jsTest += "";
    jsTest += "    }catch(e){ catchError('initApp()',e); }";
    jsTest += "}";
    jsTest += "";
    jsTest += "";
    jsTest += "if(isMobile.any()){";
    jsTest += "    document.write(\"<script type='text\/javascript' src='\" + rootURL + \"cordova.js'><\/script>\");";
    jsTest += "}else{";
    jsTest += "    window.console.log('NOT-DEVICE-MODE: Skipping loading of [cordova.js] and plugins...');";
    jsTest += "    initApp();";
    jsTest += "}";
    jsTest += "";
    jsTest += "";
    jsTest += "";
    jsTest += "\/* DEBUG *\/ window.console.log('js\/index.js loaded...');";
    jsTest += "";

    $("#logout").click(function(e){
        e.preventDefault();
        window.localStorage.removeItem("u");
        $("#msgBox").show().html("User Logged Out!");
        setTimeout(function(){
            $("#msgBox").hide();
        },3000);
    });

    var mobileHTML = "";
    mobileHTML += "<!DOCTYPE html>\n";
    mobileHTML += "<html>\n";
    mobileHTML += "    <head>\n";
    mobileHTML += "        <meta charset=\"utf-8\" \/>\n";
    mobileHTML += "        <meta name=\"format-detection\" content=\"telephone=no\" \/>\n";
    mobileHTML += "        <meta name=\"viewport\" content=\"user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi\" \/>\n";
    mobileHTML += "";
    mobileHTML += "        <title>App Test<\/title>\n";
    mobileHTML += "    <\/head>\n";
    mobileHTML += "    <body>\n";
    mobileHTML += "        <div class=\"app\">\n";
    mobileHTML += "           ";
    mobileHTML += "        <\/div>\n";
    mobileHTML += "        <br clear='all'\/>\n";
    mobileHTML += "";
    mobileHTML += "";
    mobileHTML += "    <\/body>\n";
    mobileHTML += "<\/html>\n";
    mobileHTML += "";

    $("#mobiInsert").click(function(e) {
        e.preventDefault();
        $("#htmlBody").val(mobileHTML);
        $("#jsBody").val(jsTest);

    });



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



    var tempFile = "";


    var newHold = "";

    var createGist = function(fileName, dataToWrite) {
        console.log(currentUser.user);
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
        $("#output").css("width", "1024px");
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
    // polymer element template

    var polyTemp =
        "<link rel='import' href='../../js/POLYROOT/bower_components/polymer/polymer.html'>\n\n" +
        "<<script type='text/javascript' src='../../js/POLYROOT/bower_components/webcomponentsjs/webcomponents.js'></script>" +
        "<polymer-element name='' attributes=''>\n\n" +
        "<template>\n" +
        "<style>\n" +
        ":host {\n" +
        "display: block;\n" +
        "}\n" +
        "</style>\n" +
        "</template>\n\n\n" +
        "<script>\n\n" +
        "Polymer('', {\n\n\n" +

        "});\n" +
        " </script>\n\n" +

        "</polymer-element>\n";

    $("#inserter").click(function(e) {
        e.preventDefault();
        $("#htmlBody").val(polyTemp);
    });



    // clear all 

    $("#clear").click(function() {
        $("#jsBody").val("");
        $("#cssBody").val("");
        $("#htmlBody").val("");
        currentNote = "";
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
            console.log(JSON.stringify(obj));
            if (obj != "u") {
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
        $("#current").html("<strong>Proj: </strong>"+currentNote);
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
        $("#current").html("<strong>Proj: </strong>"+currentNote);
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

 $('.modal-footer button').click(function(){
        var button = $(this);

        if ( button.attr("data-dismiss") != "modal" ){
            var inputs = $('form input');
            var title = $('.modal-title');
            var progress = $('.progress');
            var progressBar = $('.progress-bar');
            var user = $("#uLogin").val();
            var pass = $("#uPassword").val();
            var userObj = {};

            userObj.user = user;
            userObj.pass = pass;

            window.localStorage.setItem("u",JSON.stringify(userObj));
            inputs.attr("disabled", "disabled");

            button.hide();

            progress.show();

            progressBar.animate({width : "100%"}, 100);

            progress.delay(1000)
                    .fadeOut(600);

            button.text("Close")
                    .removeClass("btn-primary")
                    .addClass("btn-success")
                    .blur()
                    .delay(1600)
                    .fadeIn(function(){
                        title.text("Log in is successful");
                        button.attr("data-dismiss", "modal");
                    });
        }
    });

    $('#myModal').on('hidden.bs.modal', function (e) {
        e.preventDefault();
        var inputs = $('form input');
        var title = $('.modal-title');
        var progressBar = $('.progress-bar');
        var button = $('.modal-footer button');

        inputs.removeAttr("disabled");

        title.text("Log in");

        progressBar.css({ "width" : "0%" });

        button.removeClass("btn-success")
                .addClass("btn-primary")
                .text("Ok")
                .removeAttr("data-dismiss");
                
    });

    (function init() {
        //window.localStorage.clear();
        //window.localStorage.removeItem("Parse/COrDTZjsSjOUkiIDHUXiEVdgWfqlURUbm3wKPGJW/installationId");
        $("#msgBox").hide();

        if(window.localStorage.getItem("u")){
            currentUserCache = JSON.parse(window.localStorage.getItem("u"));
            currentUser.user = currentUserCache.user;
            currentUser.pass = currentUserCache.pass;
            console.log(JSON.stringify(currentUser));
                gh = new Octokit({
        username: currentUser.user,
        password: currentUser.pass
    });
        }
        initLog = "\n<------------- init successful ------------->";
        console.log(initLog);
        restoreFromCache();
        getSaved();

    })();

    
});