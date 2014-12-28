$(document).ready(function() {

    // Gather textareas
    var html_editor = $("#htmlBody"),
        css_editor = $("#cssBody"),
        js_editor = $("#jsBody");
    // Store textarea references to array
    var editors = [html_editor, css_editor, js_editor];

    // pointer to current note

    var currentNote = "";

    var gh = {};
    var currentUser = {};

    var tempFile = "";


    var newHold = "";



    $("#logout").click(function(e){
        e.preventDefault();
        window.localStorage.removeItem("u");
        $("#msgBox").show().html("User Logged Out!");
        setTimeout(function(){
            $("#msgBox").hide();
        },3000);
    });

     $("#consoleLog").searcher({
        inputSelector: "#searchTerm"
        // itemSelector (tbody > tr) and textSelector (td) already have proper default values
    });

    //$(".lined").linedtextarea();
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





    (function init() {
        //window.localStorage.clear();
        //window.localStorage.removeItem("Parse/COrDTZjsSjOUkiIDHUXiEVdgWfqlURUbm3wKPGJW/installationId");
        $("#msgBox").hide();



        restoreFromCache();
        getSaved();

    })();

});