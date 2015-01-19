$(document).ready(function() {

    var dragEl = "";

    var dragStarted = function(e) {
        dragEl = this;
        console.log("onStart" + dragEl.id);
        $("#propPanel").html("");
        elDetails = JSON.parse(window.localStorage.getItem("##"+dragEl.id));

        // <div class='input-group input-group-sm'><span class='input-group-addon'>" + + "</span><input type='text' id='" ++ "' class='form-control'/></div>



        $("#propPanel").append("<div class='input-group input-group-sm'><span class='input-group-addon' style='background-color:#51BF87;width:75px'>Name: </span><input type='text' value='" + elDetails.name + "' class='form-control'/></div>");
        $("#propPanel").append("<div class='input-group input-group-sm'><span class='input-group-addon' style='background-color:#51BF87;width:75px'>Type:  </span><input type='text' value='" + elDetails.type + "' class='form-control'/></div>");
        $("#propPanel").append("<div class='input-group input-group-sm'><span class='input-group-addon' style='background-color:#51BF87;width:75px'>Date: </span><input type='text' value='" + elDetails.createdDate + "' class='form-control'/></div>");


        //console.log(dragEl);
        this.style.opacity = '0.4';
        //console.log("dragging...");
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

    };

    var dragStartedNew = function(e) {
        dragEl = this;
        console.log("onStart" + dragEl.id);

        //console.log(dragEl);
        this.style.opacity = '0.4';
        //console.log("dragging...");
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

    };



    var dragEnt = function(e) {

        //console.log("entering...");
        e.preventDefault();

    };

    var dragOver = function(e) {
        e.preventDefault();
        $(this).addClass("over");
        return false;
    };

    var dragDrop = function(e) {
        $(".over").removeClass("over");

        //console.log("dropped...");
        console.log("should not fire");
        dragEl.style.opacity = '1.0';
        targetElement = this;
        registerComponentOnCanvas(targetElement);
        console.log("onDrop" + dragEl.id);

    };

    var dragDropNew = function(e) {
        console.log(dragEl.id);
        dragEl.remove();
        $(this).empty();
        $(".over").removeClass("over");
        console.log("A test");
    };

    var dragExit = function(e) {
        $(".over").removeClass("over");
        console.log("exited...");


    };

    var makePreview = function(js, html, css) {

        css = "<style>" + css + "</style>";
        js = "<script>" + js + "</script>";
        srcCode = css + html + js;
        css = "";
        js = "";
        html = "";
        return srcCode

    };





    var registerComponentOnCanvas = function(el) {
        var html = "";
        code = JSON.parse(window.localStorage.getItem("##"+dragEl.id));
        var header = "<h4>" + dragEl.id + "</h4><hr>";

        if (code.description) {
            html = html + makeDesc(code.description);

        }
        if (code.props) {
            html = html + makeProps(code.props);
        }
        if (code.methods) {
            html = html + makeMethods(code.methods);
        }
        if (code.models) {
            html = html + makeModels(code.models);
        }
        if (code.events) {
            html = html + makeEvents(code.events);
        }

        if (code.bindings) {
            html = html + makeBindings(code.bindings);
        }
        html = "<div style='padding:15px'>" + html + "</div>";
        var propTemp =
            '<div class="panel-group" id="accordion' +
            code.name +
            '">' +
            '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
            '<a data-toggle="collapse" style="text-decoration:none" data-parent="#accordion' +
            code.name +
            '" href="#collapseOne' + code.name + '" >' +
            code.name +
            '</a></h4></div><div id="collapseOne' + code.name + '" class="panel-collapse collapse"><div class="panel-body">' +
            html +
            '</div></div></div></div>'


        preview = makePreview(code.js, code.html, code.css);
        var finalHtml = "<div draggable='true' class='erase' id='" + code.name + "new'>" + propTemp + "<hr>Preview: <br><br>" + preview + "</div>";

        $(el).html(finalHtml);
        document.getElementById(code.name + 'new').addEventListener('dragstart', dragStartedNew, false);

    };



    // Set event listeners for drag and drop actions
    var x = document.getElementsByClassName("canvasSection");
    var c;
    for (c = 0; c < x.length; c++) {
        x[c].addEventListener("dragover", dragOver, false);
        x[c].addEventListener("dragenter", dragEnt, false);
        x[c].addEventListener("drop", dragDrop, false);
        x[c].addEventListener("dragleave", dragExit, false);
    }





    document.getElementById("propPanel").addEventListener("dragover", dragOver, false);
    document.getElementById("propPanel").addEventListener("dragenter", dragEnt, false);
    document.getElementById("propPanel").addEventListener("drop", dragDropNew, false);
    document.getElementById("propPanel").addEventListener("dragleave", dragExit, false);

    var getSaved = function() {
        var ind = true;
        var projArray = [];
        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        var rows = keys.length;
        $.each(keys, function(i, obj) {

             if (obj.match(/##/g)) {
           
 $("#compList").append("<button draggable='true' style='cursor: move' class='btn btn-custom comps' id='" + obj.substr(2) + "'>" + obj.substr(2) + "</button>");
                el = $("#" + obj.substr(2));

                document.getElementById(obj.substr(2)).addEventListener('dragstart', dragStarted, false);

}

        });
    };





    var makeProps = function(props, item) {
        var bundle = "";
        var tag = "Properties:<br>";
        if (props[0] != "") {
            for (var i = 0; i < props.length; i++) {


                brk = "<br>";
                //labl = "<label>" + props[i] + "</label>          ";
                input = "<div class='input-group input-group-sm'><span class='input-group-addon'>" + props[i] + "</span><input type='text' id='" + props[i] + "' class='form-control'/></div>";

                bundle = bundle + input;


            }

            return "Properties: <br>" + bundle + "<button style='margin-top:10px' class='btn btn-success btn-block setProps'>Set Values</button><br>";
        }
        return tag + "No Properties<br><br>";
    };

    var makeEvents = function(props, item) {
        var bundle = "";
        var tag = "Events: <br>";
        if (props[0] != "") {
            for (var i = 0; i < props.length; i++) {


                brk = "<br>";
                //labl = "<label>" + props[i] + "</label>          ";
                input = "<li>" + props[i] + "</li>";

                bundle = bundle + input + brk;

            }

            return "Events: <br><ul>" + bundle + "</ul>";
        }

        return tag + "No Events<br><br>";
    };

    var makeBindings = function(props, item) {
        var bundle = "";
        var tag = "Bindings: <br>";
        if (props[0] != "") {
            for (var i = 0; i < props.length; i++) {


                brk = "<br>";
                //labl = "<label>" + props[i] + "</label>          ";
                input = "<li>" + props[i] + "</li>";

                bundle = bundle + input + brk;

            }

            return "Bindings: <br><ul>" + bundle + "</ul>";
        }

        return tag + "No Bindings<br><br>";
    };

    var makeDesc = function(props, item) {
         bundler = "";

        
            


        

                inputer = "<p><strong>" + props[0] + "</strong></p>";

                bundler = "Description: <br>" + bundler + inputer + "<br>";

            console.log(bundler);

            return bundler;
       

        
    };




    var makeMethods = function(props, item) {
        var bundle = "";
        var tag = "Methods: <br>";
        if (props[0] != "") {
            for (var i = 0; i < props.length; i++) {


                brk = "<br>";
                //labl = "<label>" + props[i] + "</label>          ";
                input = "<li>" + props[i] + "</li>";

                bundle = bundle + input + brk;

            }

            return "Methods: <br><ul>" + bundle + "</ul>";
        }

        return tag + "No Methods<br><br>";
    };

    var makeModels = function(props, item) {
        var bundle = "";
        var tag = "Models: <br>";
        if (props[0] != "") {

            for (var i = 0; i < props.length; i++) {


                brk = "<br>";
                //labl = "<label>" + props[i] + "</label>          ";
                input = "<li>" + props[i] + "</li>";

                bundle = bundle + input;

            }
            return tag + "<ul>" + bundle + "</ul>";
        }


        return tag + "No Models<br><br>";
    };


    (function() {
        getSaved();
    })();
});