function actualizarCacheDinamico(dynamicCache, req, res) {
	//console.log("res.ok", res.ok);
	if (res.ok) {
		return caches.open( dynamicCache )
			.then( cache => {
				cache.put( req, res.clone() );
				return res.clone();
			});
	}

	return res;
}