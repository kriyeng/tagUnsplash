/**
 * Created by kriyeng on 31/01/14.
 */
var defaultSearchValue = 'tags to search';
var searchQuery=new Array();
$(document).ready(function(){
   consultaAPI();

    $(document).on('click', '#search',function (e) {
        if($(this).val()==defaultSearchValue){
            $(this).val('');
        }
    });
    $(document).on('blur', '#search',function (e) {
        if($(this).val().trim()==''){
            $(this).val(defaultSearchValue);
        }
    });
});

var consultaAPI = function(){

    var search =$('#search').val();
    var query = (searchQuery.length>0) ? { tags : searchQuery } : { tags : ''} ;
    $.getJSON( "http://fetxit.com:8181/search", query,
        function( data ) {
            $('.photo-list').html('');
            var i=0;
            $.each( data.posts, function( key, val ) {
                i++;
                if(i<50)
                    createPhoto(i, val);
            });

        });

}

var createPhoto = function(id, val){
    //console.log(val);

    var showPhoto = function(){
        console.log("id=" + id);
        $('#photo-' + id).fadeIn('normal');
    }

    var newLi = document.createElement('li');
    newLi.className ='photo';
    newLi.setAttribute('id', 'photo-' + id);
    newLi.setAttribute('idPhoto', val._id);
    newLi.innerHTML='<div class="autor" >' + val.caption + "</div>" +
                        '<img src="' + val.url + '" />' + ((searchQuery.length > 0) ? generateTags(id, val.tags) : '');
    $('#photo-list-' + (id % 4)).append(newLi);

    setTimeout(showPhoto.bind(id), 100 * id);

}

var generateTags = function (id, tags){

    if(typeof(tags)=='undefined'){
        var tags = new Array();
    }
    var strHTML = '<div><ul class="llistaTags" id="llistaTagsPresentacio-' + id + '">';
        var i = 0;
        $.each(tags, function(key, val){
            i++;
            strHTML += '<li class="tag" id="tag-' + id + '-' + i + '"><span class="textTag"  id="text-tag-' + id + '-' + i + '">' + val +'</span></li>';
        });
    strHTML += '     </ul></div>'
    return strHTML;
}

function comprovaSiIntroSearch(obj, evt) {
    var elm = (obj.setSelectionRange) ? evt.which : evt.keyCode;
    if(elm==13){
        evt.preventDefault();
        creaNouTagSearch(obj);
    }

    if(elm==32){
        creaNouTagSearch(obj);
    }
}

function creaNouTagSearch(obj){
    var jObj=$(obj);

    if(jObj.val().trim()==''){
        jObj.val('')
        return;
    }

    var totalTags=parseInt(jObj.attr('totalTags'));
    totalTags++;
    jObj.attr('totalTags',totalTags);

    var newLi = document.createElement('li');
    newLi.className ='tag amaga';
    newLi.setAttribute('id', 'tag-' + totalTags);
    newLi.innerHTML="<span class=\"textTag\" id=\"text-tag-" + totalTags + "\">" + jObj.val() + "</span><span class=\"textTag tagPointer\"  onclick=\"borraTagSearch('" + totalTags + "');\">x</span></li>";

    $('#search').before(newLi);
    $(newLi).fadeIn('normal');
    searchQuery.push(jObj.val().trim());
    jObj.val('');
    consultaAPI();
}

function borraTagSearch(id){
    searchQuery.splice(searchQuery.indexOf($('#text-tag-' + id).text()),1);
    $('#tag-' + id).fadeOut('normal', function(){
        $('#tag-' + id).remove();
    })
    consultaAPI();
}
