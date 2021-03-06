(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file App Builder
 * @copyright kalmeer media 2014
 * @author seeward@gmail.com
 */



$(document).ready(function() {





    /**
     * global obj to hold init params
     * @name Options
     * @prop {boolean} debug - sets up user for debug viewing
     * @prop {boolean} GitHub - toggles GH integration
     * @prop {boolean} kalmeerMode - toogles light and dark themes
     
     */


    /* 
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     
     *  __ __  ____ ____    _____
     * |  |  |/    |    \  / ___/
     * |  |  |  o  |  D  )(   \_
     * |  |  |     |    /  \__  |
     * |  :  |  _  |    \  /  \ |
     *  \   /|  |  |  .  \ \    |
     *   \_/ |__|__|__|\_|  \___|
     
     
     
     */


    var options = {
        debug: false,
        GitHub: true,
        kalmeerMode: false

    };


    var loader = "<img src='loader.gif' />";

    // var for Github API object
    var gh = {};
    /**
 * global obj to hold user detials
 * @name currentUser
 * @prop {string} user - logged in username
 * @prop {string} password - pswd
 
 */
    var currentUser = {};

    /**
 * main editor javascript
 * @name jseditor
 
 */
    var jseditor = ace.edit("jsEditor");
    jseditor.setOption("showPrintMargin", false);
    jseditor.setOption("fontSize", "24px");
    jseditor.setTheme("ace/theme/monokai");
    jseditor.$blockScrolling = Infinity;
    jseditor.getSession().setMode("ace/mode/javascript");

    /**
 * main editor html
 * @name htmleditor
 
 */
    var htmleditor = ace.edit("htmlEditor");
    htmleditor.setOption("showPrintMargin", false);
    htmleditor.setOption("fontSize", "24px");
    htmleditor.setTheme("ace/theme/chrome");
    htmleditor.$blockScrolling = Infinity;
    htmleditor.getSession().setMode("ace/mode/html");
    /**
 * main editor css
 * @name csseditor
 
 */
    var csseditor = ace.edit("cssEditor");
    csseditor.setOption("showPrintMargin", false);
    csseditor.$blockScrolling = Infinity;
    csseditor.setOption("fontSize", "24px");
    csseditor.setTheme("ace/theme/eclipse");
    csseditor.getSession().setMode("ace/mode/css");


    /**
 * pointer to current note and temp files for note processing
 * @name currentNote
 
 */
    var currentNote = "";
    var tempFile = "";
    var newHold = "";


    /**
******************************************************************************************
******************************************************************************************
******************************************************************************************
******************************************************************************************
******************************************************************************************
******************************************************************************************
******************************************************************************************
******************************************************************************************
******************************************************************************************
* _____  __ __  ____     __ _____
*|     ||  T  T|    \   /  ] ___/
*|   __j|  |  ||  _  Y /  (   \_ 
*|  l_  |  |  ||  |  |/  / \__  T
*|   _] |  :  ||  |  /   \_/  \ |
*|  T   l     ||  |  \     \    |
*l__j    \__,_jl__j__j\____j\___j
                                
*/


    var former = console.log;
    console.log = function(msg) {
        former.apply(console, arguments); //maintains existing logging via the console.

        if (options.debug == true) {
            $("#msgBox").html(msg);
            $("#msgBox").slideDown();
        }

    }

    window.onerror = function(message, url, linenumber) {
        console.log("JavaScript error: " + message + " on line " +
            linenumber + " for " + url);
    }




    /**
     * create file to export to GIST
     * @method createGist
     * @param {string} fileName - filename tag
     * @param {string} dataToWrite - actual src to export
     */
    var createGist = function(fileName, dataToWrite) {
        var file = {};
        var key = fileName;
        file[key] = {
            content: dataToWrite
        };
        $("#msgBox").slideDown().html(loader + " Writing file to GitHub...");
        //console.log("Writing file to GitHub...");
        files = {
            "exportFromAppBuilder.txt": {
                content: dataToWrite
            }
        };
        gh.getGist().create(file)
            .done(function(gist) {
                //console.log(JSON.stringify(gist));
                $("#msgBox").html("<h4>GIST saved successfully</h4>");
                $("#msgBox").slideDown();
                setTimeout(function() {
                    $("#msgBox").slideUp();
                }, 2000);
            });
    };


    /**
     * build up object to export
     * @method exportToGitHub
     */
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


    /**
     * func to store cache of unsaved projects
     * @method cacheLog
     */
    var cacheLog = function() {
        cache = {};
        jsCache = jseditor.getValue();
        htmlCache = htmleditor.getValue();
        cssCache = csseditor.getValue();
        extJS = $("#libjs").val();
        extCSS = $("#libcss").val();
        cache.html = htmlCache;
        cache.js = jsCache;
        cache.css = cssCache;
        cache.extJS = extJS;
        cache.extCSS = extCSS;

        window.localStorage.setItem("cache", JSON.stringify(cache));

    };

    /**
     * Retore unsaved project to editors on restart init()
     * @method restoreFromCache
     */
    function restoreFromCache() {
        if (window.localStorage.getItem("cache")) {
            restoreCache = JSON.parse(window.localStorage.getItem("cache"));
            htmleditor.setValue(restoreCache.html);
            jseditor.setValue(restoreCache.js);
            csseditor.setValue(restoreCache.css);

            $("#libjs").val(restoreCache.extJS);
            $("#libcss").val(restoreCache.extCSS);
        }
    };


    /**
     * Unique ID generator for Projects
     * @method makeId text
     * @return string text
     */
    var makeId = function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log("New ID generated:  " + text);
        return text;
    }


    /**
     * save cache to project
     * @method saveProject
     */
    var saveProject = function() {
        render();
        if (!window.localStorage.getItem(currentNote)) {
            us = JSON.parse(window.localStorage.getItem("u"));
            saver = JSON.parse(window.localStorage.getItem("cache"));
            saver.title = prompt("Name project:");
            saver.author = us.user;
            saver.createdDate = new Date();
            saver.id = makeId();
            //console.log(saver.id);
            saver.type = "Web App";

            currentNote = saver.title;
            $(".current").html(currentNote);
            if (saver.title != null) {
                window.localStorage.setItem(saver.title, JSON.stringify(saver));
                $("#msgBox").html("<h4>Project Saved!</h4>").slideDown();
            }
        } else {
            saver = JSON.parse(window.localStorage.getItem("cache"));
            //saver.id = makeId();
            //console.log(saver.id);
            window.localStorage.setItem(currentNote, JSON.stringify(saver));
            $("#msgBox").html("<h4>Project Saved!</h4>").slideUp();

        }
        //refresh the saved projects list
        getSaved();

        setTimeout(function() {
            $("#msgBox").slideUp();
        }, 2000);
    };


    /**
     * restore all saved projects from LocalStorage
     * @method getSaved
     */
    var getSaved = function() {
        var ind = true;
        var x = 0;
        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        //console.log(keys);
        var rows = keys.length;
        $.each(keys, function(i, obj) {
            if (x <= 100) {
                x = x + 10;
            }

            if (obj != "u") {
                if (obj != "cache") {

                    if (ind == true) {

                        $("#consoleLog").append("<tr><td><a style='margin-top:7px;width:150px' class='noteRow btn btn-block btn-lighter' id='" + obj + "'>" + obj + "</a></td></tr>");

                        ind = !ind;
                        //console.log(ind);
                    } else {

                        $("#consoleLog").append("<tr><td><a style='margin-top:7px;width:150px' class='noteRow btn btn-block btn-light' id='" + obj + "'>" + obj + "</a></td></tr>");
                        ind = !ind;
                        //console.log(ind);
                    }

                };
            }
        });
    };


    /**
     * render iFrame to full screen modal
     * @method renderFull
     */
    var renderFull = function() {
        $("#full").show();

        var source2 = prepareSource();
        //console.log(source);
        // Get reference to output iFrame
        var iframe2 = document.querySelector('#fullest'),
            // Setup iFrame structure
            iframe_doc2 = iframe2.contentDocument;
        // Write to iFrame

        iframe_doc2.open();
        iframe_doc2.write(source2);
        iframe_doc2.close();

    };


    /**
     * Main render into iFrame
     * @method render
     */
    var render = function() {
        // Get src


        var source = prepareSource();
        //console.log(source);
        // Get reference to output iFrame
        var iframe = document.querySelector('#output iframe'),
            // Setup iFrame structure
            iframe_doc = iframe.contentDocument;
        // Write to iFrame
        //console.log("Output Successful");
        iframe_doc.open();
        iframe_doc.write(source);
        iframe_doc.close();

        cacheLog();

    };


    /**
     * prepare source doc by inserting values from editors
     * @method prepareSource src
     * @return src
     */
    var prepareSource = function() {

        // Gather textarea values
        var html = htmleditor.getValue(),
            css = csseditor.getValue(),
            js = jseditor.getValue(),
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

    /**
     * helper function to import JSON backups
     * @method importer
     */
    var importer = function() {
        console.log("Importing projects...");
        $.getJSON("backup.json", function(data) {
            $.each(data, function(i, o) {

                window.localStorage.setItem(o.name, JSON.stringify(o));
            });

        });
    };

    /**
     * helper function to add properties to currentProject obj
     * @method addType
     */
    var addType = function() {

        keys = Object.keys(localStorage);
        //console.log(keys);
        $.each(keys, function(i, obj) {

            fullObj = JSON.parse(window.localStorage.getItem(obj));
            fullObj.type = "Web App";
            fullObj.name = obj.toString();

            cu = window.localStorage.getItem("u");
            cu = JSON.parse(cu);
            fullObj.author = cu.user;
            fullObj.createdDate = new Date();
            window.localStorage.setItem(obj.toString(), JSON.stringify(fullObj));
        });

    };


    /**
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     
     *   ___ __ __    ___  ____   ______  _____
     *  /  _]  T  |  /  _]|    \ |      T/ ___/
     * /  [_|  |  | /  [_ |  _  Y|      (   \_
     *Y    _]  |  |Y    _]|  |  |l_j  l_j\__  T
     *|   [_l  :  !|   [_ |  |  |  |  |  /  \ |
     *|     T\   / |     T|  |  |  |  |  \    |
     *l_____j \_/  l_____jl__j__j  l__j   \___j
     *
     */


    $("#shower").click(function() {
        
        var curr = JSON.parse(window.localStorage.getItem(currentNote));
        if (curr != null) {
            $("#projDetails").modal("show");
            console.log(curr.name, curr.type, curr.author);

            $("#projName").val(curr.name);
            $("#projAuthor").val(curr.author);
            $("#projType").val(curr.type);

        } else {
            $("#msgBox").html("<h4>You must create or load a new project to edit details.</h4>").slideDown();
            setTimeout(function() {
                $("#msgBox").slideUp();
            }, 2000);
        }


    });


    $("#saveProjDetails").click(function() {
        $("#projDetails").modal('hide');


        var cur = JSON.parse(window.localStorage.getItem(currentNote));
        cur.name = $("#projName").val();
        cur.author = $("#projAuthor").val();
        cur.type = $("#projType").val();

        if (cur.date == undefined) {
            cur.date - new Date();
        }

        window.localStorage.setItem(currentNote, JSON.stringify(cur));
        console.log("e:saveProjDetails");
        $("#msgBox").html("<h4>Project details saved!</h4>").slideDown();
        setTimeout(function() {
            $("#msgBox").slideUp();
        }, 2000);
    });

    /**
     * fix for ACE editor no updating
     * @name toggleFocus
     * @function
     * @global
     * @param shown.bs.tab - event when tab is selected
     */

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = $(e.target).attr("href");
        switch (target) {

            case "#js":
                jseditor.focus();
                jseditor.gotoLine(1);
                console.log("jseditor selected");
                return;
            case "#css":
                csseditor.focus();
                csseditor.gotoLine(1);
                console.log("csseditor selected");
                return;
            case "#html":
                htmleditor.focus();
                htmleditor.gotoLine(1);
                console.log("htmleditor selected");
        }
    });

    /**
     * remove user details
     * @name logOut
     * @function
     * @global
     * @param event - event logout button is pressed
     */


    $("#logout").click(function(e) {
        e.preventDefault();
        console.log("e:saveProjDetails");
        window.localStorage.removeItem("u");
        $("#msgBox").slideDown().html("User Logged Out!");
        setTimeout(function() {
            $("#msgBox").slideUp();
        }, 3000);
    });

    /**
     * begin new mobile app project
     * @name mobileIntsert
     * @function
     * @global
     * @param event - event logout button is pressed
     */

    $("#mobiInsert").click(function(e) {
        e.preventDefault();
        console.log("e:mobiInsert");
        htmleditor.setValue(mobileHTML);
        jseditor.setValue(jsTest);


    });

    /**
     * init the searcher function for projects table
     * @name searcher
     * @function
     * @global
     * @param event - event on init()
     */

    $("#consoleLog").searcher({
        inputSelector: "#searchTerm"
        // itemSelector (tbody > tr) and textSelector (td) already have proper default values
    });

    /**
     * export to GH event
     * @name export
     * @function
     * @global
     * @param event - event export button is pressed
     */

    $("#exportToGitHub").click(function(e) {
        e.preventDefault();
        console.log("e:exportToGitHub");
        exportToGitHub();
    });


    $("#export").click(function(e) {
        e.preventDefault();
        console.log("e:export");
        if (jseditor.getValue() != "" && csseditor.getValue() != "" && htmleditor.getValue() != "") {

            toFile = prepareSource();
            window.location = "data:application/octet-stream," + escape(toFile);
            createGist(currentNote, toFile);
            //console.log(currentNote);

        } else {
            $("#msgBox").html("<h4>You cannot export an empty project.</h4>").slideDown();

            setTimeout(function() {
                $("#msgBox").slideUp();
            }, 3000);
        }
    });

    /**
     * screen size button for desktop
     * @name desktop
     * @function
     * @global
     * @param event - event desktop button is pressed
     */


    $("#desktop").click(function() {
        console.log("e:desktop");
        $("#output").css("width", "100%");
        render();
    });

    /**
     * screen size button for tablet
     * @name tablet
     * @function
     * @global
     * @param event - event tablet button is pressed
     */

    $("#tablet").click(function() {
        console.log("e:tablet");
        $("#output").css("width", "1024px");
        render();
    });
    /**
     * screen size button for mobile
     * @name mobile
     * @function
     * @global
     * @param event - event mobile button is pressed
     */
    $("#mobile").click(function() {
        console.log("e:mobile");
        $("#output").css("width", "400px");
        render();
    });


    /**
     * begin new polymer element project
     * @name inserter
     * @function
     * @global
     * @param event - insert Polymer element starter files
     */
    $("#inserter").click(function(e) {
        console.log("e:inserter");


        e.preventDefault();
        jseditor.setValue("");
        csseditor.setValue("");
        //htmleditor.setValue(polyTemp);
        var newTemp = $('#polymerTemp').html();
        newTemp = newTemp.replace(/CHANGE/g, "script");
        var template = newTemp;
        Mustache.parse(template);
        var rendered = Mustache.render(template, {});
        htmleditor.setValue(rendered);

    });


    /**
     * clear all three editors
     * @name clear
     * @function
     * @global
     * @param event - event clear button is pressed
     */
    $("#clear").click(function() {
        console.log("e:clear");
        jseditor.setValue("");
        csseditor.setValue("");
        htmleditor.setValue("");

        currentNote = "Empty Project";
        $(".current").html(currentNote);
        render();
    });




    // render iFrame
    $("#go").click(function() {
        console.log("e:goRender");
        render();
    });
    // save project
    $("#saver").click(function() {
        console.log("e:saveProject");
        saveProject();
    });

    /**
     * event to load selected project into editors
     * @name loadProject
     * @function
     * @global
     * @param event - event project button is pressed
     */

    $("#consoleLog").on("click", "a", function(e) {
        console.log("e:loadProject");
        note = $(this).text();
        $("#currentInfo").html("");
        newNote = JSON.parse(window.localStorage.getItem(note));

        js = newNote.js;
        css = newNote.css;
        html = newNote.html;

        currentNote = note;
        $(".current").html(currentNote);
        //$("#currentInfo").append("<tr><td>Type: </td><td>" + newNote.type + "</td></tr>");
        //$("#currentInfo").append("<tr><td>Author: </td><td>" + newNote.author + "</td></tr>");
        // $("#currentInfo").append("<tr><td>Date</td><td>" + newNote.createdDate.substring(0, 10) + "</td></tr>");
        jseditor.setValue(js);
        csseditor.setValue(css);
        htmleditor.setValue(html);

        render();

    });

    /**
     * delete project
     * @name deleter
     * @function
     * @global
     * @param event - event delete button is pressed
     */

    $("#deleter").click(function() {
        console.log("e:deleter");
        jseditor.setValue("");
        csseditor.setValue("");
        htmleditor.setValue("");


        if (currentNote != "cache") {
            window.localStorage.removeItem(currentNote);
        }
        currentNote = "Empty Project";
        $(".current").html(currentNote);
        getSaved();
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

    /**
     * screen size button for fullScreen
     * @name fullScreen
     * @function
     * @global
     * @param event - event fullScreen button is pressed
     */

    $("#fullScreen").click(function() {
        console.log("e:fullScreen");
        renderFull();

    });


    $("#debug").click(function(e) {
        e.preventDefault();
        options.debug = !options.debug;
        console.log("e:debug :: " + options.debug);

        setTimeout(function() {
            $("#msgBox").slideUp();
        }, 2000);

    });

    /**
     * toggle light and dark themes
     * @name kalmeer
     * @function
     * @global
     * @param event - event kalmeerMode button is pressed
     */


    $("#kalmeer").click(function(e) {
        e.preventDefault();
        console.log("e:kalmeer");
        if (kalmeerMode == true) {
            $("#jsBody").css("background-color", "black");
            $("#jsBody").css("color", "white");
            $("#htmlBody").css("background-color", "black");
            $("#htmlBody").css("color", "white");
            $("#cssBody").css("background-color", "black");
            $("#cssBody").css("color", "white");
            $("body").css("background-color", "black");
            $("#output").css("background-color", "white");
            kalmeerMode = false;
        } else {
            $("#htmlBody").css("background-color", "white");
            $("#htmlBody").css("color", "black");
            $("#cssBody").css("background-color", "white");
            $("#cssBody").css("color", "black");
            $("#jsBody").css("background-color", "white");
            $("#jsBody").css("color", "black");
            $("body").css("background-color", "white");
            kalmeerMode = true;
        }

    });


    /**
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     ******************************************************************************************
     * ____  ____   ____  ______
     *l    j|    \ l    j|      T
     * |  T |  _  Y |  T |      |
     * |  | |  |  | |  | l_j  l_j
     * |  | |  |  | |  |   |  |
     * j  l |  |  | j  l   |  |
     *|____jl__j__j|____j  l__j
     *
     */


    /**
     * global init() function
     * @method init
     * @param {object} options
     */
    function init(options) {

        kalmeerMode = options.kalmeerMode;

        if (kalmeerMode == true) {
            $("#kalmeer").trigger("click");
        }
        if (options.debug == true) {
            console.log("DEBUG MODE");
        }
        //addType();
        //window.localStorage.clear();
        //window.localStorage.removeItem("Parse/COrDTZjsSjOUkiIDHUXiEVdgWfqlURUbm3wKPGJW/installationId");
        $("#msgBox").slideUp();
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

    };

    // run init() method with options obj defined at the top

    init(options);


});
},{"uniq":2}],2:[function(require,module,exports){
"use strict"

function unique_pred(list, compare) {
  var ptr = 1
    , len = list.length
    , a=list[0], b=list[0]
  for(var i=1; i<len; ++i) {
    b = a
    a = list[i]
    if(compare(a, b)) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique_eq(list) {
  var ptr = 1
    , len = list.length
    , a=list[0], b = list[0]
  for(var i=1; i<len; ++i, b=a) {
    b = a
    a = list[i]
    if(a !== b) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique(list, compare, sorted) {
  if(list.length === 0) {
    return list
  }
  if(compare) {
    if(!sorted) {
      list.sort(compare)
    }
    return unique_pred(list, compare)
  }
  if(!sorted) {
    list.sort()
  }
  return unique_eq(list)
}

module.exports = unique

},{}]},{},[1]);
