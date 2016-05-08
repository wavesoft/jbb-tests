(function(window, document) {

/**
 * Return new UUID
 */
function new_uuid() {
	var uuid = "";
	for (var i=0; i<24; i++) {
		uuid += String.fromCharCode( 97 + Math.floor(Math.random() * 25) );
	}
	return uuid;
}

/**
 * Utility class that hooks into all possible loading actions
 * and tracks the overall loading time.
 */
var LoadHook = function() {

	// Initialize properties
	this.active = false;
	this.invalidateCache = false;
	this.callback = null;

	this.queued = 0;
	this.completed = 0;
	this.errors = 0;

	this.checkTimeout = 0;

	this.firstEvent = 0;
	this.lastEvent = 0;

	// Override createElement function
	this.oldCreateElement = document.createElement;
	document.createElement = this.__handleCreateElement.bind(this);

    // Override the native XMLHttpRequest send()
    var scope = this;
    this.oldXHRSend = XMLHttpRequest.prototype.send;
    this.oldXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.send = function(){
        // Handle request
        scope.__handleXHRSend( this );
        // call the native send()
        scope.oldXHRSend.apply(this, arguments);
    }
    XMLHttpRequest.prototype.open = function(verb, url){
    	if (scope.invalidateCache) {
    		if (url.indexOf('?') == -1) {
    			arguments[1] = url + "?_=" + new_uuid();
    		} else {
    			arguments[1] = url + "&_=" + new_uuid();
    		}
    	}
        scope.oldXHROpen.apply(this, arguments);
    }

};

/**
 * Local function to handle XMLHttp 'send' requests
 */
LoadHook.prototype.__handleXHRSend = function( xhr ) {
	if (!this.active) return;

	// Hook into load and error events
	var scope = this;
	this.__markLoading();
	xhr.addEventListener( 'load', function ( event ) {
		scope.__markComplete( false );
	});
	xhr.addEventListener( 'error', function ( event ) {
		scope.__markComplete( true );
	});

}

/**
 * Local function to handle 'createElement' requests
 */
LoadHook.prototype.__handleCreateElement = function( tag ) {
	var elm = this.oldCreateElement.call(document, tag);
	if (!this.active) return elm;
	if (tag !== "img") return elm;

	// Hook into loading events on images
	var scope = this;
	this.__markLoading();
	elm.addEventListener( 'load', function ( event ) {
		scope.__markComplete( false );
	});
	elm.addEventListener( 'error', function ( event ) {
		scope.__markComplete( true );
	});

	// Override 'src' setter if we need to invalidate cache
	if (this.invalidateCache) {
		Object.defineProperty( elm, 'src', {
			enumerable: true,
			configurable: true,
			get: function(){
			    return this.getAttribute('src')
			},
			set: function(newval){
				if (newval.indexOf('?') == -1) {
					newval += "?_=" + new_uuid();
				} else {
					newval += "&_=" + new_uuid();
				}
				console.log("set->",newval);
			    this.setAttribute('src',newval);
			}
		})
	}

	return elm;
}

/**
 * Mark a loading action
 */
LoadHook.prototype.__markLoading = function() {
	this.queued++;
	if (this.firstEvent === 0)
		this.firstEvent = Date.now();
}

/**
 * Mark a completion action
 */
LoadHook.prototype.__markComplete = function( error ) {
	this.completed++;
	if (error) this.errors++;
	this.lastEvent = Date.now();

	clearTimeout(this.checkTimeout);
	this.checkTimeout = setTimeout( this.__checkCompleted.bind(this), 50 );
}

/**
 * Helper to trigger callback when no i/o operations are active
 */
LoadHook.prototype.__checkCompleted = function() {
	if (this.completed === this.queued) {
		if (this.callback)
			this.callback( this.lastEvent - this.firstEvent );
		this.stop();
	}
}

/**
 * Pause all actions and disable
 */
LoadHook.prototype.stop = function() {
	this.active = false;
	this.invalidateCache = false;
};

/**
 * Start tracking and call the given callback when done loading all resources
 */
LoadHook.prototype.start = function( callback ) {
	this.active = true;
	this.invalidateCache = true;
	this.callback = callback;

	// Reset properties
	this.queued = 0;
	this.completed = 0;
	this.errors = 0;
	this.checkTimeout = 0;
	this.firstEvent = 0;
	this.lastEvent = 0;

};

// Expose
window.LoadHook = LoadHook;

})(window, document);
