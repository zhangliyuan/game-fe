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
	.match('/components/lib/{jquery,jquery.ui,slimscroll,highcharts,fabric,jplayer,snap.svg,uploader}/**.js', {
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

	.match('/components/common/theme/img/logo.jpg', {
		useHash: false
	})

	.match('{/README\.md,/doc/**}', {
		release: false
	});





// 部署配置;(暂时保留)
fis.util.map([{
	name: '115',
	host: 'http://115.28.167.5',
	port: '8999'
},{
	name: '116',
	host: 'http://115.28.167.5',
	port: '8999'
}], function (index, item) {

	var static_domain   = 'http://115.28.167.5:8001',
		static_path     = item.host+':'+item.port+'/receiver',
		vm_path       = item.host + ':' + item.port + '/receiver',
		release_path = '/usr/local/tomcat/apache-tomcat-7.0.70/webapps/fe-admin';


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
			.match('/components/common/theme/img/logo.jpg', {
				useHash: false
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
			.match('{jplayer.blue.monday.min,*.min}.{js,css,scss}', {
				optimizer: false
			})

			.match('{/test/**,/server\.conf}', {
				release: false
			})

			.match('**', {
				domain: static_domain,
				deploy: fis.plugin('http-push', {
					receiver: static_path,
					to: '/game/static'
				})
			})
			.match('/views/(**.{vm,jsp,html})', {
				release: '$1',
				deploy: fis.plugin('http-push', {
					receiver: vm_path,
					to: release_path
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










