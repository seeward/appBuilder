
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

// Base template
    var base_tpl =
        "<!doctype html>\n" +
        "<html>\n\t" +
        "<head>\n\t\t" +
        "<meta charset=\"utf-8\">\n\t\t" +
        "<script type='text/javascript' src='../../js/jq.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/bs.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/ch.js'></script>\n\t\t" +
        "<script type='text/javascript' src='../../js/POLYROOT/bower_components/webcomponentsjs/webcomponents.js'></script>\n\t\t" +
        "<link rel='import' href='../../js/POLYROOT/bower_components/polymer/polymer.html' />" +
        "<link href='http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css' rel='stylesheet' />" +
        "<link href='../../js/bs.css' rel='stylesheet' />\n\t\t" +
        "<title></title>\n\n\t\t\n\t" +
        "</head>\n\t" +
        "<body>\n\t\n\t" +
        "</body>\n" +
        "</html>";
    // polymer element template

    var polyTemp =
        "<link rel='import' href='../../js/POLYROOT/bower_components/polymer/polymer.html'>\n\n" +
        "<script type='text/javascript' src='../../js/POLYROOT/bower_components/webcomponentsjs/webcomponents.js'>\n\n\n" +
        "</script>\n\n\n" +
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

