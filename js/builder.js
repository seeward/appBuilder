$(document).ready(function() {

    var dragEl = "";



    var dragStarted = function(e) {
        dragEl = this;
        $("#propPanel").html("");
        elDetails = JSON.parse(window.localStorage.getItem(dragEl.id));

        $("#propPanel").append("<p>name: <strong>"+elDetails.name+"</strong></p>");
        $("#propPanel").append("<p>name: <strong>"+elDetails.type+"</strong></p>");
        $("#propPanel").append("<p>name: <strong>"+elDetails.author+"</strong></p>");
        $("#propPanel").append("<p>name: <strong>"+elDetails.createdDate+"</strong></p>");






        //console.log(dragEl);
        this.style.opacity = '0.4';
        console.log("dragging...");
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

    };

    var dragEnt = function(e) {
        console.log("entering...");
        e.preventDefault();

    };

    var dragOver = function(e){
        e.preventDefault();
        return false;
    };

    var dragDrop = function(e) {
        console.log("dropped...");
        dragEl.style.opacity = '1.0';
        code = JSON.parse(window.localStorage.getItem(dragEl.id));

        html = makeProps(code.props, "appCanvas1");
        $("#appCanvas1").html(html);
    };
    document.getElementById("appCanvas1").addEventListener("dragover", dragOver, false);

    document.getElementById("appCanvas1").addEventListener("dragenter", dragEnt, false);
    document.getElementById("appCanvas1").addEventListener("drop", dragDrop, false);





    var getSaved = function() {
        var ind = true;
        var projArray = [];
        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        var rows = keys.length;
        $.each(keys, function(i, obj) {
            //used to tag projects with unique ids
            var obj2 = JSON.parse(window.localStorage.getItem(obj));
            //projToTag.id = makeId();
            //window.localStorage.setItem(obj,JSON.stringify(projToTag));
            //console.log(projToTag.id);

            if (obj === "u" || obj === "cache" || obj.match(/Parse/g)) {

            } else {

                $("#compList").append("<button draggable='true' style='cursor: move' class='btn btn-custom comps' id='" + obj2.name + "'>" + obj + "</button>");
                el = $("#" + obj2.name);

                document.getElementById(obj2.name).addEventListener('dragstart', dragStarted, false);
            }




        });
    };



    var makeProps = function(props, item) {
        $("#" + item).html("");
        for (var i = 0; i < props.length; i++) {


            brk = document.createElement("br");
            labl = "<label>" + props[i] + "</label>          ";
            input = document.createElement("input");
            input.type = "text";
            input.id = props[i];
            input.className = "form_control";
            input.label = props[i];;

            //console.log(input);
            $("#" + item).append(labl);
            $("#" + item).append(input);
            $("#" + item).append(brk);

        }
    };


    (function() {
        getSaved();
    })();
});