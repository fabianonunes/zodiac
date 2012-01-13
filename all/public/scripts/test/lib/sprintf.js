var format = (function () {
	var formatRegExp = /%[sdj%]/g, i;
	var format = function(f) {
		i = 1;
		var args = arguments;
		var len = args.length;
		var str = String(f).replace(formatRegExp, function(x) {
			if (i >= len) return x;
			switch (x) {
				case '%s': return String(args[i++]);
				case '%d': return Number(args[i++]);
				case '%j': return JSON.stringify(args[i++]);
				case '%%': return '%';
				default:
					return x;
			}
		});
		for (var x = args[i]; i < len; x = args[++i]) {
			str += ' ' + x;
		}
		return str;
	};
	return format;
}())