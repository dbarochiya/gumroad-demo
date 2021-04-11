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
    
    .popup-button {
        background-color: #fff;
        background-repeat: repeat-x;
        border-radius: 4px;
        box-shadow: 0 0 2px rgb(0 0 0 / 40%);
        color: #999!important;
        display: inline-block;
        font-size: 16px;
        font-weight: 500;
        line-height: 50px;
        padding: 0 15px;
        margin: 5px;
        text-decoration:none;
    }
    `
    var style_ele = document.createElement('style');
    style_ele.innerHTML = my_style;
    document.head.appendChild(style_ele);
}

//creates Iframe 
function createIframe(url) {
    let iframe = document.createElement("iframe");
    iframe.src = url;
    let iframe_wrapper = document.createElement("div")
    iframe_wrapper.classList.add("iframe-wrapper");
    iframe_wrapper.id =  url;
    iframe_wrapper.style.display = 'none'
    iframe_wrapper.appendChild(iframe);
    return iframe_wrapper;
}

//add iframe as embed 
function processAsEmbed(ele) {
    console.log('embed created', ele.href);
    var iframe_wrapper = createIframe(ele.href)
    iframe_wrapper.style.display = 'flex';
    ele.insertAdjacentElement("afterend", iframe_wrapper);
    ele.remove();
}

//creates popup
function addProductPopup(url) {
    const ele = document.getElementById(url);
    if(ele){
        console.log('popup already exists', url);
        return ele;
    }
    const iframe_wrapper = createIframe(url);
    // append iframe to DOM
    document.getElementById('iframe-content').appendChild(iframe_wrapper);
    // return iframe window
    console.log('popup created ', url);
    return iframe_wrapper;
}

//creates overlay listners on hover/click
function processAsOverlay(ele) {
    if(ele.hasAttribute('button-show')){
        ele.classList.add('popup-button');
    }
    ele.addEventListener('mouseenter', function (e) {
        e.preventDefault();                
        //if the iframe for given url already exists then skip else
        //create new iframe & load into DOM 
        addProductPopup(this.href)
    });
    
    ele.addEventListener('click', function (e) {
        e.preventDefault();
        //hide already existing iframe popup
        if(active_popup_element){ active_popup_element.style.display = 'none'; }
        
        //get the iframe popup related to this url
        active_popup_element = addProductPopup(this.href);
        
        //disply container & iframe
        document.getElementById('iframe-container').style.display = 'block';
        active_popup_element.style.display = 'flex';
    });


}

//keep track of active popup id
var active_popup_element;

docReady(function() {
    
    //add container & style 
    initPopup();

    //regEx to match only gumroad products 
    const regx1 = new RegExp('(http|https)://gumroad.com/l/(.*)');
    const regx2 = new RegExp('(http|https)://(.*\.)?(gumroad).com/(.*)');

    //search all anchors and add onClick/hover listener when regEx matched
    const allAnchors = document.getElementsByTagName('a')
    for(var i=0; i < allAnchors.length; i++){
        if(regx1.test(allAnchors[i].href) || regx2.test(allAnchors[i].href)){
            switch(allAnchors[i].type){
                case "embed": 
                    processAsEmbed(allAnchors[i]);
                    break;
                case "overlay":
                default:
                    processAsOverlay(allAnchors[i]);
                break; 
            }
        }   
    }
    
    //close iframe window
    document.getElementById('iframe-close').addEventListener('click', function () {
        document.getElementById('iframe-container').style.display = 'none';
        active_popup_element.style.display = 'none';
    })
});
