# if development?
#   require 'dotenv'
#   Dotenv.load
# end

require 'rubygems'
require 'bundler/setup'

require 'active_support/all'

# Load Sinatra Framework (with AR)
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/contrib/all' # Requires cookies, among other things

# require 'pry' if development?
require 'yt'
require 'twilio-ruby'

require 'awesome_print'


APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__))
APP_NAME = APP_ROOT.basename.to_s

# Sinatra configuration
configure do
  set :root, APP_ROOT.to_path
  set :server, :puma

  enable :sessions
  set :session_secret, ENV['SESSION_KEY'] || 'lighthouselabssecret'

  set :views, File.join(Sinatra::Application.root, "app", "views")

# Twilio SID and Token
  account_sid = ENV['TWILIO_SID']
  auth_token = ENV['TWILIO_TOKEN']

#YouTube API Key
  Yt.configure do |config|
    config.api_key = ENV['YOUTUBE_KEY']
    config.log_level = :debug
  end
end

# Set up the database and models
require APP_ROOT.join('config', 'database')

# Load the routes / actions
require APP_ROOT.join('app', 'actions')
