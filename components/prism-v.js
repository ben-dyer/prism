(function (Prism) {
	var interpolationExpr = {
		pattern: /[\s\S]+/,
		inside: null
	};

	Prism.languages.v = Prism.languages.extend('clike', {
		'string': [
			{
				pattern: /`(?:\\\`|\\?[^\`]{1,2})`/, // using {1,2} instead of `u` flag for compatibility
				alias: 'rune'
			},
			{
				pattern: /r?(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
				alias: 'quoted-string',
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:\{[^{}]*\}|\w+(?:\.\w+(?:\([^\(\)]*\))?|\[[^\[\]]+\])*)/,
						lookbehind: true,
						inside: {
							'interpolation-variable': {
								pattern: /^\$\w[\s\S]*$/,
								alias: 'variable'
							},
							'interpolation-punctuation': {
								pattern: /^\${|}$/,
								alias: 'punctuation'
							},
							'interpolation-expression': interpolationExpr
						}
					}
				}
			}
		],
		'class-name': {
			pattern: /(\b(?:enum|interface|struct|type)\s+)(?:C\.)?[\w]+/,
			lookbehind: true
		},
		'keyword': /(?:\b(?:as|asm|assert|atomic|break|chan|const|continue|defer|else|embed|enum|fn|for|__global|go(?:to)?|if|import|in|interface|is|lock|match|module|mut|none|or|pub|return|rlock|select|shared|sizeof|static|struct|type(?:of)?|union|unsafe)|\$(?:if|else|for)|#(?:include|flag))\b/,
		'number': /\b(?:0x[a-f\d]+(?:_[a-f\d]+)*|0b[01]+(?:_[01]+)*|0o[0-7]+(?:_[0-7]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?)\b/i,
		'operator': /~|\?|[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\.?/,
		'builtin': /\b(?:any(?:_int|_float)?|bool|byte(?:ptr)?|charptr|f(?:32|64)|i(?:8|16|nt|64|128)|rune|size_t|string|u(?:16|32|64|128)|voidptr)\b/
	});

	interpolationExpr.inside = Prism.languages.v;

	Prism.languages.insertBefore('v', 'operator', {
		'attribute': {
			pattern: /(^[\t ]*)\[(?:deprecated|unsafe_fn|typedef|live|inline|flag|ref_only|windows_stdcall|direct_array_access)\]/m,
			lookbehind: true,
			alias: 'annotation',
			inside: {
				'punctuation': /[\[\]]/,
				'keyword': /\w+/
			}
		},
		'generic': {
			pattern: /\<\w+\>(?=\s*[\)\{])/,
			inside: {
				'punctuation': /[<>]/,
				'class-name': /\w+/
			}
		}
	});

	Prism.languages.insertBefore('v', 'function', {
		'generic-function': {
			// e.g. foo<T>( ...
			pattern: /\b\w+\s*<\w+>(?=\()/,
			inside: {
				'function': /^\w+/,
				'generic': {
					pattern: /<\w+>/,
					inside: Prism.languages.v.generic.inside
				}
			}
		}
	});
}(Prism));
