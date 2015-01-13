$(document).ready(function() {

    var dragEl = "";



    var handleDragStart = function(e) {
       
       dragEl = e.target.id;
       console.log(dragEl);
    };

    $("#appCanvas1").on("ondragenter", function(e) {
        console.log("entered");
       e.preventDefault();
    });

    $("#appCanvas1").on("ondrop", function(e) {
        targetEl = e.target.id;
       code = JSON.parse(window.localStorage.getItem(targetEl));
       codeEditor = makeProps(code,targetEl);
       $("#"+targetEl).html(codeEditor);
        //console.log(dragEl.id);
    });



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

                el.on('dragstart', handleDragStart);
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