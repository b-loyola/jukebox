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

post '/rooms/:id/?' do
	content_type :json
	room = Room.find(params[:id])
	song = room.songs.new(url: params[:link])
	if song.save
		{song: song}.to_json
	else
		status 400
	end
end

get '/rooms/:id/song/?' do
	content_type :json
	room = Room.find(params[:id])
	song = room.songs[0]
	room.increment_counter
	{song: song}.to_json
end

get '/rooms/:room_id/songs/current' do
	content_type :json
	room = Room.find(params[:room_id])
	song = room.current_song
	if song
		{song: song}.to_json
	end
end

get '/rooms/:room_id/songs/next' do
	content_type :json
	room = Room.find(params[:room_id])
	song = nil
	if room.next_song
		song = room.next_song
		room.increment_counter
	else
		song = room.songs.sample
	end
	{song: song}.to_json
end

get '/rooms/:room_id/songs/all' do
	content_type :json
	room = Room.find(params[:room_id])
	playlist = room.songs.order(created_at: :desc).limit(5)
	{playlist: playlist}.to_json
end







