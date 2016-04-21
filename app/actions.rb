# Homepage (Root path)


get '/' do
	redirect '/rooms'
end

get '/rooms/?' do
	@room = Room.new
  erb :index
end

post '/rooms/?' do
	@room = Room.new(name: params[:room_name])
	if @room.save
		@room.reload
		redirect "/rooms/#{@room.id}"
	else
		erb :index
	end
end

get '/rooms/:id/?' do
	erb :'rooms/index'
end
