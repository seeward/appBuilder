    /**
     * restore all saved projects from LocalStorage
     * @method getSaved
     */
    var getSaved = function() {
        var ind = true;
        var projArray = [];
        $("#consoleLog").html("");
        keys = Object.keys(localStorage);
        //console.log(keys);
        var rows = keys.length;
        $.each(keys, function(i, obj) {
            var temper = JSON.parse(window.localStorage.getItem(obj));

            if(temper.type == "Web App"){
                
                projArray.push(temper);
            }
            console.log(projArray);
            if (obj === "u" || obj === "cache" || obj.match(/Parse/g)) {

            } else {


                if (ind == true) {

                    $("#consoleLog").append("<tr><td><a style='margin-top:7px;width:150px' class='noteRow btn btn-block btn-lighter' id='" + obj + "'>" + obj + "</a></td></tr>");

                    ind = !ind;
                   
                } else {

                    $("#consoleLog").append("<tr><td><a style='margin-top:7px;width:150px' class='noteRow btn btn-block btn-light' id='" + obj + "'>" + obj + "</a></td></tr>");
                    ind = !ind;
                    
                }


            }
        });
    };