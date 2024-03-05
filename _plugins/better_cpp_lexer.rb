Jekyll::Hooks.register :site, :pre_render do |site|
	puts "Registering BetterCpp lexer..."
	require "rouge"
  
  class BetterCpp < Rouge::Lexers::Cpp
    tag 'bettercpp'
    filenames '*.bettercpp'

    title 'BetterCpp'
    desc 'BetterCpp language'

    prepend :statements do
      rule %r/f64|i32|string/, Keyword::Type
    end
  end
end
