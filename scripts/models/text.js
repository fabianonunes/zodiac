!function(){

	var CurrentText = Backbone.Model.extend({
		currentCid : function(){
			return this.get('doc').cid;
		}
	});

	var currentText = new CurrentText({});

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

			this.set({
				path : [
					previous && previous.get('path')
					, previous && ops[this.get('op')]
					, this.get('fileName')
				].join('')
			});

			if(previous){

				this.perform(true);
				this.bind('change:op', this.perform, this);
				previous.bind('change:lines', this.perform, this);

			} else {
				// needs to defer to force triggering change event
				_.defer(this.activate.bind(this, { length : this.get('lines').length }, true))
			}

		},

		perform : function(added){
			added = (added === true);
			var self = this;
			$.work('/scripts/workers/text.js', {
				op : this.get('op'),
				args : [this.get('previous').get('lines'), this.get('lines')]
			}).done(function(message){
				self.activate(message, added);
				if(!added){
					self.trigger('change:lines', message.lines);
				}
			});
		},

		sort : function(){
			$.work('/scripts/workers/text.js', {
				op : 'sort',
				args : [this.get('lines'), this.get('data')]
			}).done(this.set.bind(this));
		},

		activate : function(args, added){
			var params = args || {};
			params.activate = this.get('activate') + 1;
			var currentCid = currentText.get('doc') && currentText.get('doc').cid;
console.log('added->', added);
console.log('this.cid->', this.cid);
console.log('currentCid->', currentCid);
console.log('silent->', (!added && this.cid !== currentCid));
			this.set(params, { silent : (!added && this.cid !== currentCid) });
		}
			
	});


	var TextPeer = Backbone.Collection.extend({
	
		model: Text,
		currentDoc : currentText,
	
		initialize : function(){
		
			var self = this;
		
			_.bindAll(this, 'updateDocument', 'blend');
			this.bind('change:activate', this.updateDocument);
			// this.bind('add', this.updateDocument);
// 			this.currentDoc.bind('all', function(){
// console.log(arguments);
// 			});

		},
	
		updateDocument : function(m){
console.log('activated->', m.cid);
			this.currentDoc.set({ doc : m });
			this.trigger('change:currentIndex', m.cid)
		},

		blend : function(lines, fileName, op){

			this.add({
				previous : this.currentDoc.get('doc')
				, op : op
				, fileName : fileName
				, lines : lines
			});

		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;

}();
