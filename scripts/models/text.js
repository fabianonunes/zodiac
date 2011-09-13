!function(){


	window.models = {};

	var ops = {
		union : '∪'
		, intersection : '∩'
		, difference : '∖'
		, symmetric : '⊖'
	};

	var Text = Backbone.Model.extend({

		defaults : { activate : 0 },
		
		initialize : function(){
			
			window.models[this.cid] = this;

			var previous = this.get('previous');

			if(previous){
		
				this.perform(true);
				this.bind('change:op', this.perform, this);
				previous.bind('change:lines', this.perform, this);
			
			} else {
				// needs to defer to force triggering change event
				_.defer(this.activate.bind(this, { length : this.get('lines').length }));
			}

		},
		perform : function(added){
			var self = this;
			$.work('/scripts/workers/text.js', {
				op : this.get('op'),
				args : [this.get('previous').get('lines'), this.get('origin')]
			}).done(function(message){
				(added === true) ? self.activate(message) : self.set(message);
				self.trigger('change:performed', self);
			});
		},
		sort : function(){
			$.work('/scripts/workers/text.js', {
				op : 'sort',
				args : [this.get('lines'), this.get('data')]
			}).done(this.set.bind(this));
		},
		activate : function(args){
			var params = args || {};
			params.activate = this.get('activate') + 1;
			this.set(params);
		}
			
	});

	// TODO: isso aqui não precisa ser uma Collection. O método set é muito caro.
	var CurrentText = Backbone.Collection.extend({

		initialize : function(){
			_.bindAll(this, 'set', 'sameAs');
		},
		
		set : function(m){
			this.reset([_.extend({id:m.cid}, m.toJSON())]);
		},

		sameAs : function(m){
			if(m.cid == this.first().get('id')){
				m.trigger("change:activate", m);
			}
		}

	});

	var TextPeer = Backbone.Collection.extend({
	
		model: Text,
		document : new CurrentText([{}]),
		documentId : null,
	
		initialize : function(){

			var self = this;

			_.bindAll(this, 'updateDocument', 'blend');

			this.bind('change:activate', this.updateDocument);
			this.bind('change:added', this.updateDocument);
			this.bind('change:performed', this.performed);

		},

		performed : function(m){
			if(m.cid === this.documentId){
				m.trigger("change:activate", m);
			}
		},
	
		updateDocument : function(m){
			this.documentId = m.cid;
			this.trigger('change:currentIndex', m.cid, m)
		},

		blend : function(lines, fileName, op){
			this.add({
				previous : this.getByCid(this.document.first().get('id'))
				, op : op
				, fileName : fileName
				, lines : lines
				, origin : lines
			});
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;

}();


			// this.set({
			// 	path : [
			// 		previous && previous.get('path')
			// 		, previous && ops[this.get('op')]
			// 		, this.get('fileName')
			// 	].join('')
			// });
