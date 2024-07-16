require_relative "lib/livestore/version"

Gem::Specification.new do |spec|
  spec.name        = "livestore"
  spec.version     = Livestore::VERSION
  spec.authors     = ["Stefan Buhrmester"]
  spec.email       = ["buhrmi@gmail.com"]
  spec.homepage    = "https://github.com/buhrmi/livestore"
  spec.summary     = "Push data into Svelte stores from Rails"
  spec.description = "Push data into Svelte stores from Rails"
  spec.license     = "MIT"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = spec.homepage

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "Rakefile"]
  end

  spec.add_dependency "rails", ">= 7.0.4"
end
