// Loading Indicator
var class_LoadingIndicator = "loading_class"

var template = "<div class=" + class_LoadingIndicator + "> Rendering ... </div>"; 

function addLoadingIndicator(css_selector){

	$(css_selector).append(template);
	//console.log("on appelle add ...")

}

function removeLoadingIndicator(css_selector){

	$("." + class_LoadingIndicator).remove();
	//console.log("on appelle rimouve...")
	
}


