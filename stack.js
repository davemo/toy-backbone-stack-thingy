(function($){

	stack = function(config) {
		var $container = $('#'+config.containerId);
		$('<a href="#" class="stack-pop"><-- Back</a>').hide().appendTo($container);

		var findViews = function() {
			return $container.find('.stack-view');
		};

		var push = function(view) {
			var $views = findViews(),
					newContainerId = config.containerId+'-view-'+$views.length;
			
			
			$views.last().hide();
			var $new =$('<div id="'+newContainerId+'" class="stack-view"></div>').hide().appendTo($container);
			view.view.apply(this,[$.extend(view.config,{ 
				containerId: newContainerId 
			})]);						
			$new.show('slide',{direction:'right'},500)
			
			$.publish('stack/push');
		};

		var pop = function() {
			findViews().last().remove();
			findViews().last().show('slide',{direction:'left'},500);
			$.publish('stack/pop');
		}
		
		$.subscribe('stack/push',function() {
			if(findViews().length > 1) {
				$('.stack-pop').show();
			}
		});
		
		$.subscribe('stack/pop',function() {
			if(findViews().length <= 1) {
				$('.stack-pop').hide();
			}
		});

		$container.delegate('.stack-push','click', function(e){
			e.preventDefault();      
			push($(this).data('stack'));
		});    

		$container.delegate('.stack-pop','click', function(e){
			e.preventDefault();      
			pop();
		});

		push(config.top)    
	};

	WidgetA = function(config) {
		var $into = $('#'+config.containerId).append('<h1>Welcome to Widget A!</h1>');
		appendLinks($into,'B',3);
	}

	WidgetB = function(config) {
		var $into = $('#'+config.containerId).append('<h2>Welcome to Widget B!</h2>');    
		appendLinks($into,'C',7)
	}

	WidgetC = function(config) {
		var $into = $('#'+config.containerId).append('<h3>Welcome to Widget C!</h3>');    
		appendLinks($into,'D',123)
	}

	WidgetD = function(config) {
		var $into = $('#'+config.containerId).append('<h4>Welcome to Widget D!</h4>');    
		appendLinks($into,'A',1)
	}

	var appendLinks = function($into,name,number) {
		for(var i=0;i<number;i++) {
			var $link = $('<a href="#" class="stack-push">Go to '+name+' #'+i+'</a>').appendTo($into);
			$link.data('stack',{ view: window['Widget'+name], config: {id: i }  });
			$link.wrap('<li></li>');
		}
	};
})(jQuery);