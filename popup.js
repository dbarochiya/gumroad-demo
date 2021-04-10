function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function initPopup() {
    //add container
    var popup_wrapper = document.createElement('div');
    popup_wrapper.id = 'iframe-container';
    popup_wrapper.style.display = 'none';
    popup_wrapper.innerHTML = `
        <div id="iframe-content">  
            <span id="iframe-close"> close </span>
        <div>`;
    document.body.appendChild(popup_wrapper);
    
    //add styling
    var my_style = `
    .iframe-wrapper{
        display: block;
        height: 600px;
        width: 100%;
    }
    
    iframe{
        width: 100%;
        height: 100%;
    }
    
    #iframe-close{
        color: #aaaaaa;
        float: right;
        font-size: 20px;
        font-weight: bold;
    }
    
    #iframe-close:hover,
    #iframe-close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }
    
    #iframe-container{
        display: none; 
        position: fixed;
        z-index: 1; 
        padding-top: 50px;
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
        align-items: center;
        justify-content: center;
    }

    #iframe-content {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
      }
    `
    var style_ele = document.createElement('style');
    style_ele.innerHTML = my_style;
    document.head.appendChild(style_ele);
}

function addProductPopup(url) {
    const ele = document.getElementById(url);
    if(ele){
        console.log('popup already exists', url);
        return ele;
    }
    //if not exists create new iframe popup 
    let iframe = document.createElement("iframe");
    iframe.src = url;
    let iframe_wrapper = document.createElement("div")
    iframe_wrapper.classList.add("iframe-wrapper");
    iframe_wrapper.id =  url;
    // append iframe to DOM
    iframe_wrapper.appendChild(iframe);
    document.getElementById('iframe-content').appendChild(iframe_wrapper);
    // return iframe window
    console.log('popup created ', url);
    return iframe_wrapper;
}

docReady(function() {
    
    //add container & style 
    initPopup();

    //keep track of active popup id
    var active_element;

    //regEx to match only gumroad products 
    const regx = new RegExp('(http|https)://(.*\.)?(gumroad).com/l/(.*)');

    //search all anchors and add onClick/hover listener when regEx matched
    const allAnchors = document.getElementsByTagName('a')
    for(var i=0; i < allAnchors.length; i++){
        if(regx.test(allAnchors[i].href)){
            allAnchors[i].addEventListener('mouseenter', function (e) {
                e.preventDefault();                
                //if the iframe for given url already exists then skip else
                //create new iframe & load into DOM 
                addProductPopup(this.href)
            });
            
            allAnchors[i].addEventListener('click', function (e) {
                e.preventDefault();
                //hide already existing iframe popup
                if(active_element){ active_element.style.display = 'none'; }
                
                //get the iframe popup related to this url
                active_element = addProductPopup(this.href);
                
                //disply container & iframe
                document.getElementById('iframe-container').style.display = 'block';
                active_element.style.display = 'flex';
            });
        }   
    }
    
    //close iframe window
    document.getElementById('iframe-close').addEventListener('click', function () {
        document.getElementById('iframe-container').style.display = 'none';
    })
});





