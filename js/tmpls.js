$(document).ready(function(){

	    // pointer to current note

    var currentNote = "";



$("#logout").click(function(e) {
        e.preventDefault();
        window.localStorage.removeItem("u");
        $("#msgBox").show().html("User Logged Out!");
        setTimeout(function() {
            $("#msgBox").hide();
        }, 3000);
    });

   

    $("#mobiInsert").click(function(e) {
        e.preventDefault();
        $("#htmlBody").val(mobileHTML);
        $("#jsBody").val(jsTest);

    });

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

         $('#shower').click(function() {

        if (togState == true) {
            $(".expandTray").fadeOut();
            togState = false;
            return
        } else {
            $(".expandTray").fadeIn();
            togState = true;
            return
        }


    });

         // render iFrame
    $("#go").click(function() {
        render();
    });

    $("#saver").click(function() {
        saveProject();
    });

    $("#consoleLog").on("click", "a", function(e) {
        note = $(this).text();
        $("#currentInfo").html("");
        newNote = JSON.parse(window.localStorage.getItem(note));

        js = newNote.js;
        css = newNote.css;
        html = newNote.html;

        currentNote = note;
        $(".current").html(currentNote);
        $("#currentInfo").append("<tr><td>Type: </td><td>" + newNote.type + "</td></tr>");
        $("#currentInfo").append("<tr><td>Author: </td><td>" + newNote.author + "</td></tr>");
        $("#currentInfo").append("<tr><td>Date</td><td>" + newNote.createdDate.substring(0, 10) + "</td></tr>");
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
        $(".current").html(currentNote);
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

    $('.modal-footer button').click(function() {
        var button = $(this);

        if (button.attr("data-dismiss") != "modal") {
            var inputs = $('form input');
            var title = $('.modal-title');
            var progress = $('.progress');
            var progressBar = $('.progress-bar');
            var user = $("#uLogin").val();
            var pass = $("#uPassword").val();
            var userObj = {};

            userObj.user = user;
            userObj.pass = pass;


            window.localStorage.setItem("u", JSON.stringify(userObj));
            currentUser = user;
            inputs.attr("disabled", "disabled");

            button.hide();

            progress.show();

            progressBar.animate({
                width: "100%"
            }, 100);

            progress.delay(1000)
                .fadeOut(600);

            button.text("Close")
                .removeClass("btn-primary")
                .addClass("btn-success")
                .blur()
                .delay(1600)
                .fadeIn(function() {
                    title.text("Log in is successful");
                    button.attr("data-dismiss", "modal");
                });
        }
    });

    $('#myModal').on('hidden.bs.modal', function(e) {
        e.preventDefault();
        var inputs = $('form input');
        var title = $('.modal-title');
        var progressBar = $('.progress-bar');
        var button = $('.modal-footer button');

        inputs.removeAttr("disabled");

        title.text("Log in");

        progressBar.css({
            "width": "0%"
        });

        button.removeClass("btn-success")
            .addClass("btn-primary")
            .text("Ok")
            .removeAttr("data-dismiss");

    });

    $("#inserter").click(function(e) {
        e.preventDefault();
        $("#htmlBody").val(polyTemp);
    });

    // clear all 

    $("#clear").click(function() {
        $("#jsBody").val("");
        $("#cssBody").val("");
        $("#htmlBody").val("");
        currentNote = "Empty Project";
        $(".current").html(currentNote);
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



    $("#consoleLog").searcher({
        inputSelector: "#searchTerm"
        // itemSelector (tbody > tr) and textSelector (td) already have proper default values
    });

        $("#exportToGitHub").click(function(e) {
        e.preventDefault();
        exportToGitHub();
    });

            $("#export").click(function(e) {
        e.preventDefault();
        toFile = prepareSource();
        window.location = "data:application/octet-stream," + escape(toFile);
        createGist(currentNote, toFile);
        //console.log(currentNote);
    });




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


    function init(options) {

        if(options.debug == true){
            console.log("DEBUG MODE");
        }
        //addType();
        //window.localStorage.clear();
        //window.localStorage.removeItem("Parse/COrDTZjsSjOUkiIDHUXiEVdgWfqlURUbm3wKPGJW/installationId");
        $("#msgBox").hide();
        //importer();
        if (window.localStorage.getItem("u")) {
            currentUserCache = JSON.parse(window.localStorage.getItem("u"));
            currentUser = currentUserCache.user;
            
            gh = new Octokit({
                username: currentUserCache.user,
                password: currentUserCache.pass
            });
        }
        initLog = "\n<------------- init successful ------------->";
        restoreFromCache();
        getSaved();

        var editorJS = new Behave({

            textarea: document.getElementById('jsBody'),
            replaceTab: true,
            softTabs: true,
            tabSize: 4,
            autoOpen: true,
            overwrite: true,
            autoStrip: true,
            autoIndent: true
        });

        var editorCSS = new Behave({

            textarea: document.getElementById('cssBody'),
            replaceTab: true,
            softTabs: true,
            tabSize: 4,
            autoOpen: true,
            overwrite: true,
            autoStrip: true,
            autoIndent: true
        });
        var editorHTML = new Behave({

            textarea: document.getElementById('htmlBody'),
            replaceTab: true,
            softTabs: true,
            tabSize: 4,
            autoOpen: true,
            overwrite: true,
            autoStrip: true,
            autoIndent: true
        });


    };

    init(options);


});