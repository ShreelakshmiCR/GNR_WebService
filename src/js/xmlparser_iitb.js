/* Fetching the xml from the given URL,
It will call when value of URL select box change */
$('#urls').on('change', function(){
    var request_url = this.value;
    $.ajax(
        {
            url:request_url,
            type:"GET",
            dataType: 'text',
            success:function(data, status,jqXHR ){
               xml_string = data;
               xmlParser()
               populateForm()
            },
            error: function(data) {
                alert('Error occured!')
            }

        }
    ) 
});

/* XML parser */
function xmlParser() {
    var domparser = new DOMParser();
    var xmldoc = domparser.parseFromString(xml_string,"text/xml");
    
    var request_nodes = xmldoc.getElementsByTagName('Request')[0].childNodes;
    for(j=0;j<request_nodes.length; j++){
        if(request_nodes[j].nodeType == 1 ) {
            available_requests.push(request_nodes[j].nodeName);
        }
    }

    var layer_nodes = xmldoc.getElementsByTagName('Layer')[0].childNodes

    for(i=0; i<layer_nodes.length; i++)
    {
        if(layer_nodes[i]).nodename == 'SRS')
            spacial_info.push('SRS':layer_nodes.getAttributes('SRS'));
        if (layer_nodes[i].nodeName == 'LatLonBoundingBox'){
            spatial_info.push({
                'minx':layer_nodes[i].getAttribute('minx'),
                'miny':layer_nodes[i].getAttribute('miny'),
                'maxx':layer_nodes[i].getAttribute('maxx'),
                'maxy':layer_nodes[i].getAttribute('maxy'),
            });
        } else if(layer_nodes[i].nodeName == 'Layer'){
            layers.push(layer_nodes[i].getElementsByTagName('Title')[0].childNodes[0].data);
        }
    }
}

/* Initialize the values */
function init(){
    xml_string = '';    
    available_requests = []
    spatial_info = [];
    layers = [];
}

/* Function used to popup the form with XML values */
function populateForm() {
    var new_options;
    var new_srs;
    var new_layers;

    $.each(available_requests, function(i){
        new_options += '<option value="' + available_requests[i] + '">' + available_requests[i] + '</option>'
    });
    
    $('#requests').append(new_options);

    $.each(layers, function(i){
        new_layers += '<option value="' + layers[i] + '">' + layers[i] + '</option>'
    })
    $('#layers').append(new_layers);

    
    $.each(spatial_info, function(i){
        new_srs += '<option value="' + spatial_info[i]['CRS'] + '">' + spatial_info[i]["CRS"] + '</option>' 
    })
    $('#srs').append(new_srs);
}
$(document).ready(function(){
    init();
});

$('#srs').on('change', function(){
    current_value = this.value;
    var i = spatial_info.length;
    while(i-- >0){
        if(spatial_info[i]['CRS'] == current_value){
            $('#minx').val(spatial_info[i]['minx']);
            $('#miny').val(spatial_info[i]['miny']);
            $('#maxx').val(spatial_info[i]['maxx']);
            $('#maxy').val(spatial_info[i]['maxy']);
        }
    }
});

/* Submit action */
$('#wmsform').on('submit', function(e){
    e.preventDefault();
    url = $('#urls').val();
    request = $('#requests').val();
    srs = $('#srs').val();
    layer = $('#layers').val();
    minx = $('#minx').val();
    minx = $('#minx').val();
    minx = $('#minx').val();
    minx = $('#minx').val();

    request_url = url + "?service=wms&request=" + request + "&crs=" + srs + "&layer='" + layer  + "'";
    $.ajax(
        {
            url:request_url,
            type:"GET",
            success: function(data, status, object){
                alert("Success, need to show the image");
            },
            error: function(data) {
                alert("Some error occured");
            }
        }
    )
});