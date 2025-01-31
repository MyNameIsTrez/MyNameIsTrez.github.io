# This hook is executed right before the site's pages are rendered
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
        return if else while break continue
      )
    end

    def self.keywords_type
      @keywords_type ||= Set.new %w(
        string i32 f64 bool id
      )
    end

    start { push :bol }

    state :expr_bol do
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

      # if-statement and while-loop
      rule %r/(#{id}) (?=(\(.*\)))/m do |m|
        # if self.class.keywords.include? m[1]
        token Keyword
        # end
      end

      # define, on_, helper_, other function calls
      rule %r/(#{id})(?=(\(.*\)))/m do |m|
        fn_name = m[1]
        if fn_name == "define"
          token Generic::Error, fn_name # Red
        elsif fn_name.start_with? "on_"
          token Str, fn_name # Green
        elsif fn_name.start_with? "helper_"
          token Name::Function, fn_name # Blue
        else
          token Name::Entity, fn_name # Purple
        end
      end

      rule %r/(u8|u|U|L)?"/, Str, :string
      rule %r((u8|u|U|L)?'(\\.|\\[0-7]{1,3}|\\x[a-f0-9]{1,2}|[^\\'\n])')i, Str::Char
      rule %r((\d+[.]\d*|[.]?\d+)e[+-]?\d+[lu]*)i, Num::Float
      rule %r(\d+e[+-]?\d+[lu]*)i, Num::Float
      rule %r/0x[0-9a-f]+[lu]*/i, Num::Hex
      rule %r/0[0-7]+[lu]*/i, Num::Oct
      rule %r/\d+[lu]*/i, Num::Integer
      rule %r([~!%^&*+=\|?:<>/-]), Operator
      rule %r/[()\[\],.]/, Punctuation
      rule %r/(?:and|or|not)\b/, Operator
      rule %r/(?:true|false|me|null_id)\b/, Name::Builtin

      rule id do |m|
        name = m[0]

        if self.class.keywords.include? name
          token Keyword
        elsif self.class.keywords_type.include? name
          token Keyword::Type
        else
          token Name
        end
      end
    end

    state :root do
      # This is for "creating-the-perfect-modding-language.md",
      # so that "human" gets highlighted in "on_human_death(self: human) {"
      rule %r/ human/, Keyword

      rule %r(
        (#{id})         # function name
        (\s*\(.*\)) # signature
        (\s\w*)         # optional return type
        (#{ws}?)({)     # open brace
      )mx do |m|
        fn_name = m[1]
        if fn_name == "define"
          token Generic::Error, fn_name # Red
        elsif fn_name.start_with? "on_"
          token Str, fn_name # Green
        elsif fn_name.start_with? "helper_"
          token Name::Function, fn_name # Blue
        else
          token Name::Entity, fn_name # Purple
        end

        recurse m[2] # signature
        recurse m[3] # optional return type
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
      # This is for "creating-the-perfect-modding-language.md",
      # so that only the first "limb" gets highlighted in "hr: human_result = hr.human_result"
      rule %r/ human_result/, Keyword
      
      mixin :statements
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
