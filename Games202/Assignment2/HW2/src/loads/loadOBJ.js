function loadOBJ(renderer, path, name, objMaterial, transform) {

	const manager = new THREE.LoadingManager();
	
	let loadedObject = null;

	manager.onLoad = function () {
		if (!loadedObject) return;

		loadedObject.traverse(function (child) {
			if (child.isMesh) {
				let geo = child.geometry;
				let mat;
				if (Array.isArray(child.material)) mat = child.material[0];
				else mat = child.material;

				var indices = Array.from({ length: geo.attributes.position.count }, (v, k) => k);

				let mesh = new Mesh({ name: 'aVertexPosition', array: geo.attributes.position.array },
					{ name: 'aNormalPosition', array: geo.attributes.normal.array },
					{ name: 'aTextureCoord', array: geo.attributes.uv.array },
					//null,
					indices, transform);
				let colorMap = new Texture();
				if (mat.map != null) {
					colorMap.CreateImageTexture(renderer.gl, mat.map.image);
					console.log("成功抓到貼圖圖片！物件為：", mat.map.image);
				}
				else {
					colorMap.CreateConstantTexture(renderer.gl, mat.color.toArray());
					console.warn("糟糕！Three.js 找不到這個模型的貼圖，啟動純色保底！");
				}

				let material, shadowMaterial;
				let Translation = [transform.modelTransX, transform.modelTransY, transform.modelTransZ];
				let Scale = [transform.modelScaleX, transform.modelScaleY, transform.modelScaleZ];

				let light = renderer.lights[0].entity;

				switch (objMaterial) {
					case 'PhongMaterial':
						material = buildPhongMaterial(colorMap, mat.specular.toArray(), light, Translation, Scale, "./src/shaders/phongShader/phongVertex.glsl", "./src/shaders/phongShader/phongFragment.glsl");
						shadowMaterial = buildShadowMaterial(light, Translation, Scale, "./src/shaders/shadowShader/shadowVertex.glsl", "./src/shaders/shadowShader/shadowFragment.glsl");
						break;
					// TODO: Add your PRTmaterial here

					case 'PRTMaterial':
						material = buildPRTMaterial("./src/shaders/prtShader/prtVertex.glsl", "./src/shaders/prtShader/prtFragment.glsl", colorMap);
						break;

					case 'SkyBoxMaterial':
						material = buildSkyBoxMaterial("./src/shaders/skyBoxShader/SkyBoxVertex.glsl", "./src/shaders/skyBoxShader/SkyBoxFragment.glsl");
						break;
				}

				material.then((data) => {
					let meshRender = new MeshRender(renderer.gl, mesh, data);
					renderer.addMeshRender(meshRender);
				});

				if (renderer.lights[0].entity.hasShadowMap == true) {
					shadowMaterial.then((data) => {
						let shadowMeshRender = new MeshRender(renderer.gl, mesh, data);
						renderer.addShadowMeshRender(shadowMeshRender);
					});
				}

			}
		});
	}

	manager.onProgress = function (item, loaded, total) {
		console.log(item, loaded, total);
	};

	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
			if (percentComplete == 100) {
				//console.log(renderer)
			}
		}
	}
	function onError() { }

	new THREE.MTLLoader(manager)
		.setPath(path)
		.load(name + '.mtl', function (materials) {
			materials.preload();
			new THREE.OBJLoader(manager)
				.setMaterials(materials)
				.setPath(path)
				.load(name + '.obj', function (object) {
					loadedObject = object;
				}, onProgress, onError);
		});
}