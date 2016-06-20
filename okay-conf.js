/**
 * @author nuer
 * @time 20151218
 */


fis.set('namespace', fis.get('okay.namespace') || 'game');
fis.set('charset', 'utf-8');

// default;
fis
	.match('/components/{common,page,widget}/**.js', {
		isMod: true
	})
	//TODO: lib中使用umd引入, 请在此加入;
	.match('/components/lib/{jquery,jquery.ui,slimscroll,highcharts,fabric,jplayer,snap.svg}/**.js', {
		isMod: true
	})
	.match('/test/example/route/(**)', {
		isMod:true
	})

	// test 目录原封不动发过去。
	.match('/test/(**)', {
		release: '/test/${namespace}/$1',
		isMod: false,
		useHash: false,
		//useCompile: false
	})
	.match('/test/example/route/(**)', {
		isMod:true
	})

	.match('/views/**.js', {
		isMod: true
	})

	.match('{/README\.md,/doc/**}', {
		release: false
	});





// 部署配置;
fis.util.map([{
	name: '112',
	host: 'http://10.60.0.112',
	port: '7999'
}, {
	name: '62',
	host: 'http://10.60.0.62',
	port: '7999'
}], function (index, item) {

	var static_domain   = 'http://10.60.0.'+parseInt(item.name)+':12345',
		static_path     = 'http://10.60.0.'+parseInt(item.name)+':7999/okay-upload',
		vm_path       = item.host + ':' + item.port + '/okay-upload';


	fis.util.map(['', 'm'], function (_index, _val) {

		fis.media( _val + item.name )
			// js, css, scss加md5;
			.match('**.{js,css,scss}', {
				useHash: true
			})
			// 图片加md5;
			.match(':image', {
				useHash: true
			})
			.match('::package', {
				// 图片合并
				spriter: fis.plugin('csssprites', {
					// 排列方式, linear || matrix
					layout: 'linear'
				})
			})
			.match('*.{css,scss}', {
				// 开启图片压缩;
				useSprite: true,
				// css 压缩;
				optimizer: fis.plugin('clean-css')
			})

			.match('{*.js,*.vm:js,*.html:js}', {
				// js 压缩;
				optimizer: fis.plugin('uglify-js', {

				})
			})
			//TODO: 将已压缩的js排除, 会影响编译速度;
			.match('{highcharts,jplayer.blue.monday.min,*.min}.{js,css,scss}', {
				optimizer: false
			})

			.match('{/test/**,/server\.conf}', {
				release: false
			})

			.match('**', {
				domain: static_domain,
				deploy: fis.plugin('http-push', {
					receiver: static_path,
					to: '/server/static-service/assets'
				})
			})
			.match('/views/(**.{vm,jsp})', {
				release: '$1',
				deploy: fis.plugin('http-push', {
					receiver: vm_path,
					to: '/webapps/ROOT/WEB-INF/pages/vm'
				})
			});

		// 不压缩处理;
		if ( '' === _val ) {
			fis.media( item.name )
				.match('*.{css,scss}', {
					optimizer: false
				})
				.match('{*.js,*.vm:js,*.html:js}', {
					optimizer: false
				});
		}

	});

});











