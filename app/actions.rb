# Homepage (Root path)

get '/' do
	redirect '/rooms'
end

get '/rooms/?' do
	@room = Room.new
  erb :index
end

post '/rooms/?' do
	@room = Room.new
	if @room.save
		@room.reload
		session[:host] = @room.id
		redirect "/rooms/#{@room.id}"
	else
		redirect '/rooms'
	end
end

get '/rooms/join/?' do
	@room = Room.find_by(id: params[:room_number])
	if @room
		redirect "/rooms/#{@room.id}"
	else
		@room = Room.new
		@room.errors.add(:id, "room not found")
		erb :index
	end
end

get '/rooms/:id/?' do
	@room = Room.find_by(id: params[:id])
	if @room
		erb :'rooms/index'
	else
		redirect '/rooms'
	end
end


post '/rooms/:room_id/songs' do
	@room = Room.find(params[:room_id])
	@song = @room.songs.new(url: params[:song_url])
	if @song.save
		redirect "/rooms/#{@room.id}/songs"
	else
		erb :'rooms/guest'
	end
end

get '/rooms/:room_id/next' do
	room = Room.find(params[:room_id])
	song_id = room.next_song_id
	content_type :json
	{video_id: song_id }.to_json
end

post '/rooms/:id/?' do
	room = Room.find(params[:id])
	song = room.songs.new(url: params[:link])
	if song.save
		json song
	else
		status 400
	end
end

