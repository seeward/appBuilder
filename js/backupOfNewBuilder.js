$(document).ready(function() {

    var getSaved = function() {
        var ind = true;
        var projArray = [];
        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        //console.log(keys);
        var rows = keys.length;
        $.each(keys, function(i, obj) {
            //used to tag projects with unique ids
            var obj2 = JSON.parse(window.localStorage.getItem(obj));
            //projToTag.id = makeId();
            //window.localStorage.setItem(obj,JSON.stringify(projToTag));
            //console.log(projToTag.id);

            if (obj === "u" || obj === "cache" || obj.match(/Parse/g)) {

            } else {




                $("#compList").append("<button class='btn btn-custom' id='" + obj2.name + "'>" + obj + "</button>");



            }
        });
    };


    var makeProps = function(props,item) {
        $("#"+item).html("");
        for (var i = 0; i < props.length; i++) {


            brk = document.createElement("br");
            labl = "<label>" + props[i] + "</label>          ";
            input = document.createElement("input");
            input.type = "text";
            input.id = props[i];
            input.className = "form_control";
            input.label = props[i];;

            //console.log(input);
            $("#"+item).append(labl);
            $("#"+item).append(input);
            $("#"+item).append(brk);

        }
    };





    (function() {
        getSaved();
    })();
});