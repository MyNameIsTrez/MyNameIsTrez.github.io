# This "hook" is executed right before the site's pages are rendered
Jekyll::Hooks.register :site, :pre_render do |site|
	puts "Registering grug lexer..."
	require "rouge"
  
	# This class defines the grug lexer, which is used to highlight grug code blocks
  class Grug < Rouge::RegexLexer
    tag 'grug'
    filenames '*.grug'
    # mimetypes 'text/x-chdr', 'text/x-csrc'

    title 'grug'
    desc 'grug language'

    # optional comment or whitespace
    ws = %r((?:\s|//.*?\n|/[*].*?[*]/)+)
    id = /[a-zA-Z_][a-zA-Z0-9_]*/

    def self.keywords
      @keywords ||= Set.new %w(
        return if else for while break continue
      )
    end

    def self.keywords_type
      @keywords_type ||= Set.new %w(
        string i32
      )
    end

    def self.reserved
      @reserved ||= Set.new %w(
      )
    end

    def self.builtins
      @builtins ||= []
    end

    start { push :bol }

    state :expr_bol do
      mixin :inline_whitespace
      rule(//) { pop! }
    end

    # :expr_bol is the same as :bol but without labels, since
    # labels can only appear at the beginning of a statement.
    state :bol do
      mixin :expr_bol
    end

    state :inline_whitespace do
      rule %r/[ \t\r]+/, Text
      rule %r/\\\n/, Text # line continuation
    end

    state :whitespace do
      rule %r/\n+/m, Text, :bol
      rule %r(#(\\.|.)*?$), Comment::Single, :bol
      mixin :inline_whitespace
    end

    state :expr_whitespace do
      rule %r/\n+/m, Text, :expr_bol
      mixin :whitespace
    end

    state :statements do
      mixin :whitespace

      # This is for "creating-the-perfect-modding-language.md"
      # TODO: figure out a way to have the "limb" in the value
      # not highlighted in "l: limb = lr.limb"
      rule %r/human|limb_result|limb/, Keyword
      # rule %r/(?<!\.)limb/, Keyword
      # rule %r/\.limb/, Keyword
      # rule %r/(?<!\.)limb/ do |m|
      # rule %r/(?<!\`)limb/ do |m|
      #   puts m[0]
      #   puts m[1]
      #   token Keyword
      # end
      # rule %r/.*limb/ do |m|
      #   puts m[0]
      #   puts m[1]
      #   token Keyword
      # end
      # identifier = /limb/
      # rule %r/(?<!\.)#{identifier}/ do |m|
      #   puts m[0]
      #   puts m[1]
      #   token Keyword
      # end

      rule %r/(u8|u|U|L)?"/, Str, :string
      rule %r((u8|u|U|L)?'(\\.|\\[0-7]{1,3}|\\x[a-f0-9]{1,2}|[^\\'\n])')i, Str::Char
      rule %r((\d+[.]\d*|[.]?\d+)e[+-]?\d+[lu]*)i, Num::Float
      rule %r(\d+e[+-]?\d+[lu]*)i, Num::Float
      rule %r/0x[0-9a-f]+[lu]*/i, Num::Hex
      rule %r/0[0-7]+[lu]*/i, Num::Oct
      rule %r/\d+[lu]*/i, Num::Integer
      rule %r([~!%^&*+=\|?:<>/-]), Operator
      rule %r/[()\[\],.;]/, Punctuation
      rule %r/(?:true|false|NULL)\b/, Name::Builtin
      rule id do |m|
        name = m[0]

        if self.class.keywords.include? name
          token Keyword
        elsif self.class.keywords_type.include? name
          token Keyword::Type
        elsif self.class.reserved.include? name
          token Keyword::Reserved
        elsif self.class.builtins.include? name
          token Name::Builtin
        else
          token Name
        end
      end
    end

    state :root do
      mixin :expr_whitespace
      rule %r(
        (#{id})          # function name
        (\s*\([^;]*?\))  # signature
        ([\w*\s]+?[\s*]) # optional return arguments
        (#{ws}?)({)      # open brace
      )mx do |m|
        # TODO: do this better.
        token Name::Function, m[1] # function name
        recurse m[2] # signature
        recurse m[3] # optional return arguments
        recurse m[4] # open brace
        token Punctuation, m[5]
        if m[5] == ?{
          push :function
        end
      end
      rule %r/\{/, Punctuation, :function
      mixin :statements
    end

    state :function do
      mixin :whitespace
      mixin :statements
      rule %r/;/, Punctuation
      rule %r/{/, Punctuation, :function
      rule %r/}/, Punctuation, :pop!
    end

    state :string do
      rule %r/"/, Str, :pop!
      rule %r/\\([\\abfnrtv"']|x[a-fA-F0-9]{2,4}|[0-7]{1,3})/, Str::Escape
      rule %r/[^\\"\n]+/, Str
      rule %r/\\\n/, Str
      rule %r/\\/, Str # stray backslash
    end
  end
end