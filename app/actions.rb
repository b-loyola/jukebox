# Homepage (Root path)
get '/' do
	@rooms = Room.all
  erb :index
end
