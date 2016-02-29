var beaches;
var sortBy;
var myMap;
var selectedMarker = null;
var min            = new Object();
var max            = new Object();

min.episodes = 999999999;
max.episodes = 0;
min.cost     = 999999999;
max.cost     = 0;
min.volume   = 999999999;
max.volume   = 0;

var totals  = new Object();

totals.cost     = 0;
totals.episodes = 0;
totals.volume   = 0;
totals.len      = 0;
totals.cost2010 = 0;


// Load the Visualization API and the piechart package.
google.load('visualization', '1', {'packages':['corechart']});

google.setOnLoadCallback(initialize);

/**
 * The information window that will pop up when a marker is clicked.
 * There is only one so that only one window can ever be displayed at a
 * time.
 */
var infoWindow = new google.maps.InfoWindow();

/**
 * The array that contains all the markers that are displayed on the map.
 * They are in this format because, this way, you can simply loop through
 * the array and add or remove each marker from the map.
 */
var markers    = new Array();

/**
 * The function that is called as soon as the Google Visualization library
 * is loaded.  This function determines what state has been clicked by
 * recieveing the 'state' variable in the jsp and then creates a query
 * using the state.
 */

function initialize() {
    var state = "{{state}}";
    var fullStateName = "{{fullStateName}}";
    var query = new google.visualization.Query(createDataUrl("Master"));
    query.setQuery("Select A, D, E, H, I, J, L Where B = '" + state
        + "' Order By A");
    query.send(queryResponse);
}

/**
 * This function is activated when a query.send function is called with
 * this function being passed as the parameter. It checks which radio
 * button has been selected (the Sort by button) and then draws the map
 * accordingly.
 *
 * @param response the query response that is created from the query
 */
function queryResponse(response) {
    if (response.isError()) {
        alert("Error in query: " + response.getMessage() + " " +
            response.getDetailedMessage());
        return;
    }

    beaches = new Object();

    var data = response.getDataTable();
    var cols = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    //alert("Number of columns: " + cols);
    //alert("Number of rows: " + rows);


    for (var i = 0; i < document.radios.sort.length; i++) {
        if (document.radios.sort[i].checked) {
            sortBy = document.radios.sort[i].value;
        }
    }

    populateBeachesAndTotals(data);
    writeValuesToPage();

    var select  = document.getElementById('beaches');
    var options = select.getElementsByTagName('option');

    for (beach in beaches) {
        var option = document.createElement('option');
        option.id    = beach;
        option.text  = beach;
        option.value = beach;
        select.appendChild(option);
    }
    createMap(beaches, '{{state}}', sortBy, -1, -1, max);
}


/**
 * Creates the array of beaches that contains all the information about
 * each beach (cost, episodes, etc.). This method loops through the data
 * recieved from the query and instantiates the values in an array for use
 * later.
 *
 * @param data a data table containing the data recieved from a query
 */
function populateBeachesAndTotals(data) {
    var latitudeColumn  = 1;
    var longitudeColumn = 2;
    var lengthColumn    = 3;
    var volumeColumn    = 4;
    var costColumn      = 5;
    var cost2010Column  = 6;

    for (var i = 0; i < data.getNumberOfRows(); i++) {
        var index = data.getValue(i, 0).trim();
        if (beaches[index] == undefined) {
            beaches[index] = new Object();
            beaches[index].beach     = index;
            beaches[index].episodes  = 1;
            beaches[index].latitude  = data.getValue(i,
                latitudeColumn);
            beaches[index].longitude = data.getValue(i,
                longitudeColumn);
            beaches[index].cost      = data.getValue(i, costColumn);
            beaches[index].volume    = data.getValue(i, volumeColumn);
            beaches[index].len       = data.getValue(i, lengthColumn);
            beaches[index].cost2010  = data.getValue(i, cost2010Column);
        } else {
            beaches[index].episodes++;
            beaches[index].cost     += data.getValue(i, costColumn);
            beaches[index].volume   += data.getValue(i, volumeColumn);
            beaches[index].len      += data.getValue(i, lengthColumn);
            beaches[index].cost2010 += data.getValue(i, cost2010Column);
        }
    }
    jQuery.each(beaches, function() {
        if (this.episodes < min.episodes) {
            min.episodes = this.episodes;
        }
        if (this.episodes > max.episodes) {
            max.episodes = this.episodes;
        }
        if (this.cost < min.cost) {
            min.cost = this.cost;
        }
        if (this.cost > max.cost) {
            max.cost = this.cost;
        }
        if (this.volume < min.volume) {
            min.volume = this.volume;
        }
        if (this.volume > max.volume) {
            max.volume = this.volume;
        }
        totals.cost     += this.cost;
        totals.episodes += this.episodes;
        totals.volume   += this.volume;
        totals.len      += this.len;
        totals.cost2010 += this.cost2010;
    });
}
/**
 * Writes the values that were calculated from the data retrieved from the
 * query to the page. This function gets the totals for the different
 * parameters of the beaches and the minimum and maximum of each parameter
 * anf then writes them to the appropriate point on the page.
 */
function writeValuesToPage() {
    document.getElementById('total_episodes').value =
        numberWithCommas(totals.episodes);
    document.getElementById('total_cost').value = '$'
        + numberWithCommas(
            Math.round(totals.cost));
    document.getElementById('total_2010cost').value = '$'
        + numberWithCommas(
            Math.round(totals.cost2010));
    document.getElementById('total_volume').value =
        numberWithCommas(
            Math.round(totals.volume));
    document.getElementById('total_length').value =
        numberWithCommas(
            Math.round(totals.len));
    document.getElementById('totals').style.visibility = 'visible';
    var value = sortBy.toLowerCase();
    var minText;
    var maxText;
    if (value == 'cost') {
        minText = 'Min ' + sortBy + ': $'
            + numberWithCommas(min[value]);
        maxText = 'Max ' + sortBy + ': $'
            + numberWithCommas(max[value]);
    } else {
        minText = 'Min ' + sortBy + ': '
            + numberWithCommas(min[value]);
        maxText = 'Max ' + sortBy + ': '
            + numberWithCommas(max[value]);
    }
    document.getElementById('min').value   = minText;
    document.getElementById('max').value   = maxText;

    document.getElementById('heatkey').style.visibility = 'visible';
    document.getElementById('key_img').style.visibility = 'visible';
    var valueLength;
    var valueWidth = document.getElementById('max').value + '';

    if (valueWidth.substr(4, 4) == "Cost") {
        valueLength = valueWidth.length - 1;
    } else {
        valueLength = valueWidth.length;
    }

    var newWidth = 280 - (valueLength * 7);
    newWidth += 'px';

    var div = document.getElementById('maxDiv');
    div.style.left = newWidth;
}

function reDrawMap() {
    var origSort = sortBy;
    for (var i = 0; i < document.radios.sort.length;i++) {
        if (document.radios.sort[i].checked) {
            sortBy = document.radios.sort[i].value;
        }
    }
    var selected = document.getElementById('beaches').selectedIndex;
    if (origSort != sortBy || selected == 1) {
        writeValuesToPage();
        createMap(beaches, '{{state}}', sortBy, myMap.getZoom(), myMap.getCenter(), max);
        if (selectedMarker != null) {
            jQuery.each(markers, function() {
                var newPosition = this.getPosition();
                var oldPosition = selectedMarker.getPosition();
                if ((roundNumber(newPosition.lat(), 5) ==
                    roundNumber(oldPosition.lat(), 5)) &&
                    (roundNumber(newPosition.lng(), 5) ==
                    roundNumber(oldPosition.lng(), 5))) {
                    infoWindow.setPosition(this.getPosition());
                    infoWindow.open(myMap, this);
                    this.setAnimation(google.maps.Animation.BOUNCE);
                    selectedMarker = this;
                }
            });
        }
    }
}
/**
 * Moves the map to the specified location.  This function is called when
 * a beach is selected from the drop-down menu.  It moves the map to the
 * area where the beach is located, and zooms it in slightly to show the
 * beach that has been selected. It also selects the selected beach so
 * that it is bouncing and opens up the information window on the beach.
 *
 * @param newLocation the new location that the map will be centered at
 */
function moveMap(newLocation) {
    if (beaches[newLocation] != undefined) {
        var beach = beaches[newLocation];
        if (beach.latitude != null && beach.longitude != null) {
            jQuery.each(markers, function() {
                var position = this.getPosition();
                if ((roundNumber(position.lat(), 5) ==
                    roundNumber(beach.latitude, 5)) &&
                    (roundNumber(position.lng(), 5) ==
                    roundNumber(beach.longitude, 5))) {
                    var unitCost      = '$' + Math.round(beach.cost);
                    var unit2010Cost  = '$' + Math.round(beach.cost2010);
                    var unitVolume    = Math.round(beach.volume) + ' (cubic yards)';
                    var unitLength    = Math.round( beach.len) + ' (feet)';

                    var contentString =
                        '<div style="height: 210px; width: 430px;">'
                        + '<table cols="2" style="border-spacing: 10px 5px;">'
                        + '<tr><td><font size="2px">Beach Location:</font></td>'
                        + '<td><font size="2px">' + beach.beach + '</font></td></tr>'
                        + '<tr><td><font size="2px">Episodes:</font></td><td>'
                        + '<font size=2px">' + beach.episodes + '</font></td></tr>'
                        + '<tr><td><font size="2px">Total volume:</font></td><td>'
                        + '<font size=2px">' + numberWithCommas(unitVolume)
                        + '</font></td></tr>'
                        + '<tr><td><font size="2px">Total length:</font></td><td>'
                        + '<font size=2px">' + numberWithCommas(unitLength)
                        + '</font></td></tr>'
                        + '<tr><td><font size="2px">Total cost:</font></td><td>'
                        + '<font size=2px">' + numberWithCommas(unitCost)
                        + '</font></td></tr>'
                        + '<tr><td><font size="2px">Cost in 2014 dollars:</font></td><td>'
                        + '<font size=2px">' + numberWithCommas(unit2010Cost)
                        + '</font></td></tr>'
                        + '</tr></table>'
                        + '<a href="visualization.php?state=<?php echo $state; ?>&beach='
                        + beach.beach + '" target="_top">Click here</a> '
                        + 'for more information</div>';

                    myMap.setZoom(10);
                    infoWindow.setContent(contentString);
                    infoWindow.setPosition(position);
                    infoWindow.open(myMap, this);
                    this.setAnimation(google.maps.Animation.BOUNCE);

                    selectedMarker = this;
                    return false;
                }
            });
        } else {
            window.location = "visualization.php?state={{state}}&beach="+ newLocation;
        }
    } else {
        reDrawMap();
        infoWindow.close()
    }
}
