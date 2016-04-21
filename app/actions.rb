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
	@room = Room.find(params[:id])
	erb :'rooms/index'
end

get '/rooms/:room_id/next' do
	content_type :json
	{video_id: 'CxKWTzr-k6s'}.to_json
end

post '/rooms/:id/?' do
	@room = Room.find(params[:id])
	@song = @room.songs.new(url: params[:link])
	if @song.save
		json @song
	else
		status 400
	end
end

